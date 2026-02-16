Phase 2 Plan: 后端全面落地（自定义迁移、完整 API、测试、模板输出）

- Migration Runner
- 使用 backend/scripts/migrate.js 结合 migrations 目录进行自定义迁移
- 运行：node ./backend/scripts/migrate.js，或通过 npm run migrate 在根目录执行

- 目标：在后端实现 API 全量持久化、可重复迁移、可导出模板，且具备完整测试覆盖。
- 里程碑：
 1) Health Score API 完整 DB 持久化（GET/POST/PUT /api/projects/:id/scores）
 2) 评分日志与变更接口落地，简化审批流程（单向变更记录）
 3) 自定义迁移 runner：顺序执行 migrations 目录 SQL
 4) 测试覆盖：API 端到端测试、日志测试
 5) 报表模板输出与模板列表接口（CSV/PDF）
 6) 文档与运行指南更新

- 交付物：数据库迁移脚本集合、迁移 runner、测试用例、端点实现、模板导出接口、文档更新。
- 2b 日志端点增强：支持分页、过滤、字段校验，输出稳定错误信息
- 2c Migrations runner 增强：幂等性、回滚模板、跨环境一致性
- 2d 测试覆盖：scores/logs/projects 的集成测试扩展
- 2e Reports 模板导出：扩展模板类型与导出格式（Excel/CSV/PDF）
- 2f 文档更新：API 规范、部署与迁移指南、错误码表
