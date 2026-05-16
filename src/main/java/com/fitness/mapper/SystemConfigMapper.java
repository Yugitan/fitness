package com.fitness.mapper;

import com.fitness.entity.SystemConfig;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 系统配置Mapper接口（管理员后台预留）
 */
@Mapper
public interface SystemConfigMapper {

    SystemConfig selectByKey(@Param("configKey") String configKey);

    List<SystemConfig> selectAll();

    int insert(SystemConfig config);

    int update(SystemConfig config);
}
