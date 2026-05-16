package com.fitness.service.impl;

import com.fitness.entity.Exercise;
import com.fitness.exception.BusinessException;
import com.fitness.mapper.ExerciseMapper;
import com.fitness.service.ExerciseService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * 健身动作服务实现类
 */
@Service
public class ExerciseServiceImpl implements ExerciseService {

    @Resource
    private ExerciseMapper exerciseMapper;

    @Override
    public Exercise getById(Long id) {
        Exercise exercise = exerciseMapper.selectById(id);
        if (exercise == null) {
            throw new BusinessException("动作不存在");
        }
        return exercise;
    }

    @Override
    public List<Exercise> listAll() {
        return exerciseMapper.selectAll();
    }

    @Override
    public List<Exercise> listByCategory(String category) {
        return exerciseMapper.selectByCategory(category);
    }

    @Override
    public List<Exercise> search(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return listAll();
        }
        return exerciseMapper.searchByKeyword(keyword.trim());
    }

    @Override
    public Exercise create(Exercise exercise) {
        exerciseMapper.insert(exercise);
        return exercise;
    }

    @Override
    public Exercise update(Exercise exercise) {
        Exercise existing = getById(exercise.getId());
        exerciseMapper.update(exercise);
        return exercise;
    }

    @Override
    public void delete(Long id) {
        getById(id);
        exerciseMapper.deleteById(id);
    }

    @Override
    public void incrementViewCount(Long id) {
        exerciseMapper.updateViewCount(id);
    }
}
