package com.fitness.controller;

import com.fitness.common.Result;
import com.fitness.entity.User;
import com.fitness.service.StatisticsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

/**
 * 数据统计控制器
 */
@Controller
@RequestMapping("/statistics")
public class StatisticsController {

    @Resource
    private StatisticsService statisticsService;

    /** 从 session 获取当前登录用户 ID（统计仅展示本人数据） */
    private Long getCurrentUserId(HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) return null;
        return loginUser.getId();
    }

    /** 数据统计页面（SPA 路由） */
    @GetMapping
    public String statisticsPage() {
        return "redirect:/statistics/";
    }

    /** API：个人训练统计 */
    @GetMapping("/api/personal")
    @ResponseBody
    public Result personalStats(HttpSession session) {
        Long userId = getCurrentUserId(session);
        return Result.success(statisticsService.getPersonalStats(userId));
    }

    /** API：月度训练趋势 */
    @GetMapping("/api/monthly-trend")
    @ResponseBody
    public Result monthlyTrend(HttpSession session) {
        Long userId = getCurrentUserId(session);
        return Result.success(statisticsService.getMonthlyTrend(userId));
    }

    /** API：动作使用频率统计 */
    @GetMapping("/api/exercise-frequency")
    @ResponseBody
    public Result exerciseFrequency(HttpSession session) {
        Long userId = getCurrentUserId(session);
        return Result.success(statisticsService.getExerciseFrequency(userId));
    }
}
