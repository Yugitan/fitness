-- ============================================================
-- 为已有用户补齐四套默认训练计划（与 DefaultPlanSeeder 标题一致）
-- 执行后请刷新训练计划页；Java 端也会在打开列表时自动补齐缺失项
-- ============================================================

USE fitness;

-- 以下存储过程式逻辑用临时脚本：对每个用户插入缺失的 4 套计划
-- 建议优先依赖应用内 ensureDefaultPlans；本脚本供纯 SQL 环境使用

-- 用户 1 admin：若缺少「初级」则插入（示例，完整四套由应用自动创建更可靠）
-- 直接访问 /plan/ 页面即可触发后端补齐

SELECT u.id, u.username,
       SUM(CASE WHEN p.title = '初级 · 全身入门计划' THEN 1 ELSE 0 END) AS has_beginner,
       SUM(CASE WHEN p.title = '中级 · 增肌强化计划' THEN 1 ELSE 0 END) AS has_intermediate,
       SUM(CASE WHEN p.title = '高级 · 力量进阶计划' THEN 1 ELSE 0 END) AS has_advanced,
       SUM(CASE WHEN p.title = 'Pro · 竞技分化计划' THEN 1 ELSE 0 END) AS has_pro
FROM user u
LEFT JOIN plan p ON p.user_id = u.id AND p.is_deleted = 0
  AND p.title IN (
    '初级 · 全身入门计划',
    '中级 · 增肌强化计划',
    '高级 · 力量进阶计划',
    'Pro · 竞技分化计划'
  )
WHERE u.is_deleted = 0 AND u.role < 2
GROUP BY u.id, u.username;
