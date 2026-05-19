package com.fitness.service.impl;

import com.fitness.mapper.TrainingRecordDetailMapper;
import com.fitness.mapper.TrainingRecordMapper;
import com.fitness.service.StatisticsService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

@Service
public class StatisticsServiceImpl implements StatisticsService {

    @Resource
    private TrainingRecordMapper recordMapper;

    @Resource
    private TrainingRecordDetailMapper detailMapper;

    @Override
    public Map<String, Object> getPersonalStats(Long userId) {
        if (userId == null) return emptyPersonalStats();
        Map<String, Object> stats = recordMapper.getPersonalStats(userId);
        if (stats == null) stats = new HashMap<>();
        // Ensure numeric types for frontend
        stats.putIfAbsent("totalWorkouts", 0L);
        stats.putIfAbsent("totalSets", 0L);
        stats.putIfAbsent("totalReps", 0L);
        stats.putIfAbsent("avgDuration", 0.0);
        return stats;
    }

    @Override
    public List<Map<String, Object>> getMonthlyTrend(Long userId) {
        if (userId == null) return Collections.emptyList();
        List<Map<String, Object>> list = recordMapper.getMonthlyTrend(userId);
        if (list == null) return Collections.emptyList();
        return list;
    }

    @Override
    public List<Map<String, Object>> getExerciseFrequency(Long userId) {
        if (userId == null) return Collections.emptyList();
        List<Map<String, Object>> list = detailMapper.getExerciseFrequency(userId);
        if (list == null) return Collections.emptyList();
        return list;
    }

    private Map<String, Object> emptyPersonalStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalWorkouts", 0L);
        stats.put("totalSets", 0L);
        stats.put("totalReps", 0L);
        stats.put("avgDuration", 0.0);
        return stats;
    }
}
