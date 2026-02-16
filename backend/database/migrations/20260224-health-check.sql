-- Health check migration placeholder to ensure runner processes multiple migrations in order
CREATE INDEX IF NOT EXISTS idx_health_dummy ON project_scores (project_id);
