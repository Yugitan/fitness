package com.fitness.mapper;

import com.fitness.entity.PlanGroup;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 计划分组Mapper接口
 */
@Mapper
public interface PlanGroupMapper {

    /** 查询所有分组 */
    List<PlanGroup> selectAll(@Param("userId") Long userId);

    /** 根据ID查询分组 */
    PlanGroup selectById(@Param("id") Long id);

    /** 新增分组 */
    int insert(PlanGroup group);

    /** 更新分组 */
    int update(PlanGroup group);

    /** 逻辑删除分组 */
    int deleteById(@Param("id") Long id);
}
