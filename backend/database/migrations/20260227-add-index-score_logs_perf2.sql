-- Migration: add secondary index for perf lookups on score_logs_perf2
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_score_logs_perf2_project_time ON score_logs_perf2 (project_id, logged_at);
