Phase 2 CI / Test Environment Setup

- Docker-Compose: postgres service configured for tests
- Migration runner should run before tests in CI
- Environment variables: DATABASE_URL, PGHOST, PGUSER, PGPASSWORD, PGDATABASE
- Notes on rollback and clean-up for CI
- Local Development with Postgres (via Docker Compose)
- Run: docker-compose up -d
- After DB is ready, run migrations and tests via the CI runner:
- ./backend/scripts/ci-runner.sh
- Or run a local test command sequence that matches the CI flow
- Start a local Postgres instance (e.g., using Docker):
- Ensure the database named 'aibot' exists with user/password as configured in DATABASE_URL
- Run migrations and tests via the CI runner script:
- ./backend/scripts/ci-runner.sh
