package com.fitness.config;

import com.fitness.interceptor.GuestInterceptor;
import com.fitness.interceptor.LoginInterceptor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * Web配置类
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /** 注册拦截器 */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 管理员登录拦截器
        registry.addInterceptor(new LoginInterceptor())
                .addPathPatterns("/admin/**")
                .excludePathPatterns("/admin/login", "/admin/login/page", "/admin/css/**", "/admin/js/**");

        // 游客写操作拦截器
        registry.addInterceptor(new GuestInterceptor())
                .addPathPatterns("/training/api/**", "/plan/api/**", "/exercise/api/**")
                .excludePathPatterns("/exercise/api/list");
    }

    /** 静态资源配置 */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
        registry.addResourceHandler("/video/**")
                .addResourceLocations("classpath:/static/video/");
    }

    /** SPA 路由过滤器：非 API、非静态资源请求全部转发到 index.html */
    @Bean
    public FilterRegistrationBean<SpaFilter> spaFilter() {
        FilterRegistrationBean<SpaFilter> bean = new FilterRegistrationBean<>();
        bean.setFilter(new SpaFilter());
        bean.addUrlPatterns("/*");
        bean.setOrder(-1);
        return bean;
    }

    public static class SpaFilter implements Filter {
        @Override
        public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
                throws IOException, ServletException {
            HttpServletRequest req = (HttpServletRequest) request;
            String path = req.getRequestURI();
            String ctx = req.getContextPath();
            String sub = path.substring(ctx.length());

            // 放行：根路径、API 请求、静态资源、文件资源
            if (sub.equals("/") || sub.isEmpty() ||
                sub.contains("/api/") || sub.startsWith("/admin/login") ||
                sub.startsWith("/_next/") || sub.startsWith("/static/") ||
                sub.startsWith("/video/") ||
                sub.contains(".")) {
                chain.doFilter(request, response);
                return;
            }
            // SPA 路由：转发到对应页面的 index.html
            String target = sub;
            if (target.endsWith("/")) {
                target = target.substring(0, target.length() - 1);
            }
            req.getRequestDispatcher(target + "/index.html").forward(request, response);
        }
    }
}
