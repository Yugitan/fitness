-- 新增训练计划（计划5-13，含补全手臂计划明细）
USE fitness;
SET NAMES utf8mb4;

-- 补全：手臂围度突破计划（若已存在但无明细）
SET @plan5_id = (SELECT id FROM plan WHERE title = '手臂围度突破计划' AND user_id = 1 LIMIT 1);
INSERT INTO plan_detail (plan_id, exercise_id, day_number, sets, reps, weight, rest_seconds, sort_order, create_time, update_time)
SELECT @plan5_id, exercise_id, day_number, sets, reps, weight, rest_seconds, sort_order, NOW(), NOW() FROM (
  SELECT 15 AS exercise_id, 1 AS day_number, 4 AS sets, 10 AS reps, 30.0 AS weight, 90 AS rest_seconds, 1 AS sort_order UNION ALL
  SELECT 16, 1, 3, 12, 15.0, 60, 2 UNION ALL SELECT 17, 1, 4, 12, 25.0, 60, 3 UNION ALL SELECT 18, 1, 3, 10, 40.0, 90, 4 UNION ALL
  SELECT 15, 2, 3, 12, 27.5, 90, 5 UNION ALL SELECT 16, 2, 4, 12, 17.5, 60, 6 UNION ALL SELECT 17, 2, 4, 15, 22.5, 60, 7
) t WHERE @plan5_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM plan_detail WHERE plan_id = @plan5_id LIMIT 1);

-- 计划6：腿部力量进阶
INSERT INTO plan (user_id, group_id, title, description, target_body_part, difficulty_level, train_days, is_public, create_time, update_time)
SELECT 1, 4, '腿部力量进阶计划', '深蹲硬拉腿举组合，系统提升下肢力量', '腿部', 3, 2, 1, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM plan WHERE title = '腿部力量进阶计划' AND user_id = 1);
SET @plan6_id = (SELECT id FROM plan WHERE title = '腿部力量进阶计划' AND user_id = 1 LIMIT 1);
INSERT INTO plan_detail (plan_id, exercise_id, day_number, sets, reps, weight, rest_seconds, sort_order, create_time, update_time) VALUES
(@plan6_id, 19, 1, 5,  5, 100.0, 120, 1, NOW(), NOW()),
(@plan6_id, 20, 1, 4,  8,  80.0, 120, 2, NOW(), NOW()),
(@plan6_id, 21, 1, 4, 10, 150.0, 90, 3, NOW(), NOW()),
(@plan6_id, 22, 1, 3, 12, 200.0, 90, 4, NOW(), NOW()),
(@plan6_id, 19, 2, 4,  8,  90.0, 120, 5, NOW(), NOW()),
(@plan6_id, 20, 2, 3, 10,  85.0, 120, 6, NOW(), NOW()),
(@plan6_id, 21, 2, 4,  8, 160.0, 90, 7, NOW(), NOW());

-- 计划7：核心稳定强化
INSERT INTO plan (user_id, group_id, title, description, target_body_part, difficulty_level, train_days, is_public, create_time, update_time)
SELECT 1, 1, '核心稳定强化计划', '平板支撑与卷腹组合，增强腰腹核心力量', '核心', 1, 3, 1, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM plan WHERE title = '核心稳定强化计划' AND user_id = 1);
SET @plan7_id = (SELECT id FROM plan WHERE title = '核心稳定强化计划' AND user_id = 1 LIMIT 1);
INSERT INTO plan_detail (plan_id, exercise_id, day_number, sets, reps, weight, rest_seconds, sort_order, create_time, update_time) VALUES
(@plan7_id, 23, 1, 3, 60,  5.0, 45, 1, NOW(), NOW()),
(@plan7_id, 25, 1, 4, 20,  2.5, 45, 2, NOW(), NOW()),
(@plan7_id, 26, 1, 3, 20,  5.0, 45, 3, NOW(), NOW()),
(@plan7_id, 24, 2, 3, 15,  7.5, 45, 4, NOW(), NOW()),
(@plan7_id, 25, 2, 4, 15,  5.0, 45, 5, NOW(), NOW()),
(@plan7_id, 26, 2, 3, 25,  7.5, 45, 6, NOW(), NOW()),
(@plan7_id, 23, 3, 3, 45,  5.0, 45, 7, NOW(), NOW()),
(@plan7_id, 24, 3, 3, 20, 10.0, 45, 8, NOW(), NOW());

-- 计划8：胸背超级组
INSERT INTO plan (user_id, group_id, title, description, target_body_part, difficulty_level, train_days, is_public, create_time, update_time)
SELECT 1, 2, '胸背超级组计划', '推拉超级组训练，高效刺激上半身', '胸部/背部', 3, 2, 1, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM plan WHERE title = '胸背超级组计划' AND user_id = 1);
SET @plan8_id = (SELECT id FROM plan WHERE title = '胸背超级组计划' AND user_id = 1 LIMIT 1);
INSERT INTO plan_detail (plan_id, exercise_id, day_number, sets, reps, weight, rest_seconds, sort_order, create_time, update_time) VALUES
(@plan8_id,  1, 1, 4, 10, 55.0, 75, 1, NOW(), NOW()),
(@plan8_id,  7, 1, 4, 10, 50.0, 75, 2, NOW(), NOW()),
(@plan8_id,  2, 1, 3, 12, 22.5, 75, 3, NOW(), NOW()),
(@plan8_id,  8, 1, 4, 12, 45.0, 75, 4, NOW(), NOW()),
(@plan8_id,  1, 2, 4,  8, 60.0, 90, 5, NOW(), NOW()),
(@plan8_id,  9, 2, 4, 12, 40.0, 75, 6, NOW(), NOW()),
(@plan8_id,  4, 2, 3, 15, 17.5, 60, 7, NOW(), NOW()),
(@plan8_id, 10, 2, 3, 12, 20.0, 75, 8, NOW(), NOW());

-- 计划9：减脂力量循环
INSERT INTO plan (user_id, group_id, title, description, target_body_part, difficulty_level, train_days, is_public, create_time, update_time)
SELECT 1, 3, '减脂力量循环计划', '全身复合动作为主，高次数短休息，提升代谢', '全身', 2, 4, 1, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM plan WHERE title = '减脂力量循环计划' AND user_id = 1);
SET @plan9_new_id = (SELECT id FROM plan WHERE title = '减脂力量循环计划' AND user_id = 1 LIMIT 1);
INSERT INTO plan_detail (plan_id, exercise_id, day_number, sets, reps, weight, rest_seconds, sort_order, create_time, update_time) VALUES
(@plan9_new_id,  5, 1, 4, 20,  2.5, 45, 1, NOW(), NOW()),
(@plan9_new_id, 19, 1, 4, 15, 60.0, 60, 2, NOW(), NOW()),
(@plan9_new_id,  8, 1, 4, 15, 35.0, 45, 3, NOW(), NOW()),
(@plan9_new_id, 11, 1, 3, 15, 15.0, 45, 4, NOW(), NOW()),
(@plan9_new_id,  6, 2, 4, 12,  5.0, 45, 5, NOW(), NOW()),
(@plan9_new_id, 21, 2, 4, 12, 80.0, 60, 6, NOW(), NOW()),
(@plan9_new_id,  3, 2, 3, 15, 12.5, 45, 7, NOW(), NOW()),
(@plan9_new_id, 25, 2, 3, 20,  5.0, 45, 8, NOW(), NOW()),
(@plan9_new_id,  7, 3, 4, 12, 45.0, 60, 9, NOW(), NOW()),
(@plan9_new_id, 22, 3, 4, 15, 120.0, 60, 10, NOW(), NOW());

-- 计划10：四分化增肌
INSERT INTO plan (user_id, group_id, title, description, target_body_part, difficulty_level, train_days, is_public, create_time, update_time)
SELECT 1, 2, '四分化增肌计划', '胸、背、腿、肩四日分化，系统堆叠肌肉量', '全身', 3, 4, 1, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM plan WHERE title = '四分化增肌计划' AND user_id = 1);
SET @plan10_id = (SELECT id FROM plan WHERE title = '四分化增肌计划' AND user_id = 1 LIMIT 1);
INSERT INTO plan_detail (plan_id, exercise_id, day_number, sets, reps, weight, rest_seconds, sort_order, create_time, update_time) VALUES
(@plan10_id,  1, 1, 4, 10, 62.5, 90, 1, NOW(), NOW()),
(@plan10_id,  2, 1, 3, 12, 25.0, 90, 2, NOW(), NOW()),
(@plan10_id,  3, 1, 3, 15, 15.0, 60, 3, NOW(), NOW()),
(@plan10_id,  7, 2, 4, 10, 62.5, 90, 4, NOW(), NOW()),
(@plan10_id,  8, 2, 4, 12, 52.5, 90, 5, NOW(), NOW()),
(@plan10_id,  9, 2, 3, 12, 42.5, 75, 6, NOW(), NOW()),
(@plan10_id, 19, 3, 5,  5, 105.0, 120, 7, NOW(), NOW()),
(@plan10_id, 20, 3, 4,  8,  82.5, 120, 8, NOW(), NOW()),
(@plan10_id, 21, 3, 3, 10, 155.0, 90, 9, NOW(), NOW()),
(@plan10_id, 11, 4, 4, 10, 25.0, 90, 10, NOW(), NOW()),
(@plan10_id, 12, 4, 4, 15, 12.5, 60, 11, NOW(), NOW()),
(@plan10_id, 14, 4, 4, 15, 12.5, 60, 12, NOW(), NOW());

-- 计划11：推日专项
INSERT INTO plan (user_id, group_id, title, description, target_body_part, difficulty_level, train_days, is_public, create_time, update_time)
SELECT 1, 4, '推日力量专项计划', '卧推推举窄距卧推，专注推举类动作力量提升', '胸部/肩部/手臂', 3, 2, 1, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM plan WHERE title = '推日力量专项计划' AND user_id = 1);
SET @plan11_id = (SELECT id FROM plan WHERE title = '推日力量专项计划' AND user_id = 1 LIMIT 1);
INSERT INTO plan_detail (plan_id, exercise_id, day_number, sets, reps, weight, rest_seconds, sort_order, create_time, update_time) VALUES
(@plan11_id,  1, 1, 5,  5, 75.0, 120, 1, NOW(), NOW()),
(@plan11_id,  2, 1, 4,  8, 27.5, 90, 2, NOW(), NOW()),
(@plan11_id, 11, 1, 4, 10, 25.0, 90, 3, NOW(), NOW()),
(@plan11_id, 18, 1, 4,  8, 45.0, 90, 4, NOW(), NOW()),
(@plan11_id,  1, 2, 4,  8, 70.0, 120, 5, NOW(), NOW()),
(@plan11_id,  4, 2, 3, 12, 20.0, 60, 6, NOW(), NOW()),
(@plan11_id, 17, 2, 4, 12, 27.5, 60, 7, NOW(), NOW());

-- 计划12：拉日专项
INSERT INTO plan (user_id, group_id, title, description, target_body_part, difficulty_level, train_days, is_public, create_time, update_time)
SELECT 1, 4, '拉日力量专项计划', '划船下拉硬拉组合，强化背部与后链', '背部/腿部', 3, 2, 1, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM plan WHERE title = '拉日力量专项计划' AND user_id = 1);
SET @plan12_id = (SELECT id FROM plan WHERE title = '拉日力量专项计划' AND user_id = 1 LIMIT 1);
INSERT INTO plan_detail (plan_id, exercise_id, day_number, sets, reps, weight, rest_seconds, sort_order, create_time, update_time) VALUES
(@plan12_id,  7, 1, 5,  5, 70.0, 120, 1, NOW(), NOW()),
(@plan12_id,  8, 1, 4, 10, 57.5, 90, 2, NOW(), NOW()),
(@plan12_id,  9, 1, 4, 12, 47.5, 90, 3, NOW(), NOW()),
(@plan12_id,  6, 1, 4,  8,  5.0, 90, 4, NOW(), NOW()),
(@plan12_id, 20, 2, 4,  6, 90.0, 120, 5, NOW(), NOW()),
(@plan12_id, 10, 2, 3, 12, 22.5, 75, 6, NOW(), NOW()),
(@plan12_id, 21, 2, 4,  8, 165.0, 90, 7, NOW(), NOW());

-- 计划13：周末全身激活
INSERT INTO plan (user_id, group_id, title, description, target_body_part, difficulty_level, train_days, is_public, create_time, update_time)
SELECT 1, 1, '周末全身激活计划', '轻中等强度全身训练，适合周末恢复性训练', '全身', 1, 2, 1, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM plan WHERE title = '周末全身激活计划' AND user_id = 1);
SET @plan13_id = (SELECT id FROM plan WHERE title = '周末全身激活计划' AND user_id = 1 LIMIT 1);
INSERT INTO plan_detail (plan_id, exercise_id, day_number, sets, reps, weight, rest_seconds, sort_order, create_time, update_time) VALUES
(@plan13_id,  5, 1, 3, 15,  2.5, 60, 1, NOW(), NOW()),
(@plan13_id, 12, 1, 3, 15,  7.5, 60, 2, NOW(), NOW()),
(@plan13_id,  8, 1, 3, 12, 30.0, 60, 3, NOW(), NOW()),
(@plan13_id, 16, 1, 3, 12, 12.5, 60, 4, NOW(), NOW()),
(@plan13_id, 22, 2, 3, 12, 100.0, 75, 5, NOW(), NOW()),
(@plan13_id, 25, 2, 3, 15,  5.0, 45, 6, NOW(), NOW()),
(@plan13_id, 17, 2, 3, 12, 20.0, 60, 7, NOW(), NOW());

SELECT id, title FROM plan WHERE user_id = 1 ORDER BY id;
