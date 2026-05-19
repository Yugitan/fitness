# Fitness健身记录 Web应用

## 项目介绍

Fitness健身记录是一款基于Spring Boot + React的个人健身训练记录管理Web应用。系统提供了健身动作库浏览、个人每日训练记录管理、自定义训练计划模板等核心功能，并支持用户账号体系、游客模式、数据统计可视化、博主专区、管理员后台等完整功能。

### 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 后端框架 | Spring Boot | 2.5.15 |
| Web框架 | Spring MVC | 5.3.x |
| ORM框架 | MyBatis | 3.5.9 |
| 数据库 | MySQL | 8.0.33 |
| 前端框架 | React | 19 |
| 前端脚手架 | Next.js (App Router) | 15.1 |
| UI组件 | Radix UI + 自建 shadcn 风格组件 | — |
| 样式方案 | TailwindCSS | 3.4 |
| 图表库 | Recharts | 2.15 |
| 状态管理 | Zustand + TanStack React Query | v5 |
| 网络请求 | Axios | 1.7 |
| Java版本 | OpenJDK | 14 |
| 构建工具 | Maven | 3.9.11 |
| 部署容器 | Tomcat | 9.0.118 |

> 前端为 Next.js 静态导出 SPA，所有页面资源已编译内置于 WAR 包 `static/` 目录中，无 Node.js 运行时依赖。

---

## 环境要求

| 软件 | 精确版本 | 说明 |
|------|----------|------|
| JDK | 14 | 必须使用Java 14 |
| Maven | 3.9.11 | 项目构建管理 |
| Tomcat | 9.0.118 | 外置Tomcat部署 |
| MySQL | 8.0.33 | 数据库服务 |
| Node.js | ≥18 | 仅前端开发时需要（修改前端代码时） |

---

## 项目目录结构

```
fitness/
├── pom.xml                                    # Maven项目配置文件
├── README.md                                  # 项目说明文档
├── 启动教程.md                                 # 详细启动步骤
├── sql/
│   ├── schema.sql                             # 数据库建表脚本
│   └── data.sql                               # 测试数据脚本
├── frontend/                                  # React前端源码（Next.js 15）
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── src/
│   │   ├── app/                               # 页面路由（App Router）
│   │   ├── components/                        # UI组件
│   │   │   ├── ui/                            # Button, Input, Dialog 等
│   │   │   ├── layout/                        # Navbar, Footer, AdminShell
│   │   │   └── shared/                        # Skeleton, EmptyState 等
│   │   ├── lib/                               # api.ts, utils.ts, query-client
│   │   ├── hooks/                             # useAuth, useGuestMode, useDebounce
│   │   ├── store/                             # Zustand authStore
│   │   └── types/                             # TypeScript 类型定义
│   └── public/                                # favicon, manifest.json
└── src/
    └── main/
        ├── java/com/fitness/
        │   ├── FitnessApplication.java
        │   ├── annotation/
        │   │   └── RequiresAdmin.java
        │   ├── common/
        │   │   └── Result.java
        │   ├── config/
        │   │   └── WebConfig.java
        │   ├── controller/
        │   │   ├── IndexController.java
        │   │   ├── ExerciseController.java
        │   │   ├── TrainingRecordController.java
        │   │   ├── PlanController.java
        │   │   ├── UserController.java
        │   │   ├── BloggerController.java
        │   │   ├── StatisticsController.java
        │   │   └── admin/
        │   │       ├── AdminController.java
        │   │       ├── AdminUserController.java
        │   │       ├── AdminExerciseController.java
        │   │       ├── AdminPlanController.java
        │   │       ├── AdminBloggerController.java
        │   │       └── AdminConfigController.java
        │   ├── entity/
        │   ├── exception/
        │   ├── interceptor/
        │   ├── mapper/
        │   ├── service/
        │   └── util/
        └── resources/
            ├── application.yml
            ├── mybatis-config.xml
            ├── mapper/                         # MyBatis XML映射文件
            ├── static/                         # 前端静态资源（Next.js构建产物）
            └── templates/                      # Thymeleaf模板（已废弃，保留作参考）
```

---

## 功能说明

### 已实现功能

1. **健身动作库** — 六大分类（胸部/背部/肩部/手臂/腿部/核心），26个内置动作，支持分类筛选、关键词搜索、详情查看、视频播放

2. **个人每日训练记录** — 新增/编辑/删除/复制，动态动作明细行（组数/次数/负重），日期筛选，一键标记完成，用户数据隔离

3. **个人训练计划模板** — 创建/编辑/删除/复制计划，分组管理（新手/增肌/减脂/力量突破），一键套用生成训练清单

4. **用户账号体系** — 注册/登录/退出，BCrypt加密，角色分级（普通/管理员/超级管理员），账号状态管理

5. **游客模式** — 7天试用，每日规则弹窗，到期强制登录，权限分级（仅浏览，不可写操作）

6. **数据统计可视化** — Recharts图表（月度趋势面积图、动作频率饼图、组数次数组图），仅登录用户可见

7. **博主专区** — 博主列表、博主详情、博主训练计划展示

8. **管理员后台** — 仪表盘、用户管理（启用/禁用/重置密码/新增）、动作管理（CRUD）、计划管理、博主管理、博主计划管理、系统配置

### UI设计

- **主题**：运动奢华风暗色主题 — 鼠尾草绿 `#7d9b76` + 轻奢金 `#c9a96e` + 深炭背景
- **字体**：Anton（标题） + DM Sans（正文）
- **动效**：滚动渐现、卡片悬浮抬起、骨架屏加载、页面过渡动画
- **全站响应式**：手机/平板/PC 自适应
- **PWA**：支持添加到主屏幕

---

## 访问地址

| 页面 | 地址 | 说明 |
|------|------|------|
| 前台首页 | http://localhost:8080/fitness/ | 健身记录首页 |
| 动作库 | http://localhost:8080/fitness/exercise/ | 浏览健身动作 |
| 训练记录 | http://localhost:8080/fitness/training/ | 管理训练记录 |
| 训练计划 | http://localhost:8080/fitness/plan/ | 管理训练计划模板 |
| 数据统计 | http://localhost:8080/fitness/statistics/ | 训练数据统计图表 |
| 博主专区 | http://localhost:8080/fitness/blogger/ | 博主列表 |
| 用户登录 | http://localhost:8080/fitness/login/ | 用户登录 |
| 用户注册 | http://localhost:8080/fitness/register/ | 用户注册 |
| 管理员后台 | http://localhost:8080/fitness/admin | 后台管理仪表盘 |

### 默认管理员账号

- **用户名**：admin
- **密码**：123456

---

## 开发规范

1. **分层架构**：Controller → Service(接口+实现) → Mapper → Entity
2. **统一返回**：所有API返回 `Result` 对象，含 `code`、`message`、`data`
3. **逻辑删除**：所有表使用 `is_deleted` 字段，不做物理删除
4. **密码加密**：BCrypt加密存储用户密码
5. **防注入**：MyBatis使用 `#{}` 参数绑定，防止SQL注入

### 前端开发

```bash
cd frontend

# 安装依赖（首次）
npm install --legacy-peer-deps

# 启动开发服务器（端口 3000，API 自动代理到 8080）
npm run dev

# 构建并导出静态文件到 Spring Boot static/ 目录
npm run export
```

---

## 常见问题排查

### 1. 版本冲突问题

**现象**: 项目启动报 `NoClassDefFoundError` 或 `IncompatibleClassChangeError`

**解决**:
- 确认Java版本为14：`java -version`
- 确认Maven版本为3.9.11：`mvn -version`

### 2. 项目编译失败

```bash
mvn clean package -Dmaven.test.skip=true -U
```

### 3. 数据库连接失败

- 确认MySQL服务已启动
- 检查 `application.yml` 中的数据库连接信息
- MySQL 8.0需要配置时区：`SET GLOBAL time_zone = '+08:00';`

### 4. Tomcat启动后无法访问

- 确认war包名称为 `fitness.war`
- 检查Tomcat日志 `$TOMCAT_HOME/logs/catalina.out`
- 确认Tomcat端口未被占用：`netstat -ano | findstr 8080`

### 5. 前端页面样式异常

- 清除浏览器缓存（Ctrl+F5 强制刷新）
- 确认 `src/main/resources/static/_next/` 目录存在
- 确认 WAR 包完整部署

### 6. 开发时控制台 `params are being enumerated`

仅 `npm run dev` + Cursor 元素检查时可能出现的开发环境提示，**不影响生产构建**。处理办法与说明见 [启动教程.md — 常见问题](启动教程.md#开发时控制台出现-params-are-being-enumerated)。
