package com.fitness.service;

import com.fitness.entity.Exercise;

import java.util.List;

/**
 * 健身动作服务接口
 */
public interface ExerciseService {

    /** 根据ID查询动作 */
    Exercise getById(Long id);

    /** 查询所有动作 */
    List<Exercise> listAll();

    /** 根据分类查询动作 */
    List<Exercise> listByCategory(String category);

    /** 关键词模糊搜索动作 */
    List<Exercise> search(String keyword);

    /** 分类+关键词组合搜索 */
    List<Exercise> searchByCategoryAndKeyword(String category, String keyword);

    /** 新增动作 */
    Exercise create(Exercise exercise);

    /** 更新动作 */
    Exercise update(Exercise exercise);

    /** 删除动作 */
    void delete(Long id);

    /** 增加浏览次数 */
    void incrementViewCount(Long id);
}
