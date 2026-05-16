package com.fitness.entity;

import java.time.LocalDateTime;

/**
 * 计划分享实体类（社交功能预留）
 */
public class PlanShare extends BaseEntity {

    /** 关联计划ID */
    private Long planId;

    /** 分享用户ID */
    private Long userId;

    /** 分享类型：0-公开分享/1-私密链接分享 */
    private Integer shareType;

    /** 分享唯一标识 */
    private String shareCode;

    /** 分享过期时间 */
    private LocalDateTime expireTime;

    // ========== Getter/Setter ==========

    public Long getPlanId() { return planId; }
    public void setPlanId(Long planId) { this.planId = planId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getShareType() { return shareType; }
    public void setShareType(Integer shareType) { this.shareType = shareType; }

    public String getShareCode() { return shareCode; }
    public void setShareCode(String shareCode) { this.shareCode = shareCode; }

    public LocalDateTime getExpireTime() { return expireTime; }
    public void setExpireTime(LocalDateTime expireTime) { this.expireTime = expireTime; }
}
