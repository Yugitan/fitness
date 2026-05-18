package com.fitness.controller;

import com.fitness.common.Result;
import com.fitness.service.BloggerService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

/**
 * 博主控制器（博主专区预留）
 */
@Controller
@RequestMapping("/blogger")
public class BloggerController {

    @Resource
    private BloggerService bloggerService;

    /** 博主列表页（SPA 路由） */
    @GetMapping("/list")
    public String listPage(Model model) {
        return "redirect:/blogger/";
    }

    /** 博主详情页（SPA 路由） */
    @GetMapping("/{id:[0-9]+}")
    public String detail(@PathVariable Long id, Model model) {
        return "redirect:/blogger/" + id + "/";
    }

    /** 博主计划详情页（SPA 路由） */
    @GetMapping("/plan/{id:[0-9]+}")
    public String planDetail(@PathVariable Long id, Model model) {
        return "redirect:/blogger/plan/" + id + "/";
    }

    /** API：博主列表 */
    @GetMapping("/api/list")
    @ResponseBody
    public Result list(@RequestParam(required = false) String category) {
        if (category != null && !category.trim().isEmpty()) {
            return Result.success(bloggerService.listByCategory(category));
        }
        return Result.success(bloggerService.listAll());
    }

    /** API：推荐博主 */
    @GetMapping("/api/recommended")
    @ResponseBody
    public Result recommended() {
        return Result.success(bloggerService.listRecommended());
    }

    /** API：博主详情 */
    @GetMapping("/api/{id}")
    @ResponseBody
    public Result getDetail(@PathVariable Long id) {
        return Result.success(bloggerService.getById(id));
    }

    /** API：博主计划列表 */
    @GetMapping("/api/{bloggerId}/plans")
    @ResponseBody
    public Result plans(@PathVariable Long bloggerId) {
        return Result.success(bloggerService.listPlansByBloggerId(bloggerId));
    }

    /** API：所有上架博主计划 */
    @GetMapping("/api/plans")
    @ResponseBody
    public Result allOnlinePlans() {
        return Result.success(bloggerService.listAllOnlinePlans());
    }

    /** API：博主计划详情 */
    @GetMapping("/api/plan/{id}")
    @ResponseBody
    public Result planDetailApi(@PathVariable Long id) {
        return Result.success(bloggerService.getPlanById(id));
    }
}
