package com.fitness.controller;

import com.fitness.common.Result;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 数据统计控制器（数据统计可视化预留）
 */
@Controller
@RequestMapping("/statistics")
public class StatisticsController {

    /** 数据统计页面 */
    @GetMapping
    public String statisticsPage() {
        return "statistics";
    }

    /** API：个人训练统计（预留） */
    @GetMapping("/api/personal")
    @ResponseBody
    public Result personalStats() {
        // 预留接口，返回空数据占位
        return Result.success();
    }

    /** API：月度训练趋势（预留） */
    @GetMapping("/api/monthly-trend")
    @ResponseBody
    public Result monthlyTrend() {
        return Result.success();
    }

    /** API：动作使用频率统计（预留） */
    @GetMapping("/api/exercise-frequency")
    @ResponseBody
    public Result exerciseFrequency() {
        return Result.success();
    }
}
