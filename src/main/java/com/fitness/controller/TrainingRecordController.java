package com.fitness.controller;

import com.fitness.common.Result;
import com.fitness.entity.TrainingRecord;
import com.fitness.entity.TrainingRecordDetail;
import com.fitness.entity.User;
import com.fitness.exception.BusinessException;
import com.fitness.service.TrainingRecordService;
import com.fitness.util.DateUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
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

    /** 从 session 获取当前用户ID（游客返回 null，管理员返回 null 表示可看全部） */
    private Long getCurrentUserId(HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) return null;
        // 管理员可查看全部，返回 null 表示不过滤
        if (loginUser.getRole() != null && loginUser.getRole() >= 1) return null;
        return loginUser.getId();
    }

    /** 检查数据所有权：普通用户只能操作自己的数据 */
    private void checkOwnership(TrainingRecord record, HttpSession session) {
        Long currentUserId = getCurrentUserId(session);
        if (currentUserId != null) {
            if (record.getUserId() == null || !currentUserId.equals(record.getUserId())) {
                throw new BusinessException("无权操作此训练记录");
            }
        }
    }

    /** 训练记录主页（SPA 路由） */
    @GetMapping("/record")
    public String recordPage() {
        return "redirect:/training/";
    }

    /** API：查询训练记录（普通用户仅看自己的，管理员可看全部） */
    @GetMapping("/api/list")
    @ResponseBody
    public Result list(@RequestParam(required = false) String startDate,
                        @RequestParam(required = false) String endDate,
                        @RequestParam(required = false) Long userId,
                        HttpSession session) {
        Long currentUserId = getCurrentUserId(session);
        // 普通用户强制只看自己的，管理员 currentUserId=null 看全部
        if (currentUserId != null) {
            userId = currentUserId;
        }
        List<TrainingRecord> records;
        if (startDate != null || endDate != null) {
            LocalDate start = startDate != null ? DateUtils.parseDate(startDate) : null;
            LocalDate end = endDate != null ? DateUtils.parseDate(endDate) : null;
            records = trainingRecordService.listByDateRange(start, end, userId);
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

    /** API：新增训练记录（自动绑定当前用户） */
    @PostMapping("/api/create")
    @ResponseBody
    public Result create(@RequestBody TrainingRecord record, HttpSession session) {
        Long currentUserId = getCurrentUserId(session);
        if (currentUserId != null) {
            record.setUserId(currentUserId);
        }
        List<TrainingRecordDetail> details = record.getDetails();
        TrainingRecord created = trainingRecordService.create(record, details);
        return Result.success("创建成功", created);
    }

    /** API：更新训练记录 */
    @PutMapping("/api/{id}")
    @ResponseBody
    public Result update(@PathVariable Long id, @RequestBody TrainingRecord record, HttpSession session) {
        TrainingRecord existing = trainingRecordService.getById(id);
        checkOwnership(existing, session);
        record.setId(id);
        TrainingRecord updated = trainingRecordService.update(record);
        return Result.success("更新成功", updated);
    }

    /** API：删除训练记录 */
    @DeleteMapping("/api/{id}")
    @ResponseBody
    public Result delete(@PathVariable Long id, HttpSession session) {
        TrainingRecord existing = trainingRecordService.getById(id);
        checkOwnership(existing, session);
        trainingRecordService.delete(id);
        return Result.success("删除成功");
    }

    /** API：复制训练记录 */
    @PostMapping("/api/{id}/copy")
    @ResponseBody
    public Result copy(@PathVariable Long id, HttpSession session) {
        TrainingRecord existing = trainingRecordService.getById(id);
        checkOwnership(existing, session);
        TrainingRecord copied = trainingRecordService.copy(id);
        return Result.success("复制成功", copied);
    }

    /** API：标记训练完成 */
    @PutMapping("/api/{id}/complete")
    @ResponseBody
    public Result markCompleted(@PathVariable Long id, HttpSession session) {
        TrainingRecord existing = trainingRecordService.getById(id);
        checkOwnership(existing, session);
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
