package com.fitness.controller;

import com.fitness.service.BloggerService;
import com.fitness.service.ExerciseService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.annotation.Resource;

/**
 * 首页控制器
 */
@Controller
public class IndexController {

    @Resource
    private ExerciseService exerciseService;

    @Resource
    private BloggerService bloggerService;

    /** 前台首页 */
    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("exercises", exerciseService.listAll());
        model.addAttribute("bloggers", bloggerService.listRecommended());
        return "forward:/index.html";
    }

    /** 动作库页面 */
    @GetMapping("/exercise")
    public String exercisePage(Model model) {
        return "redirect:/exercise/";
    }

    /** 训练记录页面 */
    @GetMapping("/training")
    public String trainingPage() {
        return "redirect:/training/";
    }

    /** 训练计划页面 */
    @GetMapping("/plan")
    public String planPage() {
        return "redirect:/plan/";
    }

    /** 博主列表页面 */
    @GetMapping("/blogger")
    public String bloggerPage() {
        return "redirect:/blogger/";
    }

    /** 管理员后台入口 */
    @GetMapping("/admin/login/page")
    public String adminLoginPage() {
        return "redirect:/admin/login/";
    }

    /** 用户登录页面 */
    @GetMapping("/login")
    public String loginPage() {
        return "redirect:/login/";
    }

    /** 用户注册页面 */
    @GetMapping("/register")
    public String registerPage() {
        return "redirect:/register/";
    }
}
