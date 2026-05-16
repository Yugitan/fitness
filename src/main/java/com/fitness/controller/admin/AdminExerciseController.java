package com.fitness.controller.admin;

import com.fitness.annotation.RequiresAdmin;
import com.fitness.common.Result;
import com.fitness.entity.Exercise;
import com.fitness.service.ExerciseService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

/**
 * 动作库管理接口（管理员后台预留）
 */
@RestController
@RequestMapping("/admin/api/exercise")
public class AdminExerciseController {

    @Resource
    private ExerciseService exerciseService;

    /** 动作列表 */
    @GetMapping("/list")
    public Result list() {
        return Result.success(exerciseService.listAll());
    }

    /** 新增动作 */
    @PostMapping("/create")
    public Result create(@RequestBody Exercise exercise) {
        return Result.success("新增成功", exerciseService.create(exercise));
    }

    /** 更新动作 */
    @PutMapping("/{id}")
    public Result update(@PathVariable Long id, @RequestBody Exercise exercise) {
        exercise.setId(id);
        return Result.success("更新成功", exerciseService.update(exercise));
    }

    /** 删除动作 */
    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Long id) {
        exerciseService.delete(id);
        return Result.success("删除成功");
    }
}
