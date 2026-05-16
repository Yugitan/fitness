package com.fitness.entity;

/**
 * 评论实体类（社交功能预留）
 */
public class Comment extends BaseEntity {

    /** 用户ID */
    private Long userId;

    /** 评论对象类型：0-计划/1-动作/2-博主计划 */
    private Integer targetType;

    /** 评论对象ID */
    private Long targetId;

    /** 评论内容 */
    private String content;

    /** 父评论ID（0表示顶级评论） */
    private Long parentId;

    // ========== Getter/Setter ==========

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getTargetType() { return targetType; }
    public void setTargetType(Integer targetType) { this.targetType = targetType; }

    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
}
