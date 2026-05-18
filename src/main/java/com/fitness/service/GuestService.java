package com.fitness.service;

import com.fitness.mapper.TrainingRecordMapper;
import com.fitness.mapper.TrainingRecordDetailMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.time.LocalDate;

/**
 * 游客模式服务 — 清理过期游客数据、检查游客状态
 */
@Service
public class GuestService {

    private static final Logger log = LoggerFactory.getLogger(GuestService.class);
    public static final int GUEST_MAX_DAYS = 7;

    @Resource
    private TrainingRecordMapper recordMapper;

    @Resource
    private TrainingRecordDetailMapper detailMapper;

    /** 应用启动时清理超过7天的游客数据 */
    @PostConstruct
    public void cleanOnStartup() {
        log.info("开始清理过期游客数据...");
        try {
            int count = cleanExpiredGuestData();
            log.info("游客数据清理完成，共清理 {} 条记录", count);
        } catch (Exception e) {
            log.error("清理游客数据失败", e);
        }
    }

    /** 清理创建时间超过7天且 userId 为空的记录 */
    public int cleanExpiredGuestData() {
        LocalDate cutoff = LocalDate.now().minusDays(GUEST_MAX_DAYS);
        detailMapper.deleteExpiredGuestDetails(cutoff);
        return recordMapper.deleteExpiredGuestRecords(cutoff);
    }
}
