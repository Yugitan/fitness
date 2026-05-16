package com.fitness.service;

import com.fitness.entity.Blogger;
import com.fitness.entity.BloggerPlan;

import java.util.List;

/**
 * 博主服务接口（博主专区预留）
 */
public interface BloggerService {

    /** 查询所有博主 */
    List<Blogger> listAll();

    /** 根据分类查询博主 */
    List<Blogger> listByCategory(String category);

    /** 查询推荐博主 */
    List<Blogger> listRecommended();

    /** 博主详情 */
    Blogger getById(Long id);

    /** 根据博主ID查询训练计划 */
    List<BloggerPlan> listPlansByBloggerId(Long bloggerId);

    /** 查询所有上架的博主计划 */
    List<BloggerPlan> listAllOnlinePlans();

    /** 博主计划详情 */
    BloggerPlan getPlanById(Long id);

    /** 博主计划导入个人模板 */
    void importPlanToPersonal(Long planId, Long userId);

    // ===== 管理员操作（预留）=====

    /** 新增博主 */
    Blogger create(Blogger blogger);

    /** 更新博主 */
    Blogger update(Blogger blogger);

    /** 删除博主 */
    void delete(Long id);

    /** 新增博主计划 */
    BloggerPlan createPlan(BloggerPlan plan);

    /** 更新博主计划 */
    BloggerPlan updatePlan(BloggerPlan plan);

    /** 删除博主计划 */
    void deletePlan(Long id);
}
