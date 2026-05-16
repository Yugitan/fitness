package com.fitness.controller.admin;

import com.fitness.annotation.RequiresAdmin;
import com.fitness.common.Result;
import com.fitness.entity.Blogger;
import com.fitness.entity.BloggerPlan;
import com.fitness.service.BloggerService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

/**
 * 博主及博主计划管理接口（管理员后台预留）
 */
@RestController
@RequestMapping("/admin/api/blogger")
public class AdminBloggerController {

    @Resource
    private BloggerService bloggerService;

    /** 博主列表 */
    @GetMapping("/list")
    public Result list() {
        return Result.success(bloggerService.listAll());
    }

    /** 新增博主 */
    @PostMapping("/create")
    public Result create(@RequestBody Blogger blogger) {
        return Result.success("新增成功", bloggerService.create(blogger));
    }

    /** 更新博主 */
    @PutMapping("/{id}")
    public Result update(@PathVariable Long id, @RequestBody Blogger blogger) {
        blogger.setId(id);
        return Result.success("更新成功", bloggerService.update(blogger));
    }

    /** 推荐/取消推荐博主 */
    @PutMapping("/{id}/recommend")
    public Result recommend(@PathVariable Long id, @RequestParam Integer isRecommended) {
        Blogger blogger = bloggerService.getById(id);
        blogger.setIsRecommended(isRecommended);
        bloggerService.update(blogger);
        return Result.success("操作成功");
    }

    /** 删除博主 */
    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Long id) {
        bloggerService.delete(id);
        return Result.success("删除成功");
    }

    /** 博主计划列表 */
    @GetMapping("/plan/list")
    public Result planList(@RequestParam(required = false) Long bloggerId) {
        if (bloggerId != null) {
            return Result.success(bloggerService.listPlansByBloggerId(bloggerId));
        }
        return Result.success(bloggerService.listAllOnlinePlans());
    }

    /** 新增博主计划 */
    @PostMapping("/plan/create")
    public Result createPlan(@RequestBody BloggerPlan plan) {
        return Result.success("新增成功", bloggerService.createPlan(plan));
    }

    /** 更新博主计划 */
    @PutMapping("/plan/{id}")
    public Result updatePlan(@PathVariable Long id, @RequestBody BloggerPlan plan) {
        plan.setId(id);
        return Result.success("更新成功", bloggerService.updatePlan(plan));
    }

    /** 上架/下架计划 */
    @PutMapping("/plan/{id}/online")
    public Result onlinePlan(@PathVariable Long id, @RequestParam Integer isOnline) {
        BloggerPlan plan = bloggerService.getPlanById(id);
        plan.setIsOnline(isOnline);
        bloggerService.updatePlan(plan);
        return Result.success("操作成功");
    }

    /** 删除博主计划 */
    @DeleteMapping("/plan/{id}")
    public Result deletePlan(@PathVariable Long id) {
        bloggerService.deletePlan(id);
        return Result.success("删除成功");
    }
}
