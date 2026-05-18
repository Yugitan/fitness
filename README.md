# Fitness健身记录 Web应用

## 项目介绍

Fitness健身记录是一款基于Spring Boot开发的个人健身训练记录管理Web应用。系统提供了健身动作库浏览、个人每日训练记录管理、自定义训练计划模板等核心功能，并预留了用户账号体系、社交互动、数据统计可视化、知名博主专区、管理员后台等完整扩展架构。

### 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 后端框架 | Spring Boot | 2.5.15 |
| Web框架 | Spring MVC | 5.3.x |
| ORM框架 | MyBatis | 3.5.9 |
| 数据库 | MySQL | 8.0.33 |
| 模板引擎 | Thymeleaf | 3.0.15 |
| 前端框架 | Bootstrap | 5.3.0 |
| 图表库 | Chart.js | 2.9.4 |
| Java版本 | OpenJDK | 14 |
| 构建工具 | Maven | 3.9.11 |
| 部署容器 | Tomcat | 9.0.89 |

---

## 环境要求

| 软件 | 精确版本 | 说明 |
|------|----------|------|
| JDK | 14 | 必须使用Java 14 |
| Maven | 3.9.11 | 项目构建管理 |
| Tomcat | 9.0.89 | 外置Tomcat部署 |
| MySQL | 8.0.33 | 数据库服务 |

---

## 项目目录结构

```
fitness/
├── pom.xml                                    # Maven项目配置文件
├── README.md                                  # 项目说明文档
├── sql/
│   ├── schema.sql                             # 数据库建表脚本
│   └── data.sql                               # 测试数据脚本
└── src/
    └── main/
        ├── java/com/fitness/
        │   ├── FitnessApplication.java        # Spring Boot主启动类
        │   ├── annotation/
        │   │   └── RequiresAdmin.java          # 管理员权限验证注解
        │   ├── common/
        │   │   └── Result.java                 # 统一返回结果类
        │   ├── config/
        │   │   └── WebConfig.java              # Web配置类
        │   ├── controller/
        │   │   ├── IndexController.java        # 首页控制器
        │   │   ├── ExerciseController.java     # 动作库控制器
        │   │   ├── TrainingRecordController.java # 训练记录控制器
        │   │   ├── PlanController.java         # 训练计划控制器
        │   │   ├── UserController.java         # 用户控制器（预留）
        │   │   ├── BloggerController.java      # 博主控制器（预留）
        │   │   ├── StatisticsController.java   # 统计控制器（预留）
        │   │   └── admin/
        │   │       ├── AdminController.java    # 后台管理控制器
        │   │       ├── AdminUserController.java
        │   │       ├── AdminExerciseController.java
        │   │       ├── AdminPlanController.java
        │   │       ├── AdminBloggerController.java
        │   │       └── AdminConfigController.java
        │   ├── entity/                         # 实体类（18个）
        │   │   ├── BaseEntity.java
        │   │   ├── Exercise.java
        │   │   ├── TrainingRecord.java
        │   │   ├── TrainingRecordDetail.java
        │   │   ├── Plan.java
        │   │   ├── PlanDetail.java
        │   │   ├── PlanGroup.java
        │   │   ├── User.java
        │   │   ├── PlanShare.java
        │   │   ├── PlanImport.java
        │   │   ├── Collect.java
        │   │   ├── LikeRecord.java
        │   │   ├── Comment.java
        │   │   ├── Follow.java
        │   │   ├── Blogger.java
        │   │   ├── BloggerPlan.java
        │   │   ├── SystemConfig.java
        │   │   ├── Reminder.java
        │   │   └── Message.java
        │   ├── exception/
        │   │   ├── BusinessException.java      # 自定义业务异常
        │   │   └── GlobalExceptionHandler.java # 全局异常处理器
        │   ├── interceptor/
        │   │   └── LoginInterceptor.java       # 登录拦截器
        │   ├── mapper/                         # MyBatis Mapper接口
        │   │   ├── ExerciseMapper.java
        │   │   ├── TrainingRecordMapper.java
        │   │   ├── TrainingRecordDetailMapper.java
        │   │   ├── PlanMapper.java
        │   │   ├── PlanDetailMapper.java
        │   │   ├── PlanGroupMapper.java
        │   │   ├── UserMapper.java
        │   │   ├── BloggerMapper.java
        │   │   ├── BloggerPlanMapper.java
        │   │   └── SystemConfigMapper.java
        │   ├── service/                        # 服务接口
        │   │   ├── ExerciseService.java
        │   │   ├── TrainingRecordService.java
        │   │   ├── PlanService.java
        │   │   ├── UserService.java
        │   │   ├── BloggerService.java
        │   │   └── SystemConfigService.java
        │   ├── service/impl/                   # 服务实现类
        │   │   ├── ExerciseServiceImpl.java
        │   │   ├── TrainingRecordServiceImpl.java
        │   │   ├── PlanServiceImpl.java
        │   │   ├── UserServiceImpl.java
        │   │   ├── BloggerServiceImpl.java
        │   │   └── SystemConfigServiceImpl.java
        │   └── util/                           # 工具类
        │       ├── DateUtils.java
        │       ├── StringUtils.java
        │       └── BCryptUtils.java
        └── resources/
            ├── application.yml                 # 应用配置
            ├── mybatis-config.xml              # MyBatis全局配置
            ├── mapper/                         # MyBatis XML映射文件
            │   ├── ExerciseMapper.xml
            │   ├── TrainingRecordMapper.xml
            │   ├── TrainingRecordDetailMapper.xml
            │   ├── PlanMapper.xml
            │   ├── PlanDetailMapper.xml
            │   ├── PlanGroupMapper.xml
            │   ├── UserMapper.xml
            │   ├── BloggerMapper.xml
            │   ├── BloggerPlanMapper.xml
            │   └── SystemConfigMapper.xml
            ├── static/
            │   ├── css/style.css               # 全局样式（深色运动主题）
            │   ├── js/common.js                 # 公共JS工具
            │   └── video/                       # 视频文件目录
            └── templates/                       # Thymeleaf模板
                ├── index.html                   # 首页
                ├── exercise/
                │   ├── list.html                # 动作库列表
                │   └── detail.html              # 动作详情
                ├── training/
                │   └── record.html              # 训练记录管理
                ├── plan/
                │   ├── list.html                # 计划列表
                │   ├── create.html              # 创建计划
                │   └── detail.html              # 计划详情
                ├── statistics.html              # 数据统计（预留）
                ├── blogger/
                │   ├── list.html                # 博主列表（预留）
                │   ├── detail.html              # 博主详情（预留）
                │   └── plan.html                # 博主计划（预留）
                └── admin/                       # 后台管理页面
                    ├── login.html
                    ├── index.html
                    ├── user/list.html
                    ├── exercise/list.html
                    ├── plan/list.html
                    ├── blogger/list.html
                    ├── blogger/plan.html
                    └── config.html
```

---

## 启动软件完整教程

### 第一步：初始化 MySQL 数据库

**1. 启动 MySQL 服务**（确保 MySQL 8.0 已安装并运行）

**2. 登录 MySQL 并执行建表脚本**

打开命令行终端，使用 root 账号登录 MySQL：

```bash
mysql -u root -p1234 --default-character-set=utf8mb4
```

> 提示：`-p1234` 是密码紧跟在 -p 后面（无空格）。如果使用 `-p` 会交互式提示输入密码。

**3. 执行 SQL 脚本**

```sql
-- 执行建表脚本（根据项目实际路径调整）
source D:/test-codes/fitness/sql/schema.sql;

-- 执行测试数据脚本
source D:/test-codes/fitness/sql/data.sql;

-- 验证数据是否导入成功
USE fitness;
SELECT COUNT(*) FROM exercise;   -- 应显示 26
SELECT * FROM user;              -- 应显示默认管理员 admin
```

**4. 退出 MySQL**

```sql
EXIT;
```

### 第二步：配置数据库连接

编辑 `src/main/resources/application.yml`，确认数据库连接信息正确（已按你的环境预设好）：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/fitness?useUnicode=true&characterEncoding=utf8mb4&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: 1234
```

### 第三步：编译打包项目

打开终端，进入项目根目录：

```bash
cd D:/test-codes/fitness

# 编译并打包（跳过测试）
mvn clean package '-Dmaven.test.skip=true'
```

编译成功后，WAR 包生成在 `target/fitness.war`。

### 第四步：部署到 Tomcat 9.0.89

**1. 下载 Tomcat**

从 [Apache Tomcat 官网](https://tomcat.apache.org/download-90.cgi) 下载 Tomcat 9.0.118 的 zip 包，解压到本地目录（例如 `D:/apache-tomcat-9.0.89`）。

**2. 部署 WAR 包**

将编译好的 `target/fitness.war` 复制到 Tomcat 的 `webapps/` 目录：

```bash
copy D:\test-codes\fitness\target\fitness.war D:\Develop\apache-tomcat-9.0.118\webapps\
```

**3. 启动 Tomcat**

打开新的命令行窗口：

```bash
# 进入 Tomcat 目录
cd D:\Develop\apache-tomcat-9.0.118\bin

# 启动 Tomcat
.\startup.bat
```

启动成功后会弹出一个新命令行窗口，看到类似 `Server startup in [xxx] milliseconds` 表示启动完成。

**4. 停止 Tomcat**（需要关闭时）

```bash
# 在 Tomcat bin 目录下执行
.\shutdown.bat
```

### 第五步：访问应用

打开浏览器，访问以下地址：

| 页面 | 地址 |
|------|------|
| **前台首页** | http://localhost:8080/fitness/ |
| 动作库 | http://localhost:8080/fitness/exercise |
| 训练记录 | http://localhost:8080/fitness/training |
| 训练计划 | http://localhost:8080/fitness/plan |
| 管理员登录 | http://localhost:8080/fitness/admin/login/page |

### 端口说明

- 应用默认端口：**8080**
- 如需修改端口，编辑 `Tomcat目录/conf/server.xml`，找到 `<Connector port="8080"` 修改为其他端口

### 一分钟快速验证

部署完成后，按以下步骤快速验证功能是否正常：

1. 访问 http://localhost:8080/fitness/ — 看到首页展示 26 个动作和 6 大分类
2. 点击"动作库" — 可按分类筛选、搜索动作
3. 点击"训练记录" — 新增一条训练记录，添加几个动作
4. 点击"训练计划" — 查看预置的 4 个计划分组
5. 访问 http://localhost:8080/fitness/admin/login/page — 用 admin/123456 登录后台

---

## 访问地址

| 页面 | 地址 | 说明 |
|------|------|------|
| 前台首页 | http://localhost:8080/fitness/ | 健身记录首页 |
| 动作库 | http://localhost:8080/fitness/exercise | 浏览健身动作 |
| 训练记录 | http://localhost:8080/fitness/training | 管理训练记录 |
| 训练计划 | http://localhost:8080/fitness/plan | 管理训练计划模板 |
| 数据统计 | http://localhost:8080/fitness/statistics | 训练数据统计（预留） |
| 博主专区 | http://localhost:8080/fitness/blogger/list | 博主列表（预留） |
| 管理员登录 | http://localhost:8080/fitness/admin/login/page | 后台登录入口 |
| 管理后台 | http://localhost:8080/fitness/admin | 后台管理仪表盘 |

### 默认管理员账号

- **用户名**：admin
- **密码**：123456

> 注：首次启动后请使用默认账号登录后台，建议修改密码。

---

## 功能说明

### 已实现功能

1. **健身动作库**
   - 六大分类：胸部、背部、肩部、手臂、腿部、核心
   - 每个动作包含名称、分类、讲解、训练要点、注意事项
   - 内置26个常用健身动作的完整测试数据
   - 按分类筛选动作、关键词模糊搜索
   - 支持将动作快速添加到当日训练列表
   - 预留HTML5视频播放器（支持MP4视频）

2. **个人每日训练记录**
   - 记录训练日期、动作、组数、次数、负重、时长、备注
   - 新增/编辑/删除/复制训练记录
   - 按日期范围筛选历史训练记录
   - 一键标记"今日训练完成"，自动统计组数和次数
   - 训练记录按日期倒序排列

3. **个人训练计划模板**
   - 创建/编辑/删除/复制训练计划
   - 计划分组管理：新手入门、增肌计划、减脂计划、力量突破
   - 一键套用模板生成当日训练清单
   - 每组训练可单独标记完成状态

### 预留扩展功能

| 优先级 | 功能 | 说明 |
|--------|------|------|
| 高 | 用户账号体系 | 注册/登录/个人信息管理 |
| 高 | 社交互动 | 点赞/收藏/评论/关注 |
| 高 | 数据统计可视化 | 折线图、柱状图展示训练数据 |
| 中 | 计划分享与导入 | 生成分享链接、一键导入他人计划 |
| 中 | 训练提醒 | 设置每日训练时间提醒 |
| 中 | 数据导入导出 | Excel批量导入导出训练记录 |
| 中 | 知名博主专区 | 博主列表、主页、训练计划 |
| 低 | 管理员后台 | 完整的后台管理系统 |
| 低 | 多端数据同步 | 对接小程序、APP |
| 低 | 云存储 | 视频/图片上传到阿里云OSS/腾讯云COS |

---

## 后期扩展开发指南

### 1. 用户账号体系（优先级：高）

**数据库已就绪**：user表结构完整，含角色、状态字段

**开发步骤**：
1. 实现 `UserController` 中的登录/注册页面跳转
2. 创建登录/注册前端页面
3. 修改当前训练记录和计划的 `userId` 关联逻辑
4. 实现LocalStorage数据同步到云端的API
5. 启用 `LoginInterceptor` 的完整拦截逻辑

### 2. 数据统计可视化（优先级：高）

**Chart.js已集成**：pom.xml中已配置依赖

**开发步骤**：
1. 在 `StatisticsServiceImpl` 中实现统计查询逻辑
2. 完成 `statistics.html` 页面的Chart.js图表配置
3. 添加个人训练统计、月度趋势、动作频率等图表

### 3. 社交互动功能（优先级：中）

**数据库已就绪**：collect、like_record、comment、follow表完整

**开发步骤**：
1. 创建对应的Mapper、Service、Controller
2. 在动作详情页和计划详情页添加点赞/收藏/评论UI
3. 实现评论的回复功能（parent_id字段已预留）

### 4. 博主专区（优先级：中）

**数据库已就绪**：blogger、blogger_plan表完整，支持视频链接

**开发步骤**：
1. 完善博主列表页和博主主页前端
2. 实现博主计划一键导入个人模板的逻辑
3. 添加视频播放功能（B站/抖音外部链接）
4. 管理员后台可对博主和计划进行管理

### 5. 管理员后台（优先级：低）

**框架已到位**：@RequiresAdmin注解、LoginInterceptor拦截器、所有后台页面占位、所有CRUD API

**开发步骤**：
1. 完善后台各页面的UI交互
2. 启用 `LoginInterceptor` 的完整会话验证
3. 实现仪表盘的真实统计数据

---

## 常见问题排查

### 1. 版本冲突问题

**现象**: 项目启动报 `NoClassDefFoundError` 或 `IncompatibleClassChangeError`

**解决**:
- 确认Java版本为14：`java -version`
- 确认Maven版本为3.9.11：`mvn -version`
- 确认所有pom.xml中的依赖版本未变动

### 2. 项目编译失败

**现象**: `mvn clean package` 报编译错误

**解决**:
```bash
# 清理Maven本地缓存
mvn clean package -Dmaven.test.skip=true -U
```

### 3. 数据库连接失败

**现象**: 启动时报 `CommunicationsException` 或 `Access denied`

**解决**:
- 确认MySQL服务已启动
- 检查 `application.yml` 中的数据库连接信息是否正确
- 确认已创建 `fitness` 数据库并执行了SQL脚本
- MySQL 8.0需要配置时区：`SET GLOBAL time_zone = '+08:00';`

### 4. Tomcat启动后无法访问

**现象**: 浏览器访问404

**解决**:
- 确认war包名称为 `fitness.war`（不是 `ROOT.war` 则需要加 `/fitness/` 前缀）
- 检查Tomcat日志 `$TOMCAT_HOME/logs/catalina.out`
- 确认Tomcat端口未被占用：`netstat -ano | findstr 8080`

### 5. 页面样式异常

**现象**: 页面没有样式或JS功能不生效

**解决**:
- 确认静态资源路径配置正确
- 检查 `application.yml` 中 `spring.web.resources.static-locations`
- 清理浏览器缓存后重试

### 6. 视频无法播放

**现象**: 动作详情页视频播放器不显示

**解决**:
- 将MP4视频文件放入 `src/main/resources/static/video/` 目录
- 在动作数据的 `video_path` 字段中填写正确的路径
- 支持的格式：MP4（H.264编码）

---

## 开发规范

1. **分层架构**：Controller → Service(接口+实现) → Mapper → Entity
2. **统一返回**：所有API返回 `Result` 对象，含 `code`、`message`、`data`
3. **逻辑删除**：所有表使用 `is_deleted` 字段，不做物理删除
4. **密码加密**：BCrypt加密存储用户密码
5. **防注入**：MyBatis使用 `#{}` 参数绑定，防止SQL注入
6. **防XSS**：前端使用 `escapeHtml` 方法转义用户输入
