package com.fitness.entity;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 个人训练计划实体类
 */
public class Plan extends BaseEntity {

    /** 用户ID（预留，游客为NULL） */
    private Long userId;

    /** 关联计划分组ID */
    private Long groupId;

    /** 计划标题 */
    private String title;

    /** 计划描述 */
    private String description;

    /** 目标训练部位 */
    private String targetBodyPart;

    /** 难度等级：1-新手/2-进阶/3-高级 */
    private Integer difficultyLevel;

    /** 训练天数 */
    private Integer trainDays;

    /** 浏览次数 */
    private Long viewCount;

    /** 收藏次数 */
    private Long collectCount;

    /** 点赞次数 */
    private Long likeCount;

    /** 是否公开（预留）：0-私有/1-公开 */
    private Integer isPublic;

    /** 分享唯一标识（预留） */
    private String shareCode;

    /** 分享时间（预留） */
    private LocalDateTime shareTime;

    /** 计划明细列表（非数据库字段） */
    private List<PlanDetail> details;

    /** 分组名称（非数据库字段） */
    private String groupName;

    // ========== Getter/Setter ==========

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTargetBodyPart() { return targetBodyPart; }
    public void setTargetBodyPart(String targetBodyPart) { this.targetBodyPart = targetBodyPart; }

    public Integer getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(Integer difficultyLevel) { this.difficultyLevel = difficultyLevel; }

    public Integer getTrainDays() { return trainDays; }
    public void setTrainDays(Integer trainDays) { this.trainDays = trainDays; }

    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }

    public Long getCollectCount() { return collectCount; }
    public void setCollectCount(Long collectCount) { this.collectCount = collectCount; }

    public Long getLikeCount() { return likeCount; }
    public void setLikeCount(Long likeCount) { this.likeCount = likeCount; }

    public Integer getIsPublic() { return isPublic; }
    public void setIsPublic(Integer isPublic) { this.isPublic = isPublic; }

    public String getShareCode() { return shareCode; }
    public void setShareCode(String shareCode) { this.shareCode = shareCode; }

    public LocalDateTime getShareTime() { return shareTime; }
    public void setShareTime(LocalDateTime shareTime) { this.shareTime = shareTime; }

    public List<PlanDetail> getDetails() { return details; }
    public void setDetails(List<PlanDetail> details) { this.details = details; }

    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }
}
