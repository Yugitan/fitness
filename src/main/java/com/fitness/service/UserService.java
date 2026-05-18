package com.fitness.service;

import com.fitness.entity.User;

import java.util.List;

/**
 * 用户服务接口（账号体系预留）
 */
public interface UserService {

    /** 用户注册 */
    User register(User user);

    /** 用户登录 */
    User login(String username, String password);

    /** 根据ID查询用户 */
    User getById(Long id);

    /** 根据用户名查询用户 */
    User getByUsername(String username);

    /** 查询用户列表 */
    List<User> listAll();

    /** 更新用户信息 */
    User update(User user);

    /** 修改密码 */
    void changePassword(Long userId, String oldPassword, String newPassword);

    /** 管理员重置密码（无需旧密码） */
    void resetPassword(Long userId, String newPassword);

    /** 禁用/启用用户 */
    void updateStatus(Long id, Integer status);

    /** 删除用户（逻辑删除） */
    void delete(Long id);
}
