package com.fitness.service.impl;

import com.fitness.entity.User;
import com.fitness.exception.BusinessException;
import com.fitness.mapper.UserMapper;
import com.fitness.service.PlanService;
import com.fitness.service.UserService;
import com.fitness.util.BCryptUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * 用户服务实现类（账号体系预留）
 */
@Service
public class UserServiceImpl implements UserService {

    @Resource
    private UserMapper userMapper;

    @Resource
    private PlanService planService;

    @Override
    public User register(User user) {
        // 检查用户名是否已存在
        User existing = userMapper.selectByUsername(user.getUsername());
        if (existing != null) {
            throw new BusinessException("用户名已存在");
        }
        // BCrypt加密密码
        user.setPassword(BCryptUtils.encode(user.getPassword()));
        // 默认普通用户，管理员指定时保留
        if (user.getRole() == null) {
            user.setRole(0);
        }
        if (user.getStatus() == null) {
            user.setStatus(1);
        }
        userMapper.insert(user);
        planService.ensureDefaultPlans(user.getId());
        user.setPassword(null); // 不返回密码
        return user;
    }

    @Override
    public User login(String username, String password) {
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            throw new BusinessException("用户名或密码错误");
        }
        if (user.getStatus() == 0) {
            throw new BusinessException("账号已被禁用");
        }
        if (!BCryptUtils.matches(password, user.getPassword())) {
            throw new BusinessException("用户名或密码错误");
        }
        user.setPassword(null);
        return user;
    }

    @Override
    public User getById(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        user.setPassword(null);
        return user;
    }

    @Override
    public User getByUsername(String username) {
        return userMapper.selectByUsername(username);
    }

    @Override
    public List<User> listAll() {
        List<User> users = userMapper.selectAll();
        for (User user : users) {
            user.setPassword(null);
        }
        return users;
    }

    @Override
    public User update(User user) {
        User existing = getById(user.getId());
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            user.setUsername(existing.getUsername());
        } else {
            user.setUsername(user.getUsername().trim());
            int len = user.getUsername().length();
            if (len < 4 || len > 20) {
                throw new BusinessException("用户名长度为 4-20 位");
            }
            if (!user.getUsername().equals(existing.getUsername())) {
                User dup = userMapper.selectByUsername(user.getUsername());
                if (dup != null) {
                    throw new BusinessException("用户名已存在");
                }
            }
        }
        if (user.getNickname() == null) {
            user.setNickname(existing.getNickname());
        } else {
            user.setNickname(user.getNickname().trim());
        }
        if (user.getAvatar() == null) user.setAvatar(existing.getAvatar());
        if (user.getEmail() == null) user.setEmail(existing.getEmail());
        if (user.getPhone() == null) user.setPhone(existing.getPhone());
        if (user.getBio() == null) user.setBio(existing.getBio());
        userMapper.update(user);
        return getById(user.getId());
    }

    @Override
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        if (oldPassword == null || oldPassword.isEmpty()) {
            throw new BusinessException("请输入原密码");
        }
        if (newPassword == null || newPassword.length() < 6 || newPassword.length() > 20) {
            throw new BusinessException("新密码长度为 6-20 位");
        }
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        if (!BCryptUtils.matches(oldPassword, user.getPassword())) {
            throw new BusinessException("原密码错误");
        }
        userMapper.updatePassword(userId, BCryptUtils.encode(newPassword));
    }

    @Override
    public void resetPassword(Long userId, String newPassword) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        userMapper.updatePassword(userId, BCryptUtils.encode(newPassword));
    }

    @Override
    public void updateStatus(Long id, Integer status) {
        getById(id);
        userMapper.updateStatus(id, status);
    }

    @Override
    public void delete(Long id) {
        getById(id);
        userMapper.deleteById(id);
    }
}
