package com.fitness.service.impl;

import com.fitness.entity.SystemConfig;
import com.fitness.mapper.SystemConfigMapper;
import com.fitness.service.SystemConfigService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 系统配置服务实现类（管理员后台预留）
 */
@Service
public class SystemConfigServiceImpl implements SystemConfigService {

    @Resource
    private SystemConfigMapper systemConfigMapper;

    @Override
    public String getValue(String key) {
        SystemConfig config = systemConfigMapper.selectByKey(key);
        return config != null ? config.getConfigValue() : null;
    }

    @Override
    public Map<String, String> getAllConfigMap() {
        Map<String, String> map = new LinkedHashMap<>();
        List<SystemConfig> configs = systemConfigMapper.selectAll();
        for (SystemConfig config : configs) {
            map.put(config.getConfigKey(), config.getConfigValue());
        }
        return map;
    }

    @Override
    public List<SystemConfig> listAll() {
        return systemConfigMapper.selectAll();
    }

    @Override
    public void update(String key, String value, String desc) {
        SystemConfig config = systemConfigMapper.selectByKey(key);
        if (config == null) {
            config = new SystemConfig();
            config.setConfigKey(key);
            config.setConfigValue(value);
            config.setConfigDesc(desc);
            systemConfigMapper.insert(config);
        } else {
            config.setConfigValue(value);
            if (desc != null) {
                config.setConfigDesc(desc);
            }
            systemConfigMapper.update(config);
        }
    }

    @Override
    public void batchUpdate(Map<String, String> configs) {
        for (Map.Entry<String, String> entry : configs.entrySet()) {
            update(entry.getKey(), entry.getValue(), null);
        }
    }
}
