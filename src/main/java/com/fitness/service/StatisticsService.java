package com.fitness.service;

import java.util.List;
import java.util.Map;

/**
 * 数据统计服务接口
 */
public interface StatisticsService {

    Map<String, Object> getPersonalStats(Long userId);

    List<Map<String, Object>> getMonthlyTrend(Long userId);

    List<Map<String, Object>> getExerciseFrequency(Long userId);
}
