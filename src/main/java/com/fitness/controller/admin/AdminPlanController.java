package com.fitness.controller.admin;

import com.fitness.annotation.RequiresAdmin;
import com.fitness.common.Result;
import com.fitness.service.PlanService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

/**
 * 计划管理接口（管理员后台预留）
 */
@RestController
@RequestMapping("/admin/api/plan")
public class AdminPlanController {

    @Resource
    private PlanService planService;

    /** 所有用户计划列表 */
    @GetMapping("/list")
    public Result list() {
        return Result.success(planService.listAll(null));
    }

    /** 下架/删除违规计划 */
    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Long id) {
        planService.delete(id);
        return Result.success("计划已下架");
    }
}
