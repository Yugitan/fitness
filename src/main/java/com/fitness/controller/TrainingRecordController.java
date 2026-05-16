package com.fitness.controller;

import com.fitness.common.Result;
import com.fitness.entity.TrainingRecord;
import com.fitness.entity.TrainingRecordDetail;
import com.fitness.service.TrainingRecordService;
import com.fitness.util.DateUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.time.LocalDate;
import java.util.List;

/**
 * 训练记录控制器
 */
@Controller
@RequestMapping("/training")
public class TrainingRecordController {

    @Resource
    private TrainingRecordService trainingRecordService;

    /** 训练记录主页 */
    @GetMapping("/record")
    public String recordPage() {
        return "training/record";
    }

    /** API：查询所有训练记录 */
    @GetMapping("/api/list")
    @ResponseBody
    public Result list(@RequestParam(required = false) String startDate,
                        @RequestParam(required = false) String endDate,
                        @RequestParam(required = false) Long userId) {
        List<TrainingRecord> records;
        if (startDate != null || endDate != null) {
            LocalDate start = startDate != null ? DateUtils.parseDate(startDate) : null;
            LocalDate end = endDate != null ? DateUtils.parseDate(endDate) : null;
            records = trainingRecordService.listByDateRange(start, end);
        } else {
            records = trainingRecordService.listAll(userId);
        }
        return Result.success(records);
    }

    /** API：获取训练记录详情 */
    @GetMapping("/api/{id}")
    @ResponseBody
    public Result getDetail(@PathVariable Long id) {
        return Result.success(trainingRecordService.getById(id));
    }

    /** API：新增训练记录 */
    @PostMapping("/api/create")
    @ResponseBody
    public Result create(@RequestBody TrainingRecord record) {
        List<TrainingRecordDetail> details = record.getDetails();
        TrainingRecord created = trainingRecordService.create(record, details);
        return Result.success("创建成功", created);
    }

    /** API：更新训练记录 */
    @PutMapping("/api/{id}")
    @ResponseBody
    public Result update(@PathVariable Long id, @RequestBody TrainingRecord record) {
        record.setId(id);
        TrainingRecord updated = trainingRecordService.update(record);
        return Result.success("更新成功", updated);
    }

    /** API：删除训练记录 */
    @DeleteMapping("/api/{id}")
    @ResponseBody
    public Result delete(@PathVariable Long id) {
        trainingRecordService.delete(id);
        return Result.success("删除成功");
    }

    /** API：复制训练记录 */
    @PostMapping("/api/{id}/copy")
    @ResponseBody
    public Result copy(@PathVariable Long id) {
        TrainingRecord copied = trainingRecordService.copy(id);
        return Result.success("复制成功", copied);
    }

    /** API：标记训练完成 */
    @PutMapping("/api/{id}/complete")
    @ResponseBody
    public Result markCompleted(@PathVariable Long id) {
        trainingRecordService.markCompleted(id);
        return Result.success("已标记完成");
    }

    /** API：更新明细完成状态 */
    @PutMapping("/api/detail/{detailId}/complete")
    @ResponseBody
    public Result updateDetailCompleted(@PathVariable Long detailId,
                                         @RequestParam Integer isCompleted) {
        trainingRecordService.updateDetailCompleted(detailId, isCompleted);
        return Result.success("更新成功");
    }
}
