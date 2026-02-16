Phase 2 Logs - Enhanced Endpoint Overview

- GET /api/projects/{projectId}/logs
  - Features: pagination (limit, offset), filters (checkpointId, action, from, to)
  - Expected behavior: returns logs for the given project, honoring filters and pagination
  - Validation: projectId must exist; invalid parameters return 400/422; not found returns 404

- POST /api/projects/{projectId}/logs
  - Fields: checkpointId (required), action, oldScore, newScore, reason
  - Operation: writes a log entry with operated_by from the current user
  - Validation: checkpointId required; scores optional but at least one score must be provided

- Testing plan
  - 2b: tests for filtering combinations, pagination edge cases, and write path
- Testing plan
  - 2b: tests for filtering combinations, pagination, and write path
  - 2c: migrations runner dry-run and apply path
