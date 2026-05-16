package com.fitness.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 实体基类 - 所有数据库实体类的父类
 * 包含通用字段：主键ID、创建时间、更新时间、逻辑删除标记
 */
public abstract class BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 主键ID */
    protected Long id;

    /** 创建时间 */
    protected LocalDateTime createTime;

    /** 更新时间 */
    protected LocalDateTime updateTime;

    /** 是否删除：0-否，1-是（逻辑删除） */
    protected Integer isDeleted;

    // ========== Getter/Setter ==========

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    public LocalDateTime getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(LocalDateTime updateTime) {
        this.updateTime = updateTime;
    }

    public Integer getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Integer isDeleted) {
        this.isDeleted = isDeleted;
    }
}
