package com.fitness.mapper;

import com.fitness.entity.Plan;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 训练计划Mapper接口
 */
@Mapper
public interface PlanMapper {

    /** 根据ID查询计划 */
    Plan selectById(@Param("id") Long id);

    /** 根据分组ID查询计划列表 */
    List<Plan> selectByGroupId(@Param("groupId") Long groupId, @Param("userId") Long userId);

    /** 查询某用户的所有计划 */
    List<Plan> selectAll(@Param("userId") Long userId);

    /** 新增计划（返回主键） */
    int insert(Plan plan);

    /** 更新计划 */
    int update(Plan plan);

    /** 逻辑删除计划 */
    int deleteById(@Param("id") Long id);

    /** 更新浏览次数 */
    int updateViewCount(@Param("id") Long id);

    /** 统计用户是否已有指定标题的计划 */
    int countByUserIdAndTitle(@Param("userId") Long userId, @Param("title") String title);
}
