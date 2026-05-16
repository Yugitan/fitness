package com.fitness.entity;

import java.math.BigDecimal;

/**
 * 训练记录明细实体类
 */
public class TrainingRecordDetail extends BaseEntity {

    /** 关联训练记录ID */
    private Long recordId;

    /** 关联动作ID */
    private Long exerciseId;

    /** 组数 */
    private Integer setNumber;

    /** 每组次数 */
    private Integer reps;

    /** 负重重量（kg） */
    private BigDecimal weight;

    /** 该组是否完成：0-否/1-是 */
    private Integer isCompleted;

    /** 备注 */
    private String notes;

    /** 排序号 */
    private Integer sortOrder;

    /** 关联的动作名称（非数据库字段） */
    private String exerciseName;

    /** 关联的动作分类（非数据库字段） */
    private String exerciseCategory;

    // ========== Getter/Setter ==========

    public Long getRecordId() { return recordId; }
    public void setRecordId(Long recordId) { this.recordId = recordId; }

    public Long getExerciseId() { return exerciseId; }
    public void setExerciseId(Long exerciseId) { this.exerciseId = exerciseId; }

    public Integer getSetNumber() { return setNumber; }
    public void setSetNumber(Integer setNumber) { this.setNumber = setNumber; }

    public Integer getReps() { return reps; }
    public void setReps(Integer reps) { this.reps = reps; }

    public BigDecimal getWeight() { return weight; }
    public void setWeight(BigDecimal weight) { this.weight = weight; }

    public Integer getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Integer isCompleted) { this.isCompleted = isCompleted; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

    public String getExerciseName() { return exerciseName; }
    public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }

    public String getExerciseCategory() { return exerciseCategory; }
    public void setExerciseCategory(String exerciseCategory) { this.exerciseCategory = exerciseCategory; }
}
