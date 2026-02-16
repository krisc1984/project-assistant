# 项目管理助理系统设计文档

## 1. 系统概述

### 1.1 项目背景
基于《宁波银行智能双录系统远程开发项目健康管理办法v1.4》，开发项目管理助理系统，实现项目全生命周期健康度评分管理。

### 1.2 核心目标
- 管理项目从需求分析到上线验收的5个阶段
- 记录20个检查点的健康度评分
- 支持供应商绩效考核（90+优秀、80-90良好、60-80合格、<60不合格）
- 提供评分变更历史追溯

### 1.3 技术栈
- **后端**: Node.js + TypeScript + Express
- **数据库**: MySQL 8.0
- **前端**: React 18 + TypeScript + Ant Design 5.x
- **构建**: Vite + esbuild

---

## 2. 功能模块设计

### 2.1 权限管理模块 (RBAC)

#### 角色定义
| 角色 | 权限范围 |
|------|----------|
| 系统管理员 | 用户管理、角色管理、系统配置 |
| 科技项目经理（行方） | 创建项目、评分、查看所有项目 |
| 公司项目经理（供应商） | 查看/编辑自己负责的项目、上报进度 |
| 只读用户 | 查看报表、统计数据 |

#### 权限矩阵
| 功能 | 管理员 | 科技项目经理 | 公司项目经理 | 只读 |
|------|--------|--------------|--------------|------|
| 用户管理 | ✓ | ✗ | ✗ | ✗ |
| 创建项目 | ✓ | ✓ | ✗ | ✗ |
| 编辑项目信息 | ✓ | ✓ | 仅自己的 | ✗ |
| 评分录入 | ✓ | ✓ | ✗ | ✗ |
| 查看所有项目 | ✓ | ✓ | ✗ | ✓ |
| 查看自己的项目 | ✓ | ✓ | ✓ | ✓ |
| 上报进度 | ✓ | ✓ | ✓ | ✗ |
| 生成报表 | ✓ | ✓ | ✓ | ✓ |
| 申请减免 | ✓ | ✓ | ✓ | ✗ |

### 2.2 项目管理模块

#### 项目生命周期
```
需求分析 → 远程开发 → 交付实施 → 项目测试 → 上线验收
  (10分)    (15分)     (15分)     (30分)     (30分)
```

#### 项目状态流转
- **草稿**: 刚创建，未启动
- **进行中**: 需求分析阶段开始
- **暂停**: 因特殊原因暂停
- **已完成**: 上线验收完成
- **已结项**: 最终评分确认

#### 核心字段
- 项目编号（唯一）
- 项目名称
- 业务类型（智能双录/其他）
- 科技项目经理（行方）
- 公司项目经理（供应商）
- 当前阶段
- 项目状态
- 总健康度分数
- 供应商评级
- 创建时间/更新时间

### 2.3 健康度评分模块

#### 评分标准（硬编码 v1.4）

**阶段1: 需求分析 (满分10分)**
| 检查点 | 扣分规则 |
|--------|----------|
| 意向反馈 | 反馈延期：每工作日扣1分 |
| 排期反馈 | 计划延期：每工作日扣1分 |
| 需求反讲 | 未执行扣5分；未一周内完成每工作日扣1分 |
| 需求质量 | 需求反复≥2次，每增加1次扣1分 |

**阶段2: 远程开发 (满分15分)**
| 检查点 | 扣分规则 |
|--------|----------|
| 设计评审 | 未按期执行扣5分 |
| 设计交付 | 未交付扣5分；每延期1工作日扣1分 |
| 项目周报 | 每延期1次扣1分 |
| 代码评审 | 未按期执行扣5分 |

**阶段3: 交付实施 (满分15分)**
| 检查点 | 扣分规则 |
|--------|----------|
| 整体交付 | 每延期1工作日扣1分 |
| 实施效率 | 功能需求/开发任务每延期1工作日扣1分 |
| 实施质量 | 每个不符合项扣1分 |
| 初步验收 | 实现与设计不符每问题扣2分；正案例未通过扣3分；退回远程开发扣5分 |

**阶段4: 项目测试 (满分30分)**
| 检查点 | 扣分规则 |
|--------|----------|
| 案例密度 | 每功能点1正2反 |
| 案例抽查 | 通过案例未通过每个扣2分 |
| 缺陷密度 | 超过1时，每上升1点扣3分 |
| 缺陷时效 | 高等级当日未查明扣2分；T1未完成每工作日扣1分；中等级T3未完成每工作日扣1分 |

**阶段5: 上线验收 (满分30分)**
| 检查点 | 扣分规则 |
|--------|----------|
| 上线方案 | 未完成扣3分 |
| 上线评审 | 未完成扣1分；未提供报告扣3分 |
| 上线支持 | 人员不在现场扣3分；无法联系扣3分 |
| 运维情况 | 生产缺陷每个扣5分；补丁每个扣10分；8级故障每个扣5分，每升一级翻倍 |

#### 评分模式
- **自动计算**: 延期天数、缺陷数等量化指标
- **手动录入**: 需求质量、设计评审等主观评价
- **混合模式**: 系统自动建议分数，项目经理确认/调整

### 2.4 评分变更日志模块

#### 记录内容
- 变更时间
- 变更人
- 检查点
- 原分数
- 新分数
- 变更原因
- 审核状态（普通变更/已申请减免/已批准）

#### 减免申请流程
1. 公司项目经理提交减免申请
2. 研发经理职级以上人员审批
3. 行方总经理室确认
4. 系统记录减免结果

### 2.5 报表统计模块

#### 项目级报表
- 项目健康度明细表
- 阶段得分对比图
- 检查点扣分清单
- 评分变更历史

#### 供应商级报表
- 供应商项目列表
- 平均健康度趋势
- 评级分布统计
- 常见问题分析

#### 系统级报表
- 项目状态分布
- 阶段完成率
- 平均交付周期
- 缺陷密度趋势

---

## 3. 数据库设计

### 3.1 实体关系图

```
users (用户表)
├── roles (角色表) N:1
├── user_roles (用户角色关联表) N:M
└── projects (项目表) 1:N

projects (项目表)
├── project_stages (项目阶段表) 1:N
├── project_scores (项目评分表) 1:N
├── score_logs (评分日志表) 1:N
└── users (用户表) N:1 (科技项目经理)
└── users (用户表) N:1 (公司项目经理)

stages (阶段定义表)
└── checkpoints (检查点定义表) 1:N

roles (角色表)
└── permissions (权限表) 1:N
```

### 3.2 表结构

#### users (用户表)
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  real_name VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  department VARCHAR(100),
  status TINYINT DEFAULT 1 COMMENT '0禁用 1启用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### roles (角色表)
```sql
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL COMMENT '角色名',
  code VARCHAR(50) UNIQUE NOT NULL COMMENT '角色编码',
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### user_roles (用户角色关联表)
```sql
CREATE TABLE user_roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  UNIQUE KEY uk_user_role (user_id, role_id)
);
```

#### permissions (权限表)
```sql
CREATE TABLE permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  code VARCHAR(100) UNIQUE NOT NULL COMMENT '权限编码',
  resource VARCHAR(50) NOT NULL COMMENT '资源',
  action VARCHAR(50) NOT NULL COMMENT '操作',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### role_permissions (角色权限关联表)
```sql
CREATE TABLE role_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id),
  UNIQUE KEY uk_role_permission (role_id, permission_id)
);
```

#### stages (阶段定义表)
```sql
CREATE TABLE stages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL COMMENT '阶段名称',
  code VARCHAR(50) UNIQUE NOT NULL COMMENT '阶段编码',
  max_score INT NOT NULL COMMENT '阶段满分',
  sort_order INT NOT NULL COMMENT '排序',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO stages VALUES
(1, '需求分析', 'requirement', 10, 1),
(2, '远程开发', 'development', 15, 2),
(3, '交付实施', 'delivery', 15, 3),
(4, '项目测试', 'testing', 30, 4),
(5, '上线验收', 'acceptance', 30, 5);
```

#### checkpoints (检查点定义表)
```sql
CREATE TABLE checkpoints (
  id INT PRIMARY KEY AUTO_INCREMENT,
  stage_id INT NOT NULL,
  name VARCHAR(100) NOT NULL COMMENT '检查点名称',
  code VARCHAR(50) NOT NULL COMMENT '检查点编码',
  scoring_type ENUM('auto', 'manual', 'mixed') NOT NULL COMMENT '评分类型',
  scoring_rules JSON NOT NULL COMMENT '评分规则JSON',
  description TEXT COMMENT '说明',
  sort_order INT NOT NULL,
  FOREIGN KEY (stage_id) REFERENCES stages(id)
);

-- 示例数据 (需求分析阶段)
INSERT INTO checkpoints (stage_id, name, code, scoring_type, scoring_rules, description, sort_order) VALUES
(1, '意向反馈', 'intent_feedback', 'auto', 
 '{"delay_penalty": 1, "max_penalty": 10}', 
 '反馈时间每延期1个工作日扣1分', 1),
(1, '排期反馈', 'schedule_feedback', 'auto', 
 '{"delay_penalty": 1, "max_penalty": 10}', 
 '交付计划给出时间每延期1个工作日扣1分', 2),
(1, '需求反讲', 'requirement_review', 'mixed', 
 '{"miss_penalty": 5, "delay_penalty": 1, "max_delay": 7}', 
 '未执行扣5分，未在一周内完成每工作日扣1分', 3),
(1, '需求质量', 'requirement_quality', 'manual', 
 '{"iteration_penalty": 1, "min_iterations": 2}', 
 '需求反复2次及以上，每增加一次扣1分', 4);
```

#### projects (项目表)
```sql
CREATE TABLE projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_no VARCHAR(50) UNIQUE NOT NULL COMMENT '项目编号',
  name VARCHAR(200) NOT NULL COMMENT '项目名称',
  business_type VARCHAR(50) DEFAULT '智能双录' COMMENT '业务类型',
  description TEXT COMMENT '项目描述',
  
  bank_pm_id INT COMMENT '科技项目经理ID',
  company_pm_id INT COMMENT '公司项目经理ID',
  company_name VARCHAR(100) COMMENT '供应商公司名',
  
  current_stage_id INT COMMENT '当前阶段ID',
  status ENUM('draft', 'in_progress', 'paused', 'completed', 'closed') DEFAULT 'draft',
  
  total_score INT DEFAULT 100 COMMENT '总健康度分数',
  final_grade VARCHAR(20) GENERATED ALWAYS AS (
    CASE 
      WHEN total_score >= 90 THEN '优秀'
      WHEN total_score >= 80 THEN '良好'
      WHEN total_score >= 60 THEN '合格'
      ELSE '不合格'
    END
  ) STORED COMMENT '最终评级',
  
  start_date DATE COMMENT '项目启动日期',
  planned_end_date DATE COMMENT '计划结束日期',
  actual_end_date DATE COMMENT '实际结束日期',
  
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (bank_pm_id) REFERENCES users(id),
  FOREIGN KEY (company_pm_id) REFERENCES users(id),
  FOREIGN KEY (current_stage_id) REFERENCES stages(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

#### project_stages (项目阶段表)
```sql
CREATE TABLE project_stages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  stage_id INT NOT NULL,
  status ENUM('pending', 'in_progress', 'completed', 'skipped') DEFAULT 'pending',
  stage_score INT DEFAULT 0 COMMENT '阶段得分',
  max_score INT NOT NULL COMMENT '阶段满分',
  
  planned_start_date DATE,
  actual_start_date DATE,
  planned_end_date DATE,
  actual_end_date DATE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (stage_id) REFERENCES stages(id),
  UNIQUE KEY uk_project_stage (project_id, stage_id)
);
```

#### project_scores (项目评分表)
```sql
CREATE TABLE project_scores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  project_stage_id INT NOT NULL,
  checkpoint_id INT NOT NULL,
  
  original_score INT NOT NULL COMMENT '原满分',
  deducted_score INT DEFAULT 0 COMMENT '已扣分数',
  final_score INT NOT NULL COMMENT '最终得分',
  
  score_type ENUM('auto', 'manual') NOT NULL,
  deduct_reason TEXT COMMENT '扣分原因',
  
  auto_data JSON COMMENT '自动计算数据',
  -- 例如: {"delay_days": 3, "defect_count": 5}
  
  scored_by INT NOT NULL,
  scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (project_stage_id) REFERENCES project_stages(id) ON DELETE CASCADE,
  FOREIGN KEY (checkpoint_id) REFERENCES checkpoints(id),
  FOREIGN KEY (scored_by) REFERENCES users(id),
  UNIQUE KEY uk_project_checkpoint (project_id, checkpoint_id)
);
```

#### score_logs (评分日志表)
```sql
CREATE TABLE score_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  checkpoint_id INT NOT NULL,
  project_score_id INT NOT NULL,
  
  action_type ENUM('create', 'update', 'delete', 'reduce') NOT NULL COMMENT '操作类型',
  old_score INT COMMENT '原分数',
  new_score INT NOT NULL COMMENT '新分数',
  change_reason TEXT NOT NULL COMMENT '变更原因',
  
  operator_id INT NOT NULL COMMENT '操作人',
  operator_role VARCHAR(50) COMMENT '操作人角色',
  operated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  approval_status ENUM('pending', 'approved', 'rejected') DEFAULT NULL COMMENT '减免审批状态',
  approved_by INT COMMENT '审批人',
  approved_at TIMESTAMP NULL,
  
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (checkpoint_id) REFERENCES checkpoints(id),
  FOREIGN KEY (project_score_id) REFERENCES project_scores(id) ON DELETE CASCADE,
  FOREIGN KEY (operator_id) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);
```

#### project_activities (项目活动表)
```sql
CREATE TABLE project_activities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  activity_type VARCHAR(50) NOT NULL COMMENT '活动类型',
  title VARCHAR(200) NOT NULL,
  content TEXT,
  operator_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (operator_id) REFERENCES users(id)
);
```

---

## 4. API设计

### 4.1 认证模块
```
POST /api/auth/login          # 登录
POST /api/auth/logout         # 登出
GET  /api/auth/profile        # 获取当前用户信息
PUT  /api/auth/password       # 修改密码
```

### 4.2 用户管理模块
```
GET    /api/users             # 用户列表
POST   /api/users             # 创建用户
GET    /api/users/:id         # 用户详情
PUT    /api/users/:id         # 更新用户
DELETE /api/users/:id         # 删除用户
GET    /api/users/:id/roles   # 获取用户角色
PUT    /api/users/:id/roles   # 更新用户角色
```

### 4.3 角色权限模块
```
GET    /api/roles             # 角色列表
POST   /api/roles             # 创建角色
GET    /api/roles/:id         # 角色详情
PUT    /api/roles/:id         # 更新角色
DELETE /api/roles/:id         # 删除角色
GET    /api/permissions       # 权限列表
```

### 4.4 项目管理模块
```
GET    /api/projects              # 项目列表（支持筛选）
POST   /api/projects              # 创建项目
GET    /api/projects/:id          # 项目详情
PUT    /api/projects/:id          # 更新项目
DELETE /api/projects/:id          # 删除项目
POST   /api/projects/:id/start    # 启动项目
POST   /api/projects/:id/complete # 完成项目
POST   /api/projects/:id/close    # 结项
```

### 4.5 项目阶段模块
```
GET    /api/projects/:id/stages           # 获取项目所有阶段
PUT    /api/projects/:id/stages/:stageId  # 更新阶段信息
POST   /api/projects/:id/stages/:stageId/start    # 开始阶段
POST   /api/projects/:id/stages/:stageId/complete # 完成阶段
```

### 4.6 健康度评分模块
```
GET  /api/projects/:id/scores                    # 获取项目所有评分
GET  /api/projects/:id/scores/:checkpointId      # 获取单个检查点评分
POST /api/projects/:id/scores                    # 创建评分
PUT  /api/projects/:id/scores/:checkpointId      # 更新评分

# 自动计算建议分数
POST /api/projects/:id/scores/:checkpointId/calculate  
```

### 4.7 评分日志模块
```
GET  /api/projects/:id/score-logs          # 项目评分日志
POST /api/score-logs/:logId/apply-reduce   # 申请减免
PUT  /api/score-logs/:logId/approve        # 审批减免
```

### 4.8 报表模块
```
GET /api/reports/projects/:id/health      # 项目健康度报告
GET /api/reports/supplier/:userId         # 供应商报表
GET /api/reports/dashboard                # 仪表盘数据
GET /api/reports/statistics               # 统计报表
```

---

## 5. 前端设计

### 5.1 页面结构

#### 布局
- **侧边栏**: 导航菜单
- **顶部栏**: 用户信息、面包屑
- **内容区**: 动态路由页面

#### 路由设计
```
/                     # 仪表盘
/projects             # 项目列表
/projects/new         # 新建项目
/projects/:id         # 项目详情
/projects/:id/scores  # 健康度评分
/reports              # 报表中心
/users                # 用户管理
/roles                # 角色管理
/settings             # 系统设置
```

### 5.2 核心页面

#### 仪表盘
- 项目状态分布图
- 近期待评分项目
- 供应商评级概览
- 快捷入口

#### 项目列表
- 表格展示：项目编号、名称、当前阶段、健康度分数、状态
- 筛选：阶段、状态、供应商、日期范围
- 操作：查看、编辑、评分

#### 项目详情
- 项目基本信息
- 5个阶段进度条
- 当前阶段检查点列表
- 评分历史
- 变更日志

#### 健康度评分页
- 5个Tab对应5个阶段
- 每个检查点卡片：
  - 检查点名称和说明
  - 自动计算输入区（延期天数、缺陷数等）
  - 分数展示（原分-扣分=最终分）
  - 扣分原因输入
  - 提交按钮

#### 报表中心
- 项目健康度报告（可导出PDF）
- 供应商绩效对比
- 趋势分析图表

### 5.3 组件设计

#### 通用组件
- `ProjectStatusTag` - 项目状态标签
- `ScoreBadge` - 健康度分数徽章（颜色根据分数变化）
- `StageProgress` - 阶段进度条
- `ScoreLogTimeline` - 评分变更时间线

#### 业务组件
- `ScoreCalculator` - 自动评分计算器
- `CheckpointCard` - 检查点评分卡片
- `ProjectForm` - 项目表单
- `ScoreReport` - 评分报告

---

## 6. 部署方案

### 6.1 目录结构
```
project-assistant/
├── backend/                 # 后端代码
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   ├── controllers/    # 控制器
│   │   ├── database/       # 数据库连接和迁移
│   │   ├── middleware/     # 中间件
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   ├── services/       # 业务逻辑
│   │   ├── types/          # TypeScript类型
│   │   ├── utils/          # 工具函数
│   │   └── app.ts          # 应用入口
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # 前端代码
│   ├── src/
│   │   ├── api/            # API请求
│   │   ├── components/     # 组件
│   │   ├── pages/          # 页面
│   │   ├── stores/         # 状态管理
│   │   ├── types/          # TypeScript类型
│   │   ├── utils/          # 工具函数
│   │   └── main.tsx        # 入口
│   ├── package.json
│   └── vite.config.ts
├── database/               # 数据库脚本
│   ├── init.sql           # 初始化脚本
│   └── migrations/        # 迁移脚本
├── docker-compose.yml      # Docker编排
└── README.md
```

### 6.2 Docker部署
```yaml
# docker-compose.yml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: project_assistant
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
  
  backend:
    build: ./backend
    environment:
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: rootpass
      DB_NAME: project_assistant
      JWT_SECRET: your-secret-key
    ports:
      - "3000:3000"
    depends_on:
      - mysql
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

### 6.3 环境变量
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=project_assistant

# 应用配置
PORT=3000
NODE_ENV=development

# JWT配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# 日志配置
LOG_LEVEL=info
```

---

## 7. 开发计划

### Phase 1: 基础架构 (2天)
- [ ] 项目初始化 (TypeScript + Express + React)
- [ ] 数据库设计与初始化脚本
- [ ] Docker环境搭建

### Phase 2: 后端开发 (5天)
- [ ] 用户认证与授权
- [ ] 用户管理API
- [ ] 角色权限API
- [ ] 项目管理API
- [ ] 健康度评分核心逻辑
- [ ] 报表统计API

### Phase 3: 前端开发 (5天)
- [ ] 基础布局和路由
- [ ] 登录页面
- [ ] 项目列表和详情
- [ ] 健康度评分页面
- [ ] 报表中心
- [ ] 用户和权限管理

### Phase 4: 测试与优化 (3天)
- [ ] 单元测试
- [ ] 集成测试
- [ ] 性能优化
- [ ] 文档完善

---

## 8. 关键业务逻辑

### 8.1 自动评分算法

```typescript
// 意向反馈评分计算
function calculateIntentFeedbackScore(delayDays: number): number {
  const penalty = delayDays * 1; // 每延期1天扣1分
  return Math.max(0, 10 - penalty);
}

// 缺陷密度评分计算
function calculateDefectDensityScore(defectDensity: number): number {
  if (defectDensity <= 1) return 30; // 满分
  const penalty = Math.ceil(defectDensity - 1) * 3;
  return Math.max(0, 30 - penalty);
}

// 更新项目总分
async function updateProjectTotalScore(projectId: number): Promise<void> {
  const scores = await getProjectScores(projectId);
  const totalScore = scores.reduce((sum, s) => sum + s.final_score, 0);
  await updateProject(projectId, { total_score: totalScore });
}
```

### 8.2 权限检查中间件

```typescript
// 检查用户是否有指定权限
function checkPermission(permissionCode: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const hasPermission = await userService.checkPermission(userId, permissionCode);
    if (!hasPermission) {
      return res.status(403).json({ message: '无权访问' });
    }
    next();
  };
}
```

---

## 9. 安全考虑

1. **密码加密**: bcrypt存储密码
2. **JWT认证**: 无状态身份验证
3. **SQL注入防护**: 使用参数化查询
4. **XSS防护**: 输入验证和输出转义
5. **CSRF防护**: 前端使用SameSite Cookie
6. **权限控制**: 后端每个API验证权限
7. **操作日志**: 记录敏感操作

---

## 10. 附录

### 10.1 缺陷等级定义（来自管理办法）
- **高等级**: 阻碍主流程、主要功能未实现、资金相关
- **中等级**: 不影响主流程但影响其他功能、功能未实现但不影响流程
- **低等级**: 仅影响体验、展示问题

### 10.2 评分标准版本
- 当前版本: v1.4
- 生效日期: 2024-03-26
- 下次评审: 待定

---

**文档版本**: 1.0  
**创建日期**: 2026-02-16  
**作者**: AI Assistant
