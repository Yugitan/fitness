package com.fitness.entity;

/**
 * 博主训练计划实体类（博主专区预留）
 */
public class BloggerPlan extends BaseEntity {

    /** 关联博主ID */
    private Long bloggerId;

    /** 计划标题 */
    private String title;

    /** 封面图URL */
    private String coverImage;

    /** 难度等级：1-新手/2-进阶/3-高级 */
    private Integer difficultyLevel;

    /** 适用人群 */
    private String targetAudience;

    /** 训练部位 */
    private String targetBodyPart;

    /** 训练天数 */
    private Integer trainDays;

    /** 视频链接（B站/抖音/优酷等外部链接） */
    private String videoUrl;

    /** 视频类型：0-本地视频/1-外部链接视频 */
    private Integer videoType;

    /** 计划简介 */
    private String summary;

    /** 详细训练安排 */
    private String detailArrangement;

    /** 浏览次数 */
    private Long viewCount;

    /** 收藏次数 */
    private Long collectCount;

    /** 点赞次数 */
    private Long likeCount;

    /** 上架状态：0-下架/1-上架 */
    private Integer isOnline;

    /** 博主昵称（非数据库字段） */
    private String bloggerNickname;

    /** 博主头像（非数据库字段） */
    private String bloggerAvatar;

    // ========== Getter/Setter ==========

    public Long getBloggerId() { return bloggerId; }
    public void setBloggerId(Long bloggerId) { this.bloggerId = bloggerId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public Integer getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(Integer difficultyLevel) { this.difficultyLevel = difficultyLevel; }

    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }

    public String getTargetBodyPart() { return targetBodyPart; }
    public void setTargetBodyPart(String targetBodyPart) { this.targetBodyPart = targetBodyPart; }

    public Integer getTrainDays() { return trainDays; }
    public void setTrainDays(Integer trainDays) { this.trainDays = trainDays; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public Integer getVideoType() { return videoType; }
    public void setVideoType(Integer videoType) { this.videoType = videoType; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getDetailArrangement() { return detailArrangement; }
    public void setDetailArrangement(String detailArrangement) { this.detailArrangement = detailArrangement; }

    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }

    public Long getCollectCount() { return collectCount; }
    public void setCollectCount(Long collectCount) { this.collectCount = collectCount; }

    public Long getLikeCount() { return likeCount; }
    public void setLikeCount(Long likeCount) { this.likeCount = likeCount; }

    public Integer getIsOnline() { return isOnline; }
    public void setIsOnline(Integer isOnline) { this.isOnline = isOnline; }

    public String getBloggerNickname() { return bloggerNickname; }
    public void setBloggerNickname(String bloggerNickname) { this.bloggerNickname = bloggerNickname; }

    public String getBloggerAvatar() { return bloggerAvatar; }
    public void setBloggerAvatar(String bloggerAvatar) { this.bloggerAvatar = bloggerAvatar; }
}
