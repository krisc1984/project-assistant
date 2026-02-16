-- Seed additional data for Phase 2 testing
INSERT INTO users (id, username, password, real_name, email, role) VALUES (2, 'vendor_user', 'vendor', '供应商用户', 'vendor@example.com', 'vendor_pm') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO projects (id, project_no, name, current_stage, total_score, status) VALUES (2, 'PRJ-TEST-002', '数据治理扩展', '远程开发', 92, 'in_progress') ON DUPLICATE KEY UPDATE id=id;
