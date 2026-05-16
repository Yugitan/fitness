package com.fitness.entity;

/**
 * 训练计划分组实体类
 */
public class PlanGroup extends BaseEntity {

    /** 用户ID（预留，游客为NULL） */
    private Long userId;

    /** 分组名称（如：新手入门/增肌计划/减脂计划） */
    private String name;

    /** 排序权重 */
    private Integer sortWeight;

    // ========== Getter/Setter ==========

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getSortWeight() { return sortWeight; }
    public void setSortWeight(Integer sortWeight) { this.sortWeight = sortWeight; }
}
