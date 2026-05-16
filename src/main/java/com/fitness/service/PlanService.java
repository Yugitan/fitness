package com.fitness.service;

import com.fitness.entity.Plan;
import com.fitness.entity.PlanDetail;
import com.fitness.entity.PlanGroup;

import java.util.List;

/**
 * 训练计划服务接口
 */
public interface PlanService {

    /** 查询计划详情（含明细） */
    Plan getById(Long id);

    /** 查询用户所有计划 */
    List<Plan> listAll(Long userId);

    /** 根据分组查询计划 */
    List<Plan> listByGroupId(Long groupId, Long userId);

    /** 创建计划 */
    Plan create(Plan plan, List<PlanDetail> details);

    /** 更新计划 */
    Plan update(Plan plan, List<PlanDetail> details);

    /** 删除计划 */
    void delete(Long id);

    /** 复制计划 */
    Plan copy(Long id);

    /** 一键套用模板生成训练清单（返回包含明细的完整计划） */
    Plan applyTemplate(Long planId);

    /** 获取计划明细 */
    List<PlanDetail> getDetails(Long planId);

    /** ===== 计划分组管理 ===== */

    /** 查询所有分组 */
    List<PlanGroup> listGroups(Long userId);

    /** 创建分组 */
    PlanGroup createGroup(PlanGroup group);

    /** 更新分组 */
    PlanGroup updateGroup(PlanGroup group);

    /** 删除分组 */
    void deleteGroup(Long id);
}
