package com.fitness.mapper;

import com.fitness.entity.Blogger;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 博主Mapper接口（博主专区预留）
 */
@Mapper
public interface BloggerMapper {

    List<Blogger> selectAll();

    List<Blogger> selectByCategory(@Param("category") String category);

    List<Blogger> selectRecommended();

    Blogger selectById(@Param("id") Long id);

    int insert(Blogger blogger);

    int update(Blogger blogger);

    int deleteById(@Param("id") Long id);
}
