# Phase 2 Logs Endpoint
- GET /api/projects/{projectId}/logs supports pagination via ?limit&offset
- POST /api/projects/{projectId}/logs creates a new log entry
- Logs schema: id, projectId, checkpointId, action, oldScore, newScore, reason, operatedBy, operatedAt
