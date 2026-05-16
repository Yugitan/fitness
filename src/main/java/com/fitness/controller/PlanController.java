package com.fitness.controller;

import com.fitness.common.Result;
import com.fitness.entity.Plan;
import com.fitness.entity.PlanDetail;
import com.fitness.entity.PlanGroup;
import com.fitness.service.PlanService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 训练计划控制器
 */
@Controller
@RequestMapping("/plan")
public class PlanController {

    @Resource
    private PlanService planService;

    /** 计划创建/编辑页面 */
    @GetMapping("/create")
    public String createPage(Model model) {
        model.addAttribute("groups", planService.listGroups(null));
        return "plan/create";
    }

    /** 计划详情页 */
    @GetMapping("/{id}")
    public String detail(@PathVariable Long id, Model model) {
        model.addAttribute("plan", planService.getById(id));
        return "plan/detail";
    }

    /** API：查询所有计划 */
    @GetMapping("/api/list")
    @ResponseBody
    public Result list(@RequestParam(required = false) Long groupId,
                        @RequestParam(required = false) Long userId) {
        List<Plan> plans;
        if (groupId != null) {
            plans = planService.listByGroupId(groupId, userId);
        } else {
            plans = planService.listAll(userId);
        }
        return Result.success(plans);
    }

    /** API：获取计划详情 */
    @GetMapping("/api/{id}")
    @ResponseBody
    public Result getDetail(@PathVariable Long id) {
        return Result.success(planService.getById(id));
    }

    /** API：创建计划 */
    @PostMapping("/api/create")
    @ResponseBody
    public Result create(@RequestBody Plan plan) {
        List<PlanDetail> details = plan.getDetails();
        Plan created = planService.create(plan, details);
        return Result.success("创建成功", created);
    }

    /** API：更新计划 */
    @PutMapping("/api/{id}")
    @ResponseBody
    public Result update(@PathVariable Long id, @RequestBody Plan plan) {
        plan.setId(id);
        Plan updated = planService.update(plan, plan.getDetails());
        return Result.success("更新成功", updated);
    }

    /** API：删除计划 */
    @DeleteMapping("/api/{id}")
    @ResponseBody
    public Result delete(@PathVariable Long id) {
        planService.delete(id);
        return Result.success("删除成功");
    }

    /** API：复制计划 */
    @PostMapping("/api/{id}/copy")
    @ResponseBody
    public Result copy(@PathVariable Long id) {
        Plan copied = planService.copy(id);
        return Result.success("复制成功", copied);
    }

    /** API：一键套用模板 */
    @GetMapping("/api/{id}/apply")
    @ResponseBody
    public Result applyTemplate(@PathVariable Long id) {
        Plan plan = planService.applyTemplate(id);
        return Result.success("模板已加载", plan);
    }

    // ===== 分组管理 =====

    /** API：查询所有分组 */
    @GetMapping("/api/groups")
    @ResponseBody
    public Result listGroups(@RequestParam(required = false) Long userId) {
        return Result.success(planService.listGroups(userId));
    }

    /** API：创建分组 */
    @PostMapping("/api/group/create")
    @ResponseBody
    public Result createGroup(@RequestBody PlanGroup group) {
        PlanGroup created = planService.createGroup(group);
        return Result.success("分组创建成功", created);
    }

    /** API：更新分组 */
    @PutMapping("/api/group/{id}")
    @ResponseBody
    public Result updateGroup(@PathVariable Long id, @RequestBody PlanGroup group) {
        group.setId(id);
        PlanGroup updated = planService.updateGroup(group);
        return Result.success("分组更新成功", updated);
    }

    /** API：删除分组 */
    @DeleteMapping("/api/group/{id}")
    @ResponseBody
    public Result deleteGroup(@PathVariable Long id) {
        planService.deleteGroup(id);
        return Result.success("分组删除成功");
    }
}
