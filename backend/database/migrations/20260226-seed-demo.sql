-- Seed demo data for health score workflows
INSERT INTO health_projects_demo (name, created_at) VALUES ('Demo Project A', NOW()) ON CONFLICT DO NOTHING;
