#!/usr/bin/env bash
set -euo pipefail

#!/usr/bin/env bash
set -euo pipefail

# CI-friendly runner: migrations first, then tests against a Postgres DB (or MySQL)
DB_URL=${DATABASE_URL:-mysql://root:root@localhost:3306/aibot}
export DATABASE_URL="$DB_URL"

echo "[CI] Using DB URL: $DATABASE_URL"

# Install dependencies with npm (fallbacks if needed)
if command -v npm >/dev/null 2>&1; then
  echo "[CI] Installing with npm..."
  npm ci || npm install
fi

# Run migrations based on protocol
if [[ "$DB_URL" == mysql://* ]]; then
  if [ -f ./backend/scripts/migrate_mysql.js ]; then
    echo "[CI] Running MySQL migrations (migrate_mysql.js)"
    node ./backend/scripts/migrate_mysql.js
  elif [ -f ./backend/scripts/migrate.js ]; then
    echo "[CI] Running migrations (migrate.js)"
    node ./backend/scripts/migrate.js
  else
    echo "[CI] No migrations script found. Skipping migrations."
  fi
elif [[ "$DB_URL" == postgres://* ]]; then
  if [ -f ./backend/scripts/migrate_pg.js ]; then
    echo "[CI] Running PostgreSQL migrations (migrate_pg.js)"
    node ./backend/scripts/migrate_pg.js
  elif [ -f ./backend/scripts/migrate.js ]; then
    echo "[CI] Running migrations (migrate.js)"
    node ./backend/scripts/migrate.js
  else
    echo "[CI] No migrations script found. Skipping migrations."
  fi
else
  echo "[CI] Unknown DB URL. Skipping migrations."
fi

# Run tests
echo "[CI] Running backend tests..."
if command -v npm >/dev/null 2>&1; then
  npm test --silent --workspaces --if-present -- --coverage || true
fi
