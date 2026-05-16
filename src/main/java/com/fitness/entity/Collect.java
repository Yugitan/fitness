package com.fitness.entity;

/**
 * 收藏实体类（社交功能预留）
 */
public class Collect extends BaseEntity {

    /** 用户ID */
    private Long userId;

    /** 收藏对象类型：0-个人计划/1-博主计划/2-动作 */
    private Integer targetType;

    /** 收藏对象ID */
    private Long targetId;

    // ========== Getter/Setter ==========

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getTargetType() { return targetType; }
    public void setTargetType(Integer targetType) { this.targetType = targetType; }

    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }
}
