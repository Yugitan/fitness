package com.fitness.service;

import com.fitness.entity.TrainingRecord;
import com.fitness.entity.TrainingRecordDetail;

import java.time.LocalDate;
import java.util.List;

/**
 * 训练记录服务接口
 */
public interface TrainingRecordService {

    /** 根据ID查询训练记录（含明细） */
    TrainingRecord getById(Long id);

    /** 按日期范围查询训练记录 */
    List<TrainingRecord> listByDateRange(LocalDate startDate, LocalDate endDate);

    /** 查询所有训练记录 */
    List<TrainingRecord> listAll(Long userId);

    /** 新增训练记录（含明细） */
    TrainingRecord create(TrainingRecord record, List<TrainingRecordDetail> details);

    /** 更新训练记录 */
    TrainingRecord update(TrainingRecord record);

    /** 删除训练记录 */
    void delete(Long id);

    /** 复制训练记录 */
    TrainingRecord copy(Long id);

    /** 标记训练完成 */
    void markCompleted(Long id);

    /** 获取训练记录的明细列表 */
    List<TrainingRecordDetail> getDetails(Long recordId);

    /** 更新明细完成状态 */
    void updateDetailCompleted(Long detailId, Integer isCompleted);
}
