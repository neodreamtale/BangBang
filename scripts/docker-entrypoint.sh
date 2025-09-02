#!/bin/sh
set -e

# If DATABASE_URL is set and prisma exists, try to run migrations on startup.
if [ -n "$DATABASE_URL" ] && [ -f /app/prisma/schema.prisma ]; then
  echo "DATABASE_URL found and prisma schema exists — running prisma migrate deploy"
  if command -v npx >/dev/null 2>&1; then
    npx prisma migrate deploy || echo "prisma migrate deploy failed"
  else
    echo "npx not found, skipping prisma migrate deploy"
  fi
else
  echo "No DATABASE_URL or prisma schema, skipping migrations"
fi

# Exec the container command (from CMD)
exec "$@"
