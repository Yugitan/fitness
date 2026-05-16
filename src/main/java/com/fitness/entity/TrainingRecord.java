package com.fitness.entity;

import java.time.LocalDate;
import java.util.List;

/**
 * 训练记录实体类
 */
public class TrainingRecord extends BaseEntity {

    /** 用户ID（预留，游客为NULL） */
    private Long userId;

    /** 训练日期 */
    private LocalDate trainDate;

    /** 训练时长（分钟） */
    private Integer duration;

    /** 当日总组数 */
    private Integer totalSets;

    /** 当日总次数 */
    private Integer totalReps;

    /** 消耗卡路里（预留） */
    private Integer calories;

    /** 训练难度（预留）：1-轻松/2-适中/3-困难 */
    private Integer difficulty;

    /** 是否标记完成：0-否/1-是 */
    private Integer isCompleted;

    /** 备注信息 */
    private String notes;

    /** 训练明细列表（非数据库字段，用于业务传输） */
    private List<TrainingRecordDetail> details;

    // ========== Getter/Setter ==========

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDate getTrainDate() { return trainDate; }
    public void setTrainDate(LocalDate trainDate) { this.trainDate = trainDate; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public Integer getTotalSets() { return totalSets; }
    public void setTotalSets(Integer totalSets) { this.totalSets = totalSets; }

    public Integer getTotalReps() { return totalReps; }
    public void setTotalReps(Integer totalReps) { this.totalReps = totalReps; }

    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }

    public Integer getDifficulty() { return difficulty; }
    public void setDifficulty(Integer difficulty) { this.difficulty = difficulty; }

    public Integer getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Integer isCompleted) { this.isCompleted = isCompleted; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<TrainingRecordDetail> getDetails() { return details; }
    public void setDetails(List<TrainingRecordDetail> details) { this.details = details; }
}
