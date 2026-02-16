-- Migration: create report_templates catalog for predefined templates
CREATE TABLE IF NOT EXISTS report_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  template_type VARCHAR(50) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO report_templates (name, template_type, content) VALUES
('Health Score CSV Template', 'csv', 'checkpoint,score,max\\n'),
('Health Report PDF Template', 'pdf', 'Health Report Template');
