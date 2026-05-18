package com.fitness.mapper;

import com.fitness.entity.TrainingRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/**
 * 训练记录Mapper接口
 */
@Mapper
public interface TrainingRecordMapper {

    /** 根据ID查询训练记录 */
    TrainingRecord selectById(@Param("id") Long id);

    /** 按日期范围查询训练记录列表（含用户过滤） */
    List<TrainingRecord> selectByDateRange(@Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate,
                                            @Param("userId") Long userId);

    /** 查询某用户的所有训练记录（按日期倒序） */
    List<TrainingRecord> selectAll(@Param("userId") Long userId);

    /** 新增训练记录 */
    int insert(TrainingRecord record);

    /** 更新训练记录 */
    int update(TrainingRecord record);

    /** 逻辑删除训练记录 */
    int deleteById(@Param("id") Long id);

    /** 标记训练完成 */
    int markCompleted(@Param("id") Long id, @Param("totalSets") Integer totalSets,
                      @Param("totalReps") Integer totalReps);

    /** 清理过期游客数据（userId为NULL且创建时间早于指定日期） */
    int deleteExpiredGuestRecords(@Param("cutoffDate") LocalDate cutoffDate);
}
