-- Seed admin user and a sample project if not exists
INSERT IGNORE INTO roles (code, name) VALUES ('admin', '系统管理员');
INSERT IGNORE INTO users (id, username, password, real_name, email, role) VALUES (1, 'admin', 'admin', '系统管理员', 'admin@example.com', 'admin');
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (1, 1);
INSERT IGNORE INTO projects (project_no, name, current_stage, total_score, status) VALUES ('PRJ-TEST-001', '示例项目', '需求分析', 100, 'in_progress');
