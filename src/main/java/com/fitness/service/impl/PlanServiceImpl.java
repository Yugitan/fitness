package com.fitness.service.impl;

import com.fitness.entity.Plan;
import com.fitness.entity.PlanDetail;
import com.fitness.entity.PlanGroup;
import com.fitness.exception.BusinessException;
import com.fitness.mapper.PlanDetailMapper;
import com.fitness.mapper.PlanGroupMapper;
import com.fitness.mapper.PlanMapper;
import com.fitness.service.PlanService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

/**
 * 训练计划服务实现类
 */
@Service
public class PlanServiceImpl implements PlanService {

    @Resource
    private PlanMapper planMapper;

    @Resource
    private PlanDetailMapper planDetailMapper;

    @Resource
    private PlanGroupMapper planGroupMapper;

    @Override
    public Plan getById(Long id) {
        Plan plan = planMapper.selectById(id);
        if (plan == null) {
            throw new BusinessException("计划不存在");
        }
        plan.setDetails(planDetailMapper.selectByPlanId(id));
        return plan;
    }

    @Override
    public List<Plan> listAll(Long userId) {
        List<Plan> plans = planMapper.selectAll(userId);
        for (Plan plan : plans) {
            plan.setDetails(planDetailMapper.selectByPlanId(plan.getId()));
        }
        return plans;
    }

    @Override
    public List<Plan> listByGroupId(Long groupId, Long userId) {
        List<Plan> plans = planMapper.selectByGroupId(groupId, userId);
        for (Plan plan : plans) {
            plan.setDetails(planDetailMapper.selectByPlanId(plan.getId()));
        }
        return plans;
    }

    @Override
    @Transactional
    public Plan create(Plan plan, List<PlanDetail> details) {
        planMapper.insert(plan);
        if (details != null && !details.isEmpty()) {
            for (PlanDetail detail : details) {
                detail.setPlanId(plan.getId());
            }
            planDetailMapper.batchInsert(details);
        }
        return plan;
    }

    @Override
    @Transactional
    public Plan update(Plan plan, List<PlanDetail> details) {
        getById(plan.getId());
        planMapper.update(plan);
        if (details != null) {
            planDetailMapper.deleteByPlanId(plan.getId());
            if (!details.isEmpty()) {
                for (PlanDetail detail : details) {
                    detail.setPlanId(plan.getId());
                }
                planDetailMapper.batchInsert(details);
            }
        }
        return plan;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        getById(id);
        planDetailMapper.deleteByPlanId(id);
        planMapper.deleteById(id);
    }

    @Override
    @Transactional
    public Plan copy(Long id) {
        Plan source = getById(id);
        List<PlanDetail> sourceDetails = planDetailMapper.selectByPlanId(id);

        source.setId(null);
        source.setTitle(source.getTitle() + "（副本）");
        source.setCreateTime(null);
        source.setUpdateTime(null);
        source.setViewCount(0L);
        source.setCollectCount(0L);
        source.setLikeCount(0L);

        return create(source, sourceDetails);
    }

    @Override
    public Plan applyTemplate(Long planId) {
        Plan plan = planMapper.selectById(planId);
        if (plan == null) {
            throw new BusinessException("计划模板不存在");
        }
        plan.setDetails(planDetailMapper.selectByPlanId(planId));
        planMapper.updateViewCount(planId);
        return plan;
    }

    @Override
    public List<PlanDetail> getDetails(Long planId) {
        return planDetailMapper.selectByPlanId(planId);
    }

    // ===== 分组管理 =====

    @Override
    public List<PlanGroup> listGroups(Long userId) {
        return planGroupMapper.selectAll(userId);
    }

    @Override
    public PlanGroup createGroup(PlanGroup group) {
        planGroupMapper.insert(group);
        return group;
    }

    @Override
    public PlanGroup updateGroup(PlanGroup group) {
        planGroupMapper.update(group);
        return group;
    }

    @Override
    public void deleteGroup(Long id) {
        planGroupMapper.deleteById(id);
    }
}
