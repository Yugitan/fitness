package com.fitness.mapper;

import com.fitness.entity.TrainingRecordDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 训练记录明细Mapper接口
 */
@Mapper
public interface TrainingRecordDetailMapper {

    /** 根据记录ID查询明细列表 */
    List<TrainingRecordDetail> selectByRecordId(@Param("recordId") Long recordId);

    /** 批量新增明细 */
    int batchInsert(@Param("list") List<TrainingRecordDetail> list);

    /** 更新明细 */
    int update(TrainingRecordDetail detail);

    /** 根据记录ID删除所有明细 */
    int deleteByRecordId(@Param("recordId") Long recordId);

    /** 更新明细完成状态 */
    int updateCompleted(@Param("id") Long id, @Param("isCompleted") Integer isCompleted);
}
