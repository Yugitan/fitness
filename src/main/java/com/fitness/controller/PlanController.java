package com.fitness.controller;

import com.fitness.common.Result;
import com.fitness.entity.Plan;
import com.fitness.entity.PlanDetail;
import com.fitness.entity.PlanGroup;
import com.fitness.entity.User;
import com.fitness.exception.BusinessException;
import com.fitness.service.PlanService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * 训练计划控制器
 */
@Controller
@RequestMapping("/plan")
public class PlanController {

    @Resource
    private PlanService planService;

    /** 从 session 获取当前用户ID（管理员返回 null 表示可看全部） */
    private Long getCurrentUserId(HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) return null;
        if (loginUser.getRole() != null && loginUser.getRole() >= 1) return null;
        return loginUser.getId();
    }

    /** 检查数据所有权：普通用户只能操作自己的数据 */
    private void checkOwnership(Plan plan, HttpSession session) {
        Long currentUserId = getCurrentUserId(session);
        if (currentUserId != null) {
            if (plan.getUserId() == null || !currentUserId.equals(plan.getUserId())) {
                throw new BusinessException("无权操作此计划");
            }
        }
    }

    /** 计划创建/编辑页面（SPA 路由） */
    @GetMapping("/create")
    public String createPage(Model model, HttpSession session) {
        return "redirect:/plan/";
    }

    /** 计划详情页（SPA 路由） */
    @GetMapping("/{id:[0-9]+}")
    public String detail(@PathVariable Long id, Model model) {
        return "redirect:/plan/";
    }

    /** API：查询计划（普通用户仅看自己的，管理员可看全部） */
    @GetMapping("/api/list")
    @ResponseBody
    public Result list(@RequestParam(required = false) Long groupId,
                        @RequestParam(required = false) Long userId,
                        HttpSession session) {
        Long currentUserId = getCurrentUserId(session);
        if (currentUserId != null) {
            userId = currentUserId;
            planService.ensureDefaultPlans(currentUserId);
        }
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

    /** API：创建计划（自动绑定当前用户） */
    @PostMapping("/api/create")
    @ResponseBody
    public Result create(@RequestBody Plan plan, HttpSession session) {
        Long currentUserId = getCurrentUserId(session);
        if (currentUserId != null) {
            plan.setUserId(currentUserId);
        }
        List<PlanDetail> details = plan.getDetails();
        Plan created = planService.create(plan, details);
        return Result.success("创建成功", created);
    }

    /** API：更新计划 */
    @PutMapping("/api/{id}")
    @ResponseBody
    public Result update(@PathVariable Long id, @RequestBody Plan plan, HttpSession session) {
        Plan existing = planService.getById(id);
        checkOwnership(existing, session);
        plan.setId(id);
        Plan updated = planService.update(plan, plan.getDetails());
        return Result.success("更新成功", updated);
    }

    /** API：删除计划 */
    @DeleteMapping("/api/{id}")
    @ResponseBody
    public Result delete(@PathVariable Long id, HttpSession session) {
        Plan existing = planService.getById(id);
        checkOwnership(existing, session);
        planService.delete(id);
        return Result.success("删除成功");
    }

    /** API：复制计划 */
    @PostMapping("/api/{id}/copy")
    @ResponseBody
    public Result copy(@PathVariable Long id, HttpSession session) {
        Plan existing = planService.getById(id);
        checkOwnership(existing, session);
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

    /** API：查询分组（普通用户仅看自己的） */
    @GetMapping("/api/groups")
    @ResponseBody
    public Result listGroups(@RequestParam(required = false) Long userId, HttpSession session) {
        Long currentUserId = getCurrentUserId(session);
        if (currentUserId != null) {
            userId = currentUserId;
        }
        return Result.success(planService.listGroups(userId));
    }

    /** API：创建分组（自动绑定当前用户） */
    @PostMapping("/api/group/create")
    @ResponseBody
    public Result createGroup(@RequestBody PlanGroup group, HttpSession session) {
        Long currentUserId = getCurrentUserId(session);
        if (currentUserId != null) {
            group.setUserId(currentUserId);
        }
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
