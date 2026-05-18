package com.fitness.entity;

import java.math.BigDecimal;

/**
 * 训练计划明细实体类
 */
public class PlanDetail extends BaseEntity {

    /** 关联计划ID */
    private Long planId;

    /** 关联动作ID */
    private Long exerciseId;

    /** 训练日序号 */
    private Integer dayNumber;

    /** 建议组数 */
    private Integer sets;

    /** 建议每组次数 */
    private Integer reps;

    /** 建议负重重量（kg） */
    private BigDecimal weight;

    /** 组间休息时间（秒） */
    private Integer restSeconds;

    /** 备注 */
    private String notes;

    /** 排序号 */
    private Integer sortOrder;

    /** 关联的动作名称（非数据库字段） */
    private String exerciseName;

    /** 关联的动作分类（非数据库字段） */
    private String exerciseCategory;

    /** 训练部位（非数据库字段） */
    private String bodyPart;

    // ========== Getter/Setter ==========

    public Long getPlanId() { return planId; }
    public void setPlanId(Long planId) { this.planId = planId; }

    public Long getExerciseId() { return exerciseId; }
    public void setExerciseId(Long exerciseId) { this.exerciseId = exerciseId; }

    public Integer getDayNumber() { return dayNumber; }
    public void setDayNumber(Integer dayNumber) { this.dayNumber = dayNumber; }

    public Integer getSets() { return sets; }
    public void setSets(Integer sets) { this.sets = sets; }

    public Integer getReps() { return reps; }
    public void setReps(Integer reps) { this.reps = reps; }

    public BigDecimal getWeight() { return weight; }
    public void setWeight(BigDecimal weight) { this.weight = weight; }

    public Integer getRestSeconds() { return restSeconds; }
    public void setRestSeconds(Integer restSeconds) { this.restSeconds = restSeconds; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

    public String getExerciseName() { return exerciseName; }
    public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }

    public String getExerciseCategory() { return exerciseCategory; }
    public void setExerciseCategory(String exerciseCategory) { this.exerciseCategory = exerciseCategory; }

    public String getBodyPart() { return bodyPart; }
    public void setBodyPart(String bodyPart) { this.bodyPart = bodyPart; }
}
