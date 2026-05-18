package com.fitness.controller;

import com.fitness.common.Result;
import com.fitness.entity.Exercise;
import com.fitness.service.ExerciseService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 健身动作控制器
 */
@Controller
@RequestMapping("/exercise")
public class ExerciseController {

    @Resource
    private ExerciseService exerciseService;

    /** 动作详情页 */
    @GetMapping("/{id}")
    public String detail(@PathVariable Long id, Model model) {
        exerciseService.incrementViewCount(id);
        model.addAttribute("exercise", exerciseService.getById(id));
        return "exercise/detail";
    }

    /** API：获取所有动作 */
    @GetMapping("/api/list")
    @ResponseBody
    public Result list(@RequestParam(required = false) String category,
                        @RequestParam(required = false) String keyword) {
        List<Exercise> exercises;
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        boolean hasCategory = category != null && !category.trim().isEmpty();
        if (hasKeyword && hasCategory) {
            exercises = exerciseService.searchByCategoryAndKeyword(category, keyword.trim());
        } else if (hasKeyword) {
            exercises = exerciseService.search(keyword);
        } else if (hasCategory) {
            exercises = exerciseService.listByCategory(category);
        } else {
            exercises = exerciseService.listAll();
        }
        return Result.success(exercises);
    }

    /** API：获取动作详情 */
    @GetMapping("/api/{id}")
    @ResponseBody
    public Result getDetail(@PathVariable Long id) {
        exerciseService.incrementViewCount(id);
        return Result.success(exerciseService.getById(id));
    }
}
