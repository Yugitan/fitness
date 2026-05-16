package com.fitness.controller.admin;

import com.fitness.annotation.RequiresAdmin;
import com.fitness.common.Result;
import com.fitness.service.SystemConfigService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Map;

/**
 * 系统配置管理接口（管理员后台预留）
 */
@RestController
@RequestMapping("/admin/api/config")
public class AdminConfigController {

    @Resource
    private SystemConfigService systemConfigService;

    /** 获取所有配置 */
    @GetMapping("/list")
    public Result list() {
        return Result.success(systemConfigService.listAll());
    }

    /** 更新配置 */
    @PutMapping("/update")
    public Result update(@RequestParam String key,
                          @RequestParam String value,
                          @RequestParam(required = false) String desc) {
        systemConfigService.update(key, value, desc);
        return Result.success("配置已更新");
    }

    /** 批量更新配置 */
    @PutMapping("/batch-update")
    public Result batchUpdate(@RequestBody Map<String, String> configs) {
        systemConfigService.batchUpdate(configs);
        return Result.success("配置已批量更新");
    }
}
