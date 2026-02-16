-- Migration: add index on score_logs_extra for faster lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_score_logs_extra_project_id_created_at ON score_logs_extra (project_id, created_at);
