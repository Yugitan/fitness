package com.fitness.controller;

import com.fitness.common.Result;
import com.fitness.entity.User;
import com.fitness.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

/**
 * 用户控制器（账号体系预留）
 */
@Controller
@RequestMapping("/user")
public class UserController {

    @Resource
    private UserService userService;

    /** API：用户注册 */
    @PostMapping("/api/register")
    @ResponseBody
    public Result register(@RequestBody User user) {
        User registered = userService.register(user);
        return Result.success("注册成功", registered);
    }

    /** API：用户登录 */
    @PostMapping("/api/login")
    @ResponseBody
    public Result login(@RequestBody User loginRequest, HttpSession session) {
        User user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
        session.setAttribute("loginUser", user);
        return Result.success("登录成功", user);
    }

    /** API：退出登录 */
    @PostMapping("/api/logout")
    @ResponseBody
    public Result logout(HttpSession session) {
        session.invalidate();
        return Result.success("已退出登录");
    }

    /** API：获取当前登录用户 */
    @GetMapping("/api/current")
    @ResponseBody
    public Result currentUser(HttpSession session) {
        User user = (User) session.getAttribute("loginUser");
        if (user == null) {
            return Result.unauthorized("未登录");
        }
        return Result.success(userService.getById(user.getId()));
    }

    /** API：更新个人信息 */
    @PutMapping("/api/profile")
    @ResponseBody
    public Result updateProfile(@RequestBody User user, HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return Result.unauthorized("请先登录");
        }
        user.setId(loginUser.getId());
        User updated = userService.update(user);
        session.setAttribute("loginUser", updated);
        return Result.success("个人信息已更新", updated);
    }

    /** API：修改密码 */
    @PutMapping("/api/password")
    @ResponseBody
    public Result changePassword(@RequestBody User pwdRequest, HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return Result.unauthorized("请先登录");
        }
        userService.changePassword(loginUser.getId(),
                pwdRequest.getPassword(), // 原密码
                pwdRequest.getNickname());  // 新密码（通过nickname字段传递）
        return Result.success("密码修改成功");
    }
}
