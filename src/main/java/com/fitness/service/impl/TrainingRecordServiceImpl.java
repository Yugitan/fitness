package com.fitness.service.impl;

import com.fitness.entity.TrainingRecord;
import com.fitness.entity.TrainingRecordDetail;
import com.fitness.exception.BusinessException;
import com.fitness.mapper.TrainingRecordDetailMapper;
import com.fitness.mapper.TrainingRecordMapper;
import com.fitness.service.TrainingRecordService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDate;
import java.util.List;

/**
 * 训练记录服务实现类
 */
@Service
public class TrainingRecordServiceImpl implements TrainingRecordService {

    @Resource
    private TrainingRecordMapper recordMapper;

    @Resource
    private TrainingRecordDetailMapper detailMapper;

    @Override
    public TrainingRecord getById(Long id) {
        TrainingRecord record = recordMapper.selectById(id);
        if (record == null) {
            throw new BusinessException("训练记录不存在");
        }
        record.setDetails(detailMapper.selectByRecordId(id));
        return record;
    }

    @Override
    public List<TrainingRecord> listByDateRange(LocalDate startDate, LocalDate endDate, Long userId) {
        List<TrainingRecord> records = recordMapper.selectByDateRange(startDate, endDate, userId);
        for (TrainingRecord record : records) {
            record.setDetails(detailMapper.selectByRecordId(record.getId()));
        }
        return records;
    }

    @Override
    public List<TrainingRecord> listAll(Long userId) {
        List<TrainingRecord> records = recordMapper.selectAll(userId);
        // 为每条记录填充明细
        for (TrainingRecord record : records) {
            record.setDetails(detailMapper.selectByRecordId(record.getId()));
        }
        return records;
    }

    @Override
    @Transactional
    public TrainingRecord create(TrainingRecord record, List<TrainingRecordDetail> details) {
        recordMapper.insert(record);
        if (details != null && !details.isEmpty()) {
            for (TrainingRecordDetail detail : details) {
                detail.setRecordId(record.getId());
            }
            detailMapper.batchInsert(details);
        }
        return record;
    }

    @Override
    public TrainingRecord update(TrainingRecord record) {
        getById(record.getId());
        recordMapper.update(record);
        return record;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        getById(id);
        detailMapper.deleteByRecordId(id);
        recordMapper.deleteById(id);
    }

    @Override
    @Transactional
    public TrainingRecord copy(Long id) {
        TrainingRecord source = getById(id);
        List<TrainingRecordDetail> sourceDetails = detailMapper.selectByRecordId(id);

        source.setId(null);
        source.setTrainDate(LocalDate.now());
        source.setIsCompleted(0);
        source.setTotalSets(0);
        source.setTotalReps(0);
        source.setCreateTime(null);
        source.setUpdateTime(null);

        return create(source, sourceDetails);
    }

    @Override
    public void markCompleted(Long id) {
        TrainingRecord record = getById(id);
        List<TrainingRecordDetail> details = detailMapper.selectByRecordId(id);
        int totalSets = details.size();
        int totalReps = details.stream().mapToInt(d -> d.getReps() != null ? d.getReps() : 0).sum();
        recordMapper.markCompleted(id, totalSets, totalReps);
    }

    @Override
    public List<TrainingRecordDetail> getDetails(Long recordId) {
        return detailMapper.selectByRecordId(recordId);
    }

    @Override
    public void updateDetailCompleted(Long detailId, Integer isCompleted) {
        detailMapper.updateCompleted(detailId, isCompleted);
    }
}
