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

    /** 管理员重置用户密码 */
    @PutMapping("/{id}/password")
    public Result resetPassword(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        userService.resetPassword(id, body.get("password"));
        return Result.success("密码已重置");
    }

    /** 管理员手动添加用户 */
    @PostMapping("/create")
    public Result create(@RequestBody com.fitness.entity.User user) {
        userService.register(user);
        return Result.success("用户创建成功");
    }
}
