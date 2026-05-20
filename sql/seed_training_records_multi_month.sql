-- ============================================================
-- 为 admin(1)、test(2) 补充 2026-01 ~ 2026-04 多月份训练记录
-- 执行: mysql -u root -p<密码> --default-character-set=utf8mb4 fitness < sql/seed_training_records_multi_month.sql
-- ============================================================

USE fitness;

-- ===================== admin (user_id=1) =====================

-- 2026-01
INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-01-08', 60, 12, 120, 2, 1, '新年开练，胸背基础日');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 1, 1, 12, 55.0, 1, 1), (@r, 1, 2, 10, 60.0, 1, 2), (@r, 1, 3,  8, 65.0, 1, 3),
(@r, 7, 1, 10, 55.0, 1, 4), (@r, 7, 2, 10, 60.0, 1, 5), (@r, 8, 1, 12, 50.0, 1, 6);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-01-18', 55, 10, 100, 1, 1, '肩+核心恢复训练');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 11, 1, 12, 20.0, 1, 1), (@r, 11, 2, 10, 22.5, 1, 2), (@r, 12, 1, 15, 10.0, 1, 3),
(@r, 23, 1, 60,  0.0, 1, 4), (@r, 25, 1, 20,  0.0, 1, 5);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-01-25', 70, 14, 140, 2, 1, '腿部力量日');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 19, 1, 10, 70.0, 1, 1), (@r, 19, 2,  8, 80.0, 1, 2), (@r, 19, 3,  6, 85.0, 1, 3),
(@r, 20, 1, 12, 75.0, 1, 4), (@r, 20, 2, 10, 85.0, 1, 5), (@r, 22, 1, 12, 150.0, 1, 6);

-- 2026-02
INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-02-06', 75, 16, 160, 3, 1, '背部突破，引体进步');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 6, 1, 10,  0.0, 1, 1), (@r, 6, 2, 10,  0.0, 1, 2), (@r, 6, 3,  8,  0.0, 1, 3),
(@r, 7, 1, 10, 60.0, 1, 4), (@r, 7, 2,  8, 65.0, 1, 5), (@r, 8, 1, 12, 55.0, 1, 6);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-02-14', 60, 12, 120, 2, 1, '胸部增肌');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 1, 1, 10, 62.5, 1, 1), (@r, 1, 2,  8, 67.5, 1, 2), (@r, 2, 1, 12, 25.0, 1, 3),
(@r, 2, 2, 10, 27.5, 1, 4), (@r, 3, 1, 15, 12.5, 1, 5);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-02-22', 50, 9, 90, 1, 1, '轻量全身激活');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 5, 1, 15,  0.0, 1, 1), (@r, 5, 2, 12,  0.0, 1, 2), (@r, 18, 1, 45,  0.0, 1, 3),
(@r, 9, 1, 12, 40.0, 1, 4);

-- 2026-03
INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-03-05', 80, 18, 180, 3, 1, '高强度推拉超级组');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 1, 1,  8, 70.0, 1, 1), (@r, 1, 2,  6, 75.0, 1, 2), (@r, 7, 1, 10, 62.5, 1, 3),
(@r, 7, 2,  8, 67.5, 1, 4), (@r, 17, 1, 15, 20.0, 1, 5), (@r, 17, 2, 12, 22.5, 1, 6);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-03-15', 65, 12, 120, 2, 1, '手臂专项');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 15, 1, 12, 25.0, 1, 1), (@r, 15, 2, 10, 27.5, 1, 2), (@r, 16, 1, 12, 15.0, 1, 3),
(@r, 17, 1, 15, 17.5, 1, 4), (@r, 18, 1, 10, 40.0, 1, 5);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-03-28', 70, 14, 140, 2, 1, '腿+核心');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 19, 1,  8, 85.0, 1, 1), (@r, 19, 2,  6, 90.0, 1, 2), (@r, 21, 1,  8, 85.0, 1, 3),
(@r, 21, 2,  6, 90.0, 1, 4), (@r, 23, 1, 60,  0.0, 1, 5), (@r, 26, 1, 20,  5.0, 1, 6);

-- 2026-04
INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-04-03', 75, 16, 160, 3, 1, '腿部大重量');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 19, 1,  6, 95.0, 1, 1), (@r, 19, 2,  5, 100.0, 1, 2), (@r, 20, 1, 10, 90.0, 1, 3),
(@r, 20, 2,  8, 95.0, 1, 4), (@r, 22, 1, 12, 180.0, 1, 5), (@r, 22, 2, 10, 190.0, 1, 6);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-04-12', 60, 12, 120, 2, 1, '肩部塑形');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 11, 1, 10, 22.5, 1, 1), (@r, 11, 2,  8, 25.0, 1, 2), (@r, 12, 1, 15, 10.0, 1, 3),
(@r, 14, 1, 12, 10.0, 1, 4);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-04-20', 55, 10, 100, 1, 1, '核心稳定');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 23, 1, 60,  0.0, 1, 1), (@r, 25, 1, 20,  0.0, 1, 2), (@r, 26, 1, 25,  5.0, 1, 3);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(1, '2026-04-27', 70, 14, 140, 2, 1, '胸背超级组');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 1, 1, 10, 65.0, 1, 1), (@r, 1, 2,  8, 70.0, 1, 2), (@r, 6, 1, 10,  0.0, 1, 3),
(@r, 7, 1, 10, 60.0, 1, 4), (@r, 8, 1, 12, 55.0, 1, 5);

-- ===================== test (user_id=2) =====================

-- 2026-01
INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(2, '2026-01-12', 40, 9, 90, 1, 1, '入门第一周，徒手为主');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 5, 1, 12,  0.0, 1, 1), (@r, 5, 2, 10,  0.0, 1, 2), (@r, 18, 1, 30,  0.0, 1, 3),
(@r, 23, 1, 30,  0.0, 1, 4);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(2, '2026-01-22', 45, 10, 100, 1, 1, '开始接触器械');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 8, 1, 12, 25.0, 1, 1), (@r, 8, 2, 10, 27.5, 1, 2), (@r, 12, 1, 12,  5.0, 1, 3),
(@r, 17, 1, 12, 10.0, 1, 4);

-- 2026-02
INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(2, '2026-02-08', 50, 12, 120, 1, 1, '全身适应训练');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 1, 1, 12, 25.0, 1, 1), (@r, 1, 2, 10, 30.0, 1, 2), (@r, 20, 1, 12, 35.0, 1, 3),
(@r, 20, 2, 10, 40.0, 1, 4), (@r, 5, 1, 15,  0.0, 1, 5);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(2, '2026-02-18', 45, 9, 90, 1, 1, '背部入门');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 8, 1, 12, 30.0, 1, 1), (@r, 8, 2, 10, 32.5, 1, 2), (@r, 9, 1, 12, 20.0, 1, 3),
(@r, 6, 1,  6,  0.0, 1, 4);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(2, '2026-02-26', 40, 8, 80, 1, 1, '核心+有氧恢复');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 23, 1, 45, 0.0, 1, 1), (@r, 25, 1, 15, 0.0, 1, 2), (@r, 24, 1, 12, 0.0, 1, 3);

-- 2026-03
INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(2, '2026-03-06', 55, 12, 130, 2, 1, '胸肩组合，重量略增');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 1, 1, 10, 32.5, 1, 1), (@r, 1, 2,  8, 35.0, 1, 2), (@r, 2, 1, 12, 12.5, 1, 3),
(@r, 11, 1, 12,  7.5, 1, 4), (@r, 12, 1, 12,  5.0, 1, 5);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(2, '2026-03-16', 50, 10, 100, 2, 1, '腿部进步');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 20, 1, 12, 45.0, 1, 1), (@r, 20, 2, 10, 50.0, 1, 2), (@r, 22, 1, 12, 80.0, 1, 3),
(@r, 24, 1, 10, 10.0, 1, 4);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(2, '2026-03-27', 45, 9, 90, 1, 1, '手臂入门');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 15, 1, 12, 15.0, 1, 1), (@r, 15, 2, 10, 17.5, 1, 2), (@r, 17, 1, 12, 12.5, 1, 3),
(@r, 16, 1, 12, 10.0, 1, 4);

-- 2026-04
INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(2, '2026-04-07', 55, 12, 125, 2, 1, '全身巩固');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 1, 1, 10, 35.0, 1, 1), (@r, 6, 1,  8,  0.0, 1, 2), (@r, 7, 1, 10, 40.0, 1, 3),
(@r, 20, 1, 10, 50.0, 1, 4), (@r, 5, 1, 15,  0.0, 1, 5);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(2, '2026-04-15', 50, 10, 100, 2, 1, '背部+二头');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 8, 1, 12, 35.0, 1, 1), (@r, 8, 2, 10, 37.5, 1, 2), (@r, 9, 1, 12, 25.0, 1, 3),
(@r, 15, 1, 12, 17.5, 1, 4);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(2, '2026-04-24', 45, 9, 90, 1, 1, '核心强化');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 23, 1, 50, 0.0, 1, 1), (@r, 25, 1, 18, 0.0, 1, 2), (@r, 26, 1, 20, 5.0, 1, 3);

-- 2026-05（补充 test 除 5/16 外的记录）
INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(2, '2026-05-03', 45, 10, 100, 1, 1, '五一后恢复训练');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 5, 1, 15,  0.0, 1, 1), (@r, 8, 1, 12, 35.0, 1, 2), (@r, 20, 1, 10, 45.0, 1, 3),
(@r, 23, 1, 40,  0.0, 1, 4);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(2, '2026-05-10', 50, 12, 120, 2, 1, '胸+三头');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 1, 1, 10, 37.5, 1, 1), (@r, 1, 2,  8, 40.0, 1, 2), (@r, 2, 1, 12, 15.0, 1, 3),
(@r, 17, 1, 12, 15.0, 1, 4);

INSERT INTO training_record (user_id, train_date, duration, total_sets, total_reps, difficulty, is_completed, notes) VALUES
(2, '2026-05-19', 55, 12, 130, 2, 1, '背+腿组合');
SET @r = LAST_INSERT_ID();
INSERT INTO training_record_detail (record_id, exercise_id, set_number, reps, weight, is_completed, sort_order) VALUES
(@r, 7, 1, 10, 42.5, 1, 1), (@r, 7, 2,  8, 45.0, 1, 2), (@r, 20, 1, 10, 50.0, 1, 3),
(@r, 22, 1, 12, 90.0, 1, 4);
