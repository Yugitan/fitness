package com.fitness.mapper;

import com.fitness.entity.Exercise;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 健身动作Mapper接口
 */
@Mapper
public interface ExerciseMapper {

    /** 根据ID查询动作 */
    Exercise selectById(@Param("id") Long id);

    /** 根据分类查询动作列表 */
    List<Exercise> selectByCategory(@Param("category") String category);

    /** 关键词模糊搜索动作 */
    List<Exercise> searchByKeyword(@Param("keyword") String keyword);

    /** 查询所有动作（按排序权重降序） */
    List<Exercise> selectAll();

    /** 新增动作 */
    int insert(Exercise exercise);

    /** 更新动作 */
    int update(Exercise exercise);

    /** 逻辑删除动作 */
    int deleteById(@Param("id") Long id);

    /** 更新浏览次数 */
    int updateViewCount(@Param("id") Long id);
}
