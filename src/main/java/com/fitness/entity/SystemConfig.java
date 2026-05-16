package com.fitness.entity;

/**
 * 系统配置实体类（管理员后台预留）
 */
public class SystemConfig extends BaseEntity {

    /** 配置键 */
    private String configKey;

    /** 配置值 */
    private String configValue;

    /** 配置说明 */
    private String configDesc;

    // ========== Getter/Setter ==========

    public String getConfigKey() { return configKey; }
    public void setConfigKey(String configKey) { this.configKey = configKey; }

    public String getConfigValue() { return configValue; }
    public void setConfigValue(String configValue) { this.configValue = configValue; }

    public String getConfigDesc() { return configDesc; }
    public void setConfigDesc(String configDesc) { this.configDesc = configDesc; }
}
