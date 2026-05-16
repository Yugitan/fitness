package com.fitness.entity;

/**
 * 点赞记录实体类（社交功能预留）
 */
public class LikeRecord extends BaseEntity {

    /** 用户ID */
    private Long userId;

    /** 点赞对象类型：0-计划/1-动作/2-评论 */
    private Integer targetType;

    /** 点赞对象ID */
    private Long targetId;

    // ========== Getter/Setter ==========

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getTargetType() { return targetType; }
    public void setTargetType(Integer targetType) { this.targetType = targetType; }

    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }
}
