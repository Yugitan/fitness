package com.fitness.service.impl;

import com.fitness.entity.Blogger;
import com.fitness.entity.BloggerPlan;
import com.fitness.exception.BusinessException;
import com.fitness.mapper.BloggerMapper;
import com.fitness.mapper.BloggerPlanMapper;
import com.fitness.service.BloggerService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * 博主服务实现类（博主专区预留）
 */
@Service
public class BloggerServiceImpl implements BloggerService {

    @Resource
    private BloggerMapper bloggerMapper;

    @Resource
    private BloggerPlanMapper bloggerPlanMapper;

    @Override
    public List<Blogger> listAll() {
        return bloggerMapper.selectAll();
    }

    @Override
    public List<Blogger> listByCategory(String category) {
        return bloggerMapper.selectByCategory(category);
    }

    @Override
    public List<Blogger> listRecommended() {
        return bloggerMapper.selectRecommended();
    }

    @Override
    public Blogger getById(Long id) {
        Blogger blogger = bloggerMapper.selectById(id);
        if (blogger == null) {
            throw new BusinessException("博主不存在");
        }
        return blogger;
    }

    @Override
    public List<BloggerPlan> listPlansByBloggerId(Long bloggerId) {
        return bloggerPlanMapper.selectByBloggerId(bloggerId);
    }

    @Override
    public List<BloggerPlan> listAllOnlinePlans() {
        return bloggerPlanMapper.selectAllOnline();
    }

    @Override
    public BloggerPlan getPlanById(Long id) {
        BloggerPlan plan = bloggerPlanMapper.selectById(id);
        if (plan == null) {
            throw new BusinessException("博主计划不存在");
        }
        bloggerPlanMapper.updateViewCount(id);
        return plan;
    }

    @Override
    public void importPlanToPersonal(Long planId, Long userId) {
        BloggerPlan bloggerPlan = getPlanById(planId);
        // 预留：将博主计划转为个人训练模板
        // 后续用户登录功能实现后可完成
    }

    @Override
    public Blogger create(Blogger blogger) {
        bloggerMapper.insert(blogger);
        return blogger;
    }

    @Override
    public Blogger update(Blogger blogger) {
        bloggerMapper.update(blogger);
        return blogger;
    }

    @Override
    public void delete(Long id) {
        bloggerMapper.deleteById(id);
    }

    @Override
    public BloggerPlan createPlan(BloggerPlan plan) {
        bloggerPlanMapper.insert(plan);
        return plan;
    }

    @Override
    public BloggerPlan updatePlan(BloggerPlan plan) {
        bloggerPlanMapper.update(plan);
        return plan;
    }

    @Override
    public void deletePlan(Long id) {
        bloggerPlanMapper.deleteById(id);
    }
}
