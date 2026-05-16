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

    /** 后台管理主页面 */
    @GetMapping("")
    @RequiresAdmin
    public String index(Model model, HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        model.addAttribute("loginUser", loginUser);
        return "admin/index";
    }

    /** 仪表盘页面 */
    @GetMapping("/dashboard")
    @RequiresAdmin
    public String dashboard(Model model) {
        return "admin/index";
    }

    /** 用户管理页面 */
    @GetMapping("/user/list")
    @RequiresAdmin
    public String userListPage() {
        return "admin/user/list";
    }

    /** 动作库管理页面 */
    @GetMapping("/exercise/list")
    @RequiresAdmin
    public String exerciseListPage() {
        return "admin/exercise/list";
    }

    /** 计划管理页面 */
    @GetMapping("/plan/list")
    @RequiresAdmin
    public String planListPage() {
        return "admin/plan/list";
    }

    /** 博主管理页面 */
    @GetMapping("/blogger/list")
    @RequiresAdmin
    public String bloggerListPage() {
        return "admin/blogger/list";
    }

    /** 博主计划管理页面 */
    @GetMapping("/blogger/plan")
    @RequiresAdmin
    public String bloggerPlanPage() {
        return "admin/blogger/plan";
    }

    /** 系统配置页面 */
    @GetMapping("/config")
    @RequiresAdmin
    public String configPage() {
        return "admin/config";
    }
}
