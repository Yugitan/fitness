package com.fitness.entity;

/**
 * 博主实体类（博主专区预留）
 */
public class Blogger extends BaseEntity {

    /** 博主昵称 */
    private String nickname;

    /** 头像URL */
    private String avatar;

    /** 个人简介 */
    private String bio;

    /** 所属平台：B站/抖音/小红书等 */
    private String sourcePlatform;

    /** 平台主页链接 */
    private String platformUrl;

    /** 博主分类：健体/力量举/CrossFit/瑜伽等 */
    private String category;

    /** 粉丝数 */
    private Long followerCount;

    /** 是否推荐置顶：0-否/1-是 */
    private Integer isRecommended;

    // ========== Getter/Setter ==========

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getSourcePlatform() { return sourcePlatform; }
    public void setSourcePlatform(String sourcePlatform) { this.sourcePlatform = sourcePlatform; }

    public String getPlatformUrl() { return platformUrl; }
    public void setPlatformUrl(String platformUrl) { this.platformUrl = platformUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Long getFollowerCount() { return followerCount; }
    public void setFollowerCount(Long followerCount) { this.followerCount = followerCount; }

    public Integer getIsRecommended() { return isRecommended; }
    public void setIsRecommended(Integer isRecommended) { this.isRecommended = isRecommended; }
}
