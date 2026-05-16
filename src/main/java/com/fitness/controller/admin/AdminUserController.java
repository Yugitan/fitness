package com.fitness.controller.admin;

import com.fitness.annotation.RequiresAdmin;
import com.fitness.common.Result;
import com.fitness.service.UserService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

/**
 * 用户管理接口（管理员后台预留）
 */
@RestController
@RequestMapping("/admin/api/user")
public class AdminUserController {

    @Resource
    private UserService userService;

    /** 用户列表 */
    @GetMapping("/list")
    public Result list() {
        return Result.success(userService.listAll());
    }

    /** 禁用/启用用户 */
    @PutMapping("/{id}/status")
    public Result updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        userService.updateStatus(id, status);
        return Result.success("状态已更新");
    }

    /** 删除用户 */
    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Long id) {
        userService.delete(id);
        return Result.success("用户已删除");
    }
}
