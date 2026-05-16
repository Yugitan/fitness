package com.fitness.entity;

/**
 * 健身动作实体类
 */
public class Exercise extends BaseEntity {

    /** 动作名称 */
    private String name;

    /** 所属分类：胸部/背部/肩部/手臂/腿部/核心 */
    private String category;

    /** 动作讲解 */
    private String description;

    /** 训练要点 */
    private String keyPoints;

    /** 注意事项 */
    private String precautions;

    /** 本地MP4示范视频路径 */
    private String videoPath;

    /** 上传用户ID（预留） */
    private Long uploadUserId;

    /** 审核状态：0-待审核/1-审核通过/2-审核拒绝（预留） */
    private Integer auditStatus;

    /** 浏览次数 */
    private Long viewCount;

    /** 排序权重 */
    private Integer sortWeight;

    // ========== Getter/Setter ==========

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getKeyPoints() { return keyPoints; }
    public void setKeyPoints(String keyPoints) { this.keyPoints = keyPoints; }

    public String getPrecautions() { return precautions; }
    public void setPrecautions(String precautions) { this.precautions = precautions; }

    public String getVideoPath() { return videoPath; }
    public void setVideoPath(String videoPath) { this.videoPath = videoPath; }

    public Long getUploadUserId() { return uploadUserId; }
    public void setUploadUserId(Long uploadUserId) { this.uploadUserId = uploadUserId; }

    public Integer getAuditStatus() { return auditStatus; }
    public void setAuditStatus(Integer auditStatus) { this.auditStatus = auditStatus; }

    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }

    public Integer getSortWeight() { return sortWeight; }
    public void setSortWeight(Integer sortWeight) { this.sortWeight = sortWeight; }
}
