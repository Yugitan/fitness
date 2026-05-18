package com.fitness.controller.admin;

import com.fitness.annotation.RequiresAdmin;
import com.fitness.common.Result;
import com.fitness.entity.User;
import com.fitness.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

/**
 * 管理员后台控制器（管理员后台预留）
 */
@Controller
@RequestMapping("/admin")
public class AdminController {

    @Resource
    private UserService userService;

    /** 管理员登录API */
    @PostMapping("/login")
    @ResponseBody
    public Result login(@RequestBody User loginRequest, HttpSession session) {
        User user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
        if (user.getRole() < 1) {
            return Result.forbidden("无管理员权限");
        }
        session.setAttribute("loginUser", user);
        return Result.success("登录成功", user);
    }

    /** 管理员退出API */
    @PostMapping("/logout")
    @ResponseBody
    public Result logout(HttpSession session) {
        session.invalidate();
        return Result.success("已退出登录");
    }

    /** 后台管理主页面（SPA 路由） */
    @GetMapping("")
    @RequiresAdmin
    public String index(Model model, HttpSession session) {
        return "redirect:/admin/";
    }

    /** 仪表盘页面（SPA 路由） */
    @GetMapping("/dashboard")
    @RequiresAdmin
    public String dashboard(Model model) {
        return "redirect:/admin/";
    }

    /** 用户管理页面（SPA 路由） */
    @GetMapping("/user/list")
    @RequiresAdmin
    public String userListPage() {
        return "redirect:/admin/user/";
    }

    /** 动作库管理页面（SPA 路由） */
    @GetMapping("/exercise/list")
    @RequiresAdmin
    public String exerciseListPage() {
        return "redirect:/admin/exercise/";
    }

    /** 计划管理页面（SPA 路由） */
    @GetMapping("/plan/list")
    @RequiresAdmin
    public String planListPage() {
        return "redirect:/admin/plan/";
    }

    /** 博主管理页面（SPA 路由） */
    @GetMapping("/blogger/list")
    @RequiresAdmin
    public String bloggerListPage() {
        return "redirect:/admin/blogger/";
    }

    /** 博主计划管理页面（SPA 路由） */
    @GetMapping("/blogger/plan")
    @RequiresAdmin
    public String bloggerPlanPage() {
        return "redirect:/admin/blogger/plan/";
    }

    /** 系统配置页面（SPA 路由） */
    @GetMapping("/config")
    @RequiresAdmin
    public String configPage() {
        return "redirect:/admin/config/";
    }
}
