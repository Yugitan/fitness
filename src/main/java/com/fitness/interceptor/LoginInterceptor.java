package com.fitness.interceptor;

import com.fitness.annotation.RequiresAdmin;
import com.fitness.common.Result;
import com.fitness.entity.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 登录拦截器（管理员后台预留）
 * 拦截/admin/**路径下的所有请求，验证用户是否登录且拥有管理员权限
 */
public class LoginInterceptor implements HandlerInterceptor {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) throws Exception {
        // 预检请求直接放行
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        // 非HandlerMethod直接放行
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;

        // 检查方法或类上是否有@RequiresAdmin注解
        RequiresAdmin classAnnotation = handlerMethod.getBeanType().getAnnotation(RequiresAdmin.class);
        RequiresAdmin methodAnnotation = handlerMethod.getMethodAnnotation(RequiresAdmin.class);

        if (classAnnotation == null && methodAnnotation == null) {
            return true; // 无需管理员权限，放行
        }

        // 需要管理员权限，验证登录状态
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loginUser") == null) {
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(objectMapper.writeValueAsString(
                    Result.unauthorized("请先登录管理员账号")));
            return false;
        }

        User loginUser = (User) session.getAttribute("loginUser");
        int minRole = methodAnnotation != null ? methodAnnotation.minRole() : classAnnotation.minRole();

        if (loginUser.getRole() < minRole) {
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(objectMapper.writeValueAsString(
                    Result.forbidden("权限不足")));
            return false;
        }

        return true;
    }
}
