package com.fitness.mapper;

import com.fitness.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户Mapper接口（账号体系预留）
 */
@Mapper
public interface UserMapper {

    /** 根据用户名查询用户 */
    User selectByUsername(@Param("username") String username);

    /** 根据ID查询用户 */
    User selectById(@Param("id") Long id);

    /** 分页查询用户列表 */
    List<User> selectAll();

    /** 新增用户 */
    int insert(User user);

    /** 更新用户信息 */
    int update(User user);

    /** 更新用户状态（禁用/启用） */
    int updateStatus(@Param("id") Long id, @Param("status") Integer status);

    /** 逻辑删除用户 */
    int deleteById(@Param("id") Long id);
}
