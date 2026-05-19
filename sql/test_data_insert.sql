-- ============================================================
-- 测试数据插入脚本 (2026-05-19)
-- 为 admin(1) 和 test(2) 用户插入训练记录和计划
-- ============================================================

USE fitness;

-- ============================================================
-- 1. 创建测试用户 (密码: 123456)
-- ============================================================
INSERT IGNORE INTO user (username, password, nickname, role, status) VALUES
('test', '$2a$10$.vQCZ3G.e7t0hqr/gL/gVuNgtnkPaJB8TyPKc8MV5/FAoWcA10cmO', '测试用户', 0, 1);

-- ============================================================
-- 2. Admin (user_id=1) 训练记录: Jan–May 2026
-- ============================================================

-- Jan: 3 records
INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-01-10', 60, 15, 150, 2, 1, '新年第一练，状态不错');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 1, 4, 10, 50.0, 1), (@r, 2, 3, 12, 20.0, 2), (@r, 3, 3, 15, 10.0, 3),
(@r, 6, 3, 10,  0.0, 4), (@r, 7, 3, 10, 50.0, 5);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-01-15', 55, 12, 120, 1, 1, '轻松训练日');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 11, 3, 12, 7.5, 1), (@r, 12, 3, 12, 5.0, 2), (@r, 18, 3, 12, 0.0, 3), (@r, 23, 3, 12, 0.0, 4);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-01-20', 70, 18, 180, 2, 1, '腿部训练日');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 20, 4, 10, 70.0, 1), (@r, 21, 4, 8, 70.0, 2), (@r, 22, 4, 12, 120.0, 3),
(@r, 24, 3, 12, 10.0, 4), (@r, 18, 3, 15, 0.0, 5);

-- Feb: 3 records
INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-02-05', 75, 20, 200, 3, 1, '背部突破日，硬拉PR');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 6, 4, 10,  0.0, 1), (@r, 7, 4, 8, 65.0, 2), (@r, 8, 4, 10, 55.0, 3),
(@r, 9, 4, 12, 45.0, 4), (@r, 10, 4, 10, 22.5, 5);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-02-10', 60, 14, 140, 2, 1, '胸部训练');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 1, 4, 10, 60.0, 1), (@r, 2, 3, 12, 25.0, 2), (@r, 3, 4, 15, 12.5, 3), (@r, 4, 3, 12, 20.0, 4);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-02-20', 50, 12, 120, 1, 1, '轻量恢复训练');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 5, 4, 20, 0.0, 1), (@r, 18, 4, 15, 0.0, 2), (@r, 23, 4, 12, 0.0, 3);

-- Mar: 3 records
INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-03-03', 80, 22, 220, 3, 1, '高强度全身训练');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 1, 4, 8, 70.0, 1), (@r, 6, 4, 10, 0.0, 2), (@r, 20, 4, 10, 90.0, 3),
(@r, 11, 4, 12, 10.0, 4), (@r, 15, 3, 12, 22.5, 5), (@r, 17, 3, 15, 15.0, 6);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-03-12', 65, 16, 160, 2, 1, '胸+三头组合');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 1, 4, 10, 65.0, 1), (@r, 2, 4, 12, 25.0, 2), (@r, 3, 3, 15, 15.0, 3),
(@r, 17, 3, 15, 17.5, 4), (@r, 18, 3, 12, 0.0, 5);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-03-25', 70, 18, 180, 2, 1, '背+二头');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 7, 4, 10, 60.0, 1), (@r, 8, 4, 12, 55.0, 2), (@r, 9, 3, 12, 50.0, 3),
(@r, 15, 4, 12, 25.0, 4), (@r, 16, 3, 12, 15.0, 5);

-- Apr: 4 records
INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-04-05', 75, 20, 200, 3, 1, '腿部大重量日');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 20, 5, 8, 100.0, 1), (@r, 21, 4, 6, 90.0, 2), (@r, 22, 4, 10, 180.0, 3),
(@r, 24, 4, 12, 15.0, 4), (@r, 18, 3, 15, 0.0, 5);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-04-10', 60, 15, 150, 2, 1, '肩部训练');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 11, 4, 10, 12.5, 1), (@r, 12, 4, 15, 7.5, 2), (@r, 13, 3, 12, 7.5, 3), (@r, 14, 4, 12, 5.0, 4);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-04-18', 55, 12, 120, 1, 1, '核心日');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 18, 4, 20, 0.0, 1), (@r, 23, 4, 15, 0.0, 2), (@r, 24, 4, 12, 0.0, 3);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-04-25', 70, 18, 180, 2, 1, '胸+背超级组');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 1, 4, 10, 65.0, 1), (@r, 6, 4, 10, 0.0, 2), (@r, 2, 3, 12, 25.0, 3),
(@r, 7, 3, 10, 60.0, 4), (@r, 8, 3, 12, 55.0, 5), (@r, 17, 3, 15, 17.5, 6);

-- May: 5 records (including today)
INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-05-01', 60, 15, 150, 2, 1, '五一劳动节训练');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 1, 4, 10, 65.0, 1), (@r, 6, 4, 10, 0.0, 2), (@r, 20, 4, 10, 80.0, 3), (@r, 11, 3, 12, 10.0, 4);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-05-08', 70, 18, 180, 3, 1, '硬拉突破！140kg');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 21, 5, 5, 140.0, 1), (@r, 7, 4, 10, 65.0, 2), (@r, 8, 4, 12, 60.0, 3),
(@r, 9, 3, 12, 50.0, 4), (@r, 10, 3, 12, 25.0, 5);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-05-14', 65, 16, 160, 2, 1, '胸肩日');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 1, 4, 10, 65.0, 1), (@r, 2, 3, 12, 25.0, 2), (@r, 3, 3, 15, 15.0, 3),
(@r, 11, 3, 12, 10.0, 4), (@r, 12, 3, 15, 7.5, 5);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-05-17', 75, 20, 200, 3, 1, '腿部高强度');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 20, 5, 8, 105.0, 1), (@r, 21, 4, 8, 90.0, 2), (@r, 22, 4, 12, 190.0, 3),
(@r, 24, 4, 12, 15.0, 4), (@r, 18, 3, 15, 0.0, 5);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-05-19', 40, 12, 120, 1, 0, '今天刚开始训练，计划练手臂');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 15, 3, 12, 22.5, 1), (@r, 16, 3, 12, 15.0, 2), (@r, 17, 3, 15, 17.5, 3), (@r, 18, 3, 0, 0.0, 4);

-- ============================================================
-- 3. Test用户 (user_id=2) 训练记录
-- ============================================================
INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(2, '2026-05-15', 50, 12, 120, 1, 1, '第一次训练，感觉不错');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 5, 3, 15, 0.0, 1), (@r, 18, 3, 15, 0.0, 2), (@r, 23, 3, 12, 0.0, 3), (@r, 24, 3, 12, 0.0, 4);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(2, '2026-05-17', 55, 14, 140, 2, 1, '第二次训练，开始加重量');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 1, 3, 12, 30.0, 1), (@r, 6, 3, 8, 0.0, 2), (@r, 20, 4, 10, 40.0, 3), (@r, 11, 4, 12, 5.0, 4);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(2, '2026-05-18', 45, 10, 100, 1, 1, '核心训练');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, sort_order) VALUES
(@r, 18, 4, 15, 0.0, 1), (@r, 23, 3, 15, 0.0, 2), (@r, 24, 3, 12, 0.0, 3);

-- ============================================================
-- 4. Admin训练计划
-- ============================================================
INSERT INTO plan (user_id, group_id, title, description, target_body_part, difficulty_level, train_days, is_public) VALUES
(1, 2, '胸部增肌强化计划', '上中下胸全方位刺激，每周2次', '胸部', 2, 3, 1);
SET @p = LAST_INSERT_ID();
INSERT INTO plan_detail (plan_id, exercise_id, day_number, sets, reps, weight, rest_seconds, sort_order) VALUES
(@p, 1, 1, 4, 10, 60.0, 90, 1), (@p, 2, 1, 3, 12, 25.0, 90, 2),
(@p, 3, 1, 3, 15, 12.5, 60, 3), (@p, 4, 1, 3, 12, 20.0, 60, 4),
(@p, 1, 2, 4, 8, 65.0, 90, 5), (@p, 2, 2, 3, 10, 27.5, 90, 6),
(@p, 3, 2, 4, 12, 15.0, 60, 7), (@p, 1, 3, 4, 8, 70.0, 90, 8),
(@p, 4, 3, 3, 12, 22.5, 60, 9);

INSERT INTO plan (user_id, group_id, title, description, target_body_part, difficulty_level, train_days, is_public) VALUES
(1, 2, '背部宽度与厚度训练', '引体向上+划船组合，打造V型背部', '背部', 3, 3, 1);
SET @p = LAST_INSERT_ID();
INSERT INTO plan_detail (plan_id, exercise_id, day_number, sets, reps, weight, rest_seconds, sort_order) VALUES
(@p, 6, 1, 4, 8, 0.0, 120, 1), (@p, 7, 1, 4, 10, 60.0, 120, 2),
(@p, 8, 1, 4, 12, 55.0, 90, 3), (@p, 9, 1, 3, 12, 45.0, 90, 4),
(@p, 6, 2, 4, 10, 0.0, 120, 5), (@p, 7, 2, 4, 8, 65.0, 120, 6),
(@p, 10, 2, 4, 12, 25.0, 90, 7), (@p, 8, 3, 4, 10, 60.0, 90, 8);

INSERT INTO plan (user_id, group_id, title, description, target_body_part, difficulty_level, train_days, is_public) VALUES
(1, 1, '新手全身入门计划', '适合初学者的全身训练，每周3次', '全身', 1, 3, 1);
SET @p = LAST_INSERT_ID();
INSERT INTO plan_detail (plan_id, exercise_id, day_number, sets, reps, weight, rest_seconds, sort_order) VALUES
(@p, 5, 1, 3, 15, 0.0, 60, 1), (@p, 23, 1, 3, 12, 0.0, 90, 2),
(@p, 12, 1, 3, 12, 5.0, 60, 3), (@p, 8, 1, 3, 12, 35.0, 60, 4),
(@p, 18, 2, 3, 15, 0.0, 90, 5), (@p, 9, 2, 3, 12, 15.0, 60, 6),
(@p, 15, 2, 3, 12, 15.0, 60, 7), (@p, 20, 3, 3, 12, 50.0, 90, 8),
(@p, 14, 3, 3, 12, 5.0, 60, 9), (@p, 17, 3, 3, 15, 12.5, 60, 10);

INSERT INTO plan (user_id, group_id, title, description, target_body_part, difficulty_level, train_days, is_public) VALUES
(1, 3, '夏季减脂计划', '高次数低间歇，配合核心训练', '全身', 2, 4, 1);
SET @p = LAST_INSERT_ID();
INSERT INTO plan_detail (plan_id, exercise_id, day_number, sets, reps, weight, rest_seconds, sort_order) VALUES
(@p, 6, 1, 4, 15, 0.0, 45, 1), (@p, 5, 1, 4, 20, 0.0, 45, 2),
(@p, 20, 1, 4, 15, 40.0, 60, 3), (@p, 18, 1, 3, 20, 0.0, 45, 4),
(@p, 24, 1, 3, 15, 0.0, 45, 5), (@p, 1, 2, 4, 12, 50.0, 60, 6),
(@p, 7, 2, 4, 12, 40.0, 60, 7), (@p, 22, 2, 4, 15, 100.0, 60, 8),
(@p, 23, 3, 4, 15, 0.0, 45, 9), (@p, 12, 3, 4, 15, 5.0, 45, 10);

-- ============================================================
-- 5. Test用户训练计划
-- ============================================================
INSERT INTO plan (user_id, group_id, title, description, target_body_part, difficulty_level, train_days, is_public) VALUES
(2, 1, '测试用户入门计划', '刚开始健身，从基础动作开始', '全身', 1, 3, 1);
SET @p = LAST_INSERT_ID();
INSERT INTO plan_detail (plan_id, exercise_id, day_number, sets, reps, weight, rest_seconds, sort_order) VALUES
(@p, 5, 1, 3, 12, 0.0, 60, 1), (@p, 18, 1, 3, 15, 0.0, 90, 2),
(@p, 12, 2, 3, 12, 5.0, 60, 3), (@p, 17, 2, 3, 15, 10.0, 60, 4),
(@p, 20, 3, 3, 10, 30.0, 90, 5);
