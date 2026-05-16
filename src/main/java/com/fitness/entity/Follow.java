package com.fitness.entity;

/**
 * 关注实体类（社交功能预留）
 */
public class Follow extends BaseEntity {

    /** 用户ID（关注者） */
    private Long userId;

    /** 被关注用户ID */
    private Long followUserId;

    // ========== Getter/Setter ==========

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getFollowUserId() { return followUserId; }
    public void setFollowUserId(Long followUserId) { this.followUserId = followUserId; }
}
