-- ============================================================
-- 健身记录Web应用 - 数据库建表脚本
-- 数据库名称: fitness
-- 字符集: utf8mb4
-- ============================================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS fitness DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fitness;

-- ============================================================
-- 一、基础业务表
-- ============================================================

-- 1. 健身动作表
DROP TABLE IF EXISTS exercise;
CREATE TABLE exercise (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    name VARCHAR(100) NOT NULL COMMENT '动作名称',
    category VARCHAR(20) NOT NULL COMMENT '所属分类: 胸部/背部/肩部/手臂/腿部/核心',
    description TEXT COMMENT '动作讲解',
    key_points TEXT COMMENT '训练要点',
    precautions TEXT COMMENT '注意事项',
    video_path VARCHAR(255) COMMENT '本地MP4示范视频路径',
    upload_user_id BIGINT COMMENT '上传用户ID(预留, 游客为NULL)',
    audit_status TINYINT DEFAULT 0 COMMENT '审核状态(预留): 0-待审核/1-审核通过/2-审核拒绝',
    view_count BIGINT DEFAULT 0 COMMENT '浏览次数',
    sort_weight INT DEFAULT 0 COMMENT '排序权重',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除: 0-否/1-是'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='健身动作库表';

-- 2. 训练记录主表
DROP TABLE IF EXISTS training_record;
CREATE TABLE training_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT COMMENT '用户ID(预留, 游客为NULL)',
    train_date DATE NOT NULL COMMENT '训练日期',
    duration INT COMMENT '训练时长(分钟)',
    total_sets INT DEFAULT 0 COMMENT '当日总组数',
    total_reps INT DEFAULT 0 COMMENT '当日总次数',
    calories INT COMMENT '消耗卡路里(预留字段)',
    difficulty TINYINT COMMENT '训练难度(预留): 1-轻松/2-适中/3-困难',
    is_completed TINYINT DEFAULT 0 COMMENT '是否标记完成: 0-否/1-是',
    notes TEXT COMMENT '备注信息',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除: 0-否/1-是',
    INDEX idx_user_id (user_id),
    INDEX idx_train_date (train_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='训练记录表';

-- 3. 训练记录明细表
DROP TABLE IF EXISTS training_record_detail;
CREATE TABLE training_record_detail (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    record_id BIGINT NOT NULL COMMENT '关联训练记录ID',
    exercise_id BIGINT NOT NULL COMMENT '关联动作ID',
    set_number INT NOT NULL COMMENT '组数',
    reps INT NOT NULL COMMENT '每组次数',
    weight DECIMAL(5,1) COMMENT '负重重量(kg)',
    is_completed TINYINT DEFAULT 0 COMMENT '该组是否完成: 0-否/1-是',
    notes VARCHAR(500) COMMENT '备注',
    sort_order INT DEFAULT 0 COMMENT '排序号',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除: 0-否/1-是',
    INDEX idx_record_id (record_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='训练记录明细表';

-- 4. 训练计划分组表
DROP TABLE IF EXISTS plan_group;
CREATE TABLE plan_group (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT COMMENT '用户ID(预留, 游客为NULL)',
    name VARCHAR(50) NOT NULL COMMENT '分组名称(如: 新手入门/增肌计划/减脂计划)',
    sort_weight INT DEFAULT 0 COMMENT '排序权重',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除: 0-否/1-是'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='训练计划分组表';

-- 5. 个人训练计划主表
DROP TABLE IF EXISTS plan;
CREATE TABLE plan (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT COMMENT '用户ID(预留, 游客为NULL)',
    group_id BIGINT COMMENT '关联计划分组ID',
    title VARCHAR(100) NOT NULL COMMENT '计划标题',
    description TEXT COMMENT '计划描述',
    target_body_part VARCHAR(50) COMMENT '目标训练部位',
    difficulty_level TINYINT DEFAULT 1 COMMENT '难度等级: 1-新手/2-进阶/3-高级',
    train_days INT DEFAULT 1 COMMENT '训练天数',
    view_count BIGINT DEFAULT 0 COMMENT '浏览次数',
    collect_count BIGINT DEFAULT 0 COMMENT '收藏次数',
    like_count BIGINT DEFAULT 0 COMMENT '点赞次数',
    is_public TINYINT DEFAULT 0 COMMENT '是否公开(预留): 0-私有/1-公开',
    share_code VARCHAR(50) COMMENT '分享唯一标识(预留)',
    share_time DATETIME COMMENT '分享时间(预留)',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除: 0-否/1-是',
    INDEX idx_user_id (user_id),
    INDEX idx_group_id (group_id),
    INDEX idx_share_code (share_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='个人训练计划表';

-- 6. 训练计划明细表
DROP TABLE IF EXISTS plan_detail;
CREATE TABLE plan_detail (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    plan_id BIGINT NOT NULL COMMENT '关联计划ID',
    exercise_id BIGINT NOT NULL COMMENT '关联动作ID',
    day_number INT DEFAULT 1 COMMENT '训练日序号',
    sets INT DEFAULT 3 COMMENT '建议组数',
    reps INT DEFAULT 12 COMMENT '建议每组次数',
    weight DECIMAL(5,1) COMMENT '建议负重重量(kg)',
    rest_seconds INT DEFAULT 60 COMMENT '组间休息时间(秒)',
    notes VARCHAR(500) COMMENT '备注',
    sort_order INT DEFAULT 0 COMMENT '排序号',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除: 0-否/1-是',
    INDEX idx_plan_id (plan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='训练计划明细表';

-- ============================================================
-- 二、用户账号体系预留表
-- ============================================================

-- 用户表
DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码(BCrypt加密存储)',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar VARCHAR(255) COMMENT '头像URL',
    email VARCHAR(100) COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '手机号',
    bio VARCHAR(500) COMMENT '个人简介',
    role TINYINT DEFAULT 0 COMMENT '角色: 0-普通用户/1-管理员/2-超级管理员',
    status TINYINT DEFAULT 1 COMMENT '账号状态: 0-禁用/1-正常',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除: 0-否/1-是',
    UNIQUE INDEX uk_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- ============================================================
-- 三、训练计划分享与导入预留表
-- ============================================================

-- 计划分享表
DROP TABLE IF EXISTS plan_share;
CREATE TABLE plan_share (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    plan_id BIGINT NOT NULL COMMENT '关联计划ID',
    user_id BIGINT NOT NULL COMMENT '分享用户ID',
    share_type TINYINT DEFAULT 0 COMMENT '分享类型: 0-公开分享/1-私密链接分享',
    share_code VARCHAR(50) NOT NULL COMMENT '分享唯一标识',
    expire_time DATETIME COMMENT '分享过期时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_share_code (share_code),
    INDEX idx_plan_id (plan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='计划分享表';

-- 计划导入记录表
DROP TABLE IF EXISTS plan_import;
CREATE TABLE plan_import (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '导入用户ID',
    source_plan_id BIGINT NOT NULL COMMENT '原计划ID',
    import_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '导入时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除: 0-否/1-是',
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='计划导入记录表';

-- ============================================================
-- 四、社交互动功能预留表
-- ============================================================

-- 收藏表
DROP TABLE IF EXISTS collect;
CREATE TABLE collect (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    target_type TINYINT NOT NULL COMMENT '收藏对象类型: 0-个人计划/1-博主计划/2-动作',
    target_id BIGINT NOT NULL COMMENT '收藏对象ID',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE INDEX uk_user_target (user_id, target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

-- 点赞表
DROP TABLE IF EXISTS like_record;
CREATE TABLE like_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    target_type TINYINT NOT NULL COMMENT '点赞对象类型: 0-计划/1-动作/2-评论',
    target_id BIGINT NOT NULL COMMENT '点赞对象ID',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE INDEX uk_user_target (user_id, target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='点赞记录表';

-- 评论表
DROP TABLE IF EXISTS comment;
CREATE TABLE comment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    target_type TINYINT NOT NULL COMMENT '评论对象类型: 0-计划/1-动作/2-博主计划',
    target_id BIGINT NOT NULL COMMENT '评论对象ID',
    content TEXT NOT NULL COMMENT '评论内容',
    parent_id BIGINT DEFAULT 0 COMMENT '父评论ID(0表示顶级评论, 非0表示回复)',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除: 0-否/1-是',
    INDEX idx_target (target_type, target_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 关注表
DROP TABLE IF EXISTS follow;
CREATE TABLE follow (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID(关注者)',
    follow_user_id BIGINT NOT NULL COMMENT '被关注用户ID',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE INDEX uk_user_follow (user_id, follow_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户关注表';

-- ============================================================
-- 五、知名博主专区预留表
-- ============================================================

-- 博主表
DROP TABLE IF EXISTS blogger;
CREATE TABLE blogger (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    nickname VARCHAR(100) NOT NULL COMMENT '博主昵称',
    avatar VARCHAR(255) COMMENT '头像URL',
    bio TEXT COMMENT '个人简介',
    source_platform VARCHAR(50) COMMENT '所属平台: B站/抖音/小红书等',
    platform_url VARCHAR(255) COMMENT '平台主页链接',
    category VARCHAR(50) COMMENT '博主分类: 健体/力量举/CrossFit/瑜伽等',
    follower_count BIGINT DEFAULT 0 COMMENT '粉丝数',
    is_recommended TINYINT DEFAULT 0 COMMENT '是否推荐置顶: 0-否/1-是',
    sort_weight INT DEFAULT 0 COMMENT '排序权重(数字越大排名越靠前)',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除: 0-否/1-是'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='博主表';

-- 博主训练计划表
DROP TABLE IF EXISTS blogger_plan;
CREATE TABLE blogger_plan (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    blogger_id BIGINT NOT NULL COMMENT '关联博主ID',
    title VARCHAR(200) NOT NULL COMMENT '计划标题',
    cover_image VARCHAR(255) COMMENT '封面图URL',
    difficulty_level TINYINT DEFAULT 1 COMMENT '难度等级: 1-新手/2-进阶/3-高级',
    target_audience VARCHAR(200) COMMENT '适用人群',
    target_body_part VARCHAR(50) COMMENT '训练部位',
    train_days INT DEFAULT 1 COMMENT '训练天数',
    video_url VARCHAR(500) COMMENT '视频链接(支持B站/抖音/优酷等外部链接)',
    video_type TINYINT DEFAULT 0 COMMENT '视频类型: 0-本地视频/1-外部链接视频',
    summary TEXT COMMENT '计划简介',
    detail_arrangement TEXT COMMENT '详细训练安排',
    view_count BIGINT DEFAULT 0 COMMENT '浏览次数',
    collect_count BIGINT DEFAULT 0 COMMENT '收藏次数',
    like_count BIGINT DEFAULT 0 COMMENT '点赞次数',
    is_online TINYINT DEFAULT 1 COMMENT '上架状态: 0-下架/1-上架',
    sort_weight INT DEFAULT 0 COMMENT '排序权重',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除: 0-否/1-是',
    INDEX idx_blogger_id (blogger_id),
    INDEX idx_category (is_online, sort_weight)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='博主训练计划表';

-- ============================================================
-- 六、扩展功能预留表
-- ============================================================

-- 训练提醒表
DROP TABLE IF EXISTS reminder;
CREATE TABLE reminder (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    remind_time TIME NOT NULL COMMENT '每日提醒时间',
    remind_days VARCHAR(50) DEFAULT '1,2,3,4,5,6,7' COMMENT '提醒日期(逗号分隔, 1=周一...7=周日)',
    is_enabled TINYINT DEFAULT 1 COMMENT '是否启用: 0-否/1-是',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='训练提醒表';

-- 消息通知表
DROP TABLE IF EXISTS message;
CREATE TABLE message (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '接收用户ID',
    sender_id BIGINT COMMENT '发送用户ID(系统消息为NULL)',
    msg_type TINYINT NOT NULL COMMENT '消息类型: 0-系统消息/1-评论回复/2-点赞通知/3-关注通知',
    title VARCHAR(200) COMMENT '消息标题',
    content TEXT COMMENT '消息内容',
    target_type TINYINT COMMENT '关联对象类型',
    target_id BIGINT COMMENT '关联对象ID',
    is_read TINYINT DEFAULT 0 COMMENT '是否已读: 0-否/1-是',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除: 0-否/1-是',
    INDEX idx_user_id (user_id, is_read),
    INDEX idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息通知表';

-- 系统配置表
DROP TABLE IF EXISTS system_config;
CREATE TABLE system_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    config_key VARCHAR(100) NOT NULL COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    config_desc VARCHAR(255) COMMENT '配置说明',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';
