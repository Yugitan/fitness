package com.fitness.service;

import com.fitness.entity.SystemConfig;

import java.util.List;
import java.util.Map;

/**
 * 系统配置服务接口（管理员后台预留）
 */
public interface SystemConfigService {

    /** 根据Key获取配置值 */
    String getValue(String key);

    /** 获取所有配置（Map形式） */
    Map<String, String> getAllConfigMap();

    /** 获取所有配置 */
    List<SystemConfig> listAll();

    /** 更新配置 */
    void update(String key, String value, String desc);

    /** 批量更新配置 */
    void batchUpdate(Map<String, String> configs);
}
