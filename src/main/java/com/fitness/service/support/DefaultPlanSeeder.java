package com.fitness.service.support;

import com.fitness.entity.Plan;
import com.fitness.entity.PlanDetail;
import com.fitness.mapper.PlanMapper;
import com.fitness.service.PlanService;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 为每位用户补齐四套固定难度训练计划（初级 / 中级 / 高级 / Pro），用户可自行删除。
 */
public final class DefaultPlanSeeder {

    public static final String TITLE_BEGINNER = "初级 · 全身入门计划";
    public static final String TITLE_INTERMEDIATE = "中级 · 增肌强化计划";
    public static final String TITLE_ADVANCED = "高级 · 力量进阶计划";
    public static final String TITLE_PRO = "Pro · 竞技分化计划";

    private static final List<String> ALL_TITLES = Arrays.asList(
            TITLE_BEGINNER, TITLE_INTERMEDIATE, TITLE_ADVANCED, TITLE_PRO
    );

    private DefaultPlanSeeder() {}

    public static void ensureForUser(Long userId, PlanMapper planMapper, PlanService planService) {
        if (userId == null) {
            return;
        }
        for (Template t : templates()) {
            if (planMapper.countByUserIdAndTitle(userId, t.title) > 0) {
                continue;
            }
            Plan plan = new Plan();
            plan.setUserId(userId);
            plan.setGroupId(t.groupId);
            plan.setTitle(t.title);
            plan.setDescription(t.description);
            plan.setTargetBodyPart(t.targetBodyPart);
            plan.setDifficultyLevel(t.difficultyLevel);
            plan.setTrainDays(t.trainDays);
            plan.setIsPublic(0);
            planService.create(plan, buildDetails(t.rows));
        }
    }

    private static List<PlanDetail> buildDetails(int[][] rows) {
        List<PlanDetail> list = new ArrayList<>();
        int order = 1;
        for (int[] r : rows) {
            PlanDetail d = new PlanDetail();
            d.setExerciseId((long) r[0]);
            d.setDayNumber(r[1]);
            d.setSets(r[2]);
            d.setReps(r[3]);
            d.setWeight(BigDecimal.valueOf(r[4]));
            d.setRestSeconds(r[5]);
            d.setSortOrder(order++);
            list.add(d);
        }
        return list;
    }

    /** rows: exerciseId, day, sets, reps, weight(kg), restSeconds */
    private static List<Template> templates() {
        return Arrays.asList(
                new Template(
                        TITLE_BEGINNER, 1L, 1,
                        "适合零基础，以自重与小重量熟悉动作模式", "全身", 3,
                        new int[][]{
                                {5, 1, 3, 12, 0, 60},
                                {23, 1, 3, 45, 0, 45},
                                {18, 2, 3, 30, 0, 60},
                                {12, 2, 3, 12, 5, 60},
                                {20, 3, 3, 10, 30, 90}
                        }
                ),
                new Template(
                        TITLE_INTERMEDIATE, 2L, 2,
                        "全身分化增肌，逐步增加器械训练量", "全身", 3,
                        new int[][]{
                                {1, 1, 4, 10, 50, 90},
                                {2, 1, 3, 12, 25, 90},
                                {5, 1, 3, 15, 0, 60},
                                {8, 2, 4, 12, 40, 75},
                                {9, 2, 3, 12, 35, 75},
                                {15, 2, 3, 12, 20, 60},
                                {20, 3, 4, 10, 60, 90},
                                {22, 3, 3, 12, 120, 90}
                        }
                ),
                new Template(
                        TITLE_ADVANCED, 4L, 3,
                        "胸背腿肩分化，适合有一定训练基础", "全身", 4,
                        new int[][]{
                                {1, 1, 4, 8, 65, 120},
                                {2, 1, 3, 10, 27, 90},
                                {3, 1, 3, 15, 15, 60},
                                {7, 2, 4, 8, 62, 120},
                                {8, 2, 4, 10, 55, 90},
                                {10, 2, 3, 12, 22, 75},
                                {19, 3, 5, 5, 95, 150},
                                {20, 3, 4, 8, 85, 120},
                                {11, 4, 4, 10, 22, 90},
                                {12, 4, 4, 15, 10, 60}
                        }
                ),
                new Template(
                        TITLE_PRO, 4L, 4,
                        "推拉腿竞技分化，高强度低容量", "全身", 4,
                        new int[][]{
                                {1, 1, 5, 5, 75, 150},
                                {11, 1, 4, 8, 25, 120},
                                {18, 1, 4, 8, 45, 120},
                                {7, 2, 5, 5, 70, 150},
                                {6, 2, 4, 8, 0, 120},
                                {21, 2, 4, 6, 90, 150},
                                {19, 3, 5, 3, 105, 180},
                                {22, 3, 4, 8, 180, 120},
                                {17, 4, 4, 12, 27, 60},
                                {26, 4, 3, 25, 7, 45}
                        }
                )
        );
    }

    public static List<String> getAllTitles() {
        return ALL_TITLES;
    }

    private static final class Template {
        final String title;
        final Long groupId;
        final int difficultyLevel;
        final String description;
        final String targetBodyPart;
        final int trainDays;
        final int[][] rows;

        Template(String title, Long groupId, int difficultyLevel, String description,
                 String targetBodyPart, int trainDays, int[][] rows) {
            this.title = title;
            this.groupId = groupId;
            this.difficultyLevel = difficultyLevel;
            this.description = description;
            this.targetBodyPart = targetBodyPart;
            this.trainDays = trainDays;
            this.rows = rows;
        }
    }
}
