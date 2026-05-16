package com.fitness.mapper;

import com.fitness.entity.BloggerPlan;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 博主训练计划Mapper接口（博主专区预留）
 */
@Mapper
public interface BloggerPlanMapper {

    List<BloggerPlan> selectByBloggerId(@Param("bloggerId") Long bloggerId);

    List<BloggerPlan> selectAllOnline();

    BloggerPlan selectById(@Param("id") Long id);

    int insert(BloggerPlan plan);

    int update(BloggerPlan plan);

    int deleteById(@Param("id") Long id);

    int updateViewCount(@Param("id") Long id);
}
