-- Basic schema for Project Assistant Backend (RBAC + Projects)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  real_name VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  role VARCHAR(50) NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Seed roles and an admin user for development
INSERT INTO roles (code, name) VALUES ('admin', '系统管理员'), ('tech_pm', '科技项目经理'), ('vendor_pm', '公司项目经理'), ('viewer', '只读用户');
INSERT INTO users (username, password, real_name, email, role) VALUES ('admin', 'admin', '系统管理员', 'admin@example.com', 'admin');
-- assign admin role to user 1
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_no VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  current_stage VARCHAR(100) NOT NULL,
  total_score INT DEFAULT 100,
  status VARCHAR(50) DEFAULT 'draft',
  owner_pm_id INT,
  vendor_pm_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed a sample project to enable scoring tests
INSERT INTO projects (id, project_no, name, current_stage, total_score, status) VALUES (1, 'PRJ-TEST-001', '示例项目', '需求分析', 100, 'in_progress');
INSERT INTO projects (id, project_no, name, current_stage, total_score, status) VALUES (2, 'PRJ-TEST-002', '数据治理扩展', '远程开发', 100, 'in_progress');

CREATE TABLE IF NOT EXISTS project_stages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  stage_id INT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  stage_score INT DEFAULT 0,
  max_score INT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS migrations (
  version VARCHAR(100) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  checkpoint_id INT NOT NULL,
  original_score INT NOT NULL,
  deducted_score INT DEFAULT 0,
  final_score INT NOT NULL,
  scored_by INT,
  scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS score_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  checkpoint_id INT NULL,
  score_id INT NULL,
  action VARCHAR(50) NOT NULL,
  old_score INT,
  new_score INT,
  reason TEXT,
  operated_by INT,
  operated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (score_id) REFERENCES project_scores(id)
);
