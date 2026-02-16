Migration Runner Guide
- Purpose: Apply database migrations in a controlled, idempotent way.
- How to run:
 1) Ensure you have a local DB and .env with DB_HOST/DB_NAME/DB_USER/DB_PASSWORD
 2) Run npm run migrate
- Behavior:
  - Migrations are tracked in migrations table.
  - If a migration version already applied, it is skipped.
  - On failure, process stops and outputs error.
- Notes:
  - This is a minimal custom runner for Phase 2; consider upgrading to a dedicated migration tool later.
