CREATE INDEX IF NOT EXISTS idx_score_logs_project_checkpoint_action ON score_logs (project_id, checkpoint_id, action);
