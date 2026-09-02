#!/bin/bash
set -euo pipefail

pnpm install --frozen-lockfile

# The UI shell does not require a database. Keep post-merge setup useful for
# database-enabled environments without making every AI/code-agent merge fail
# when DATABASE_URL is intentionally absent.
if [[ -n "${DATABASE_URL:-}" ]]; then
  pnpm --filter @workspace/db run push
else
  echo "Skipping database schema push: DATABASE_URL is not configured."
fi
