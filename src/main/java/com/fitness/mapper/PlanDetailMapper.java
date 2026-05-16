package com.fitness.mapper;

import com.fitness.entity.PlanDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 训练计划明细Mapper接口
 */
@Mapper
public interface PlanDetailMapper {

    /** 根据计划ID查询明细列表 */
    List<PlanDetail> selectByPlanId(@Param("planId") Long planId);

    /** 批量新增明细 */
    int batchInsert(@Param("list") List<PlanDetail> list);

    /** 根据计划ID删除所有明细 */
    int deleteByPlanId(@Param("planId") Long planId);
}
