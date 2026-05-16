package com.fitness.entity;

import java.time.LocalTime;

/**
 * 训练提醒实体类（扩展功能预留）
 */
public class Reminder extends BaseEntity {

    /** 用户ID */
    private Long userId;

    /** 每日提醒时间 */
    private LocalTime remindTime;

    /** 提醒日期（逗号分隔，1=周一...7=周日） */
    private String remindDays;

    /** 是否启用：0-否/1-是 */
    private Integer isEnabled;

    // ========== Getter/Setter ==========

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalTime getRemindTime() { return remindTime; }
    public void setRemindTime(LocalTime remindTime) { this.remindTime = remindTime; }

    public String getRemindDays() { return remindDays; }
    public void setRemindDays(String remindDays) { this.remindDays = remindDays; }

    public Integer getIsEnabled() { return isEnabled; }
    public void setIsEnabled(Integer isEnabled) { this.isEnabled = isEnabled; }
}
