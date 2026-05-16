package com.fitness.entity;

import java.time.LocalDateTime;

/**
 * 计划导入记录实体类（社交功能预留）
 */
public class PlanImport extends BaseEntity {

    /** 导入用户ID */
    private Long userId;

    /** 原计划ID */
    private Long sourcePlanId;

    /** 导入时间 */
    private LocalDateTime importTime;

    // ========== Getter/Setter ==========

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getSourcePlanId() { return sourcePlanId; }
    public void setSourcePlanId(Long sourcePlanId) { this.sourcePlanId = sourcePlanId; }

    public LocalDateTime getImportTime() { return importTime; }
    public void setImportTime(LocalDateTime importTime) { this.importTime = importTime; }
}
