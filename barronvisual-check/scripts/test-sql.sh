#!/usr/bin/env bash
# Prueba la migración en un PostgreSQL local temporal (sin Supabase).
# Uso: npm run test:sql   (necesita los binarios de PostgreSQL 15+ instalados)
set -euo pipefail

HERE="$(cd "$(dirname "$0")/.." && pwd)"
PGBIN="${PGBIN:-$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1)}"
TMP="$(mktemp -d)"
PORT="${PGPORT_TEST:-54329}"
RUN=()
if [ "$(id -u)" = "0" ]; then
  chown postgres "$TMP"
  RUN=(runuser -u postgres --)
fi

cleanup() { "${RUN[@]}" "$PGBIN/pg_ctl" -D "$TMP/data" -m fast stop >/dev/null 2>&1 || true; rm -rf "$TMP"; }
trap cleanup EXIT

"${RUN[@]}" "$PGBIN/initdb" -D "$TMP/data" -U postgres -A trust >/dev/null
"${RUN[@]}" "$PGBIN/pg_ctl" -D "$TMP/data" -o "-p $PORT -k $TMP -c listen_addresses=''" -l "$TMP/log" -w start >/dev/null

PSQL=(psql -h "$TMP" -p "$PORT" -U postgres -d postgres -v ON_ERROR_STOP=1 -q)
"${PSQL[@]}" -f "$HERE/supabase/tests/supabase_stubs.sql"
for f in "$HERE"/supabase/migrations/*.sql; do
  echo "→ $(basename "$f")"
  "${PSQL[@]}" -f "$f"
  echo "→ $(basename "$f") (segunda vez, comprueba que es idempotente)"
  "${PSQL[@]}" -f "$f"
done
"${PSQL[@]}" -f "$HERE/supabase/tests/assertions.sql"
echo "Todas las pruebas SQL pasan."
