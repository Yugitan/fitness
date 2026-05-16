package com.fitness.entity;

/**
 * 消息通知实体类（扩展功能预留）
 */
public class Message extends BaseEntity {

    /** 接收用户ID */
    private Long userId;

    /** 发送用户ID（系统消息为NULL） */
    private Long senderId;

    /** 消息类型：0-系统消息/1-评论回复/2-点赞通知/3-关注通知 */
    private Integer msgType;

    /** 消息标题 */
    private String title;

    /** 消息内容 */
    private String content;

    /** 关联对象类型 */
    private Integer targetType;

    /** 关联对象ID */
    private Long targetId;

    /** 是否已读：0-否/1-是 */
    private Integer isRead;

    // ========== Getter/Setter ==========

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public Integer getMsgType() { return msgType; }
    public void setMsgType(Integer msgType) { this.msgType = msgType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Integer getTargetType() { return targetType; }
    public void setTargetType(Integer targetType) { this.targetType = targetType; }

    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }

    public Integer getIsRead() { return isRead; }
    public void setIsRead(Integer isRead) { this.isRead = isRead; }
}
