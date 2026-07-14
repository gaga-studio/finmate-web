#!/usr/bin/env bash
set -euo pipefail

web_root="$(cd "$(dirname "$0")/.." && pwd)"
api_root="${FINMATE_API_ROOT:-$web_root/../finmate-api}"
api_root="$(cd "$api_root" && pwd)"
compose_project="${FINMATE_COMPOSE_PROJECT:-finmate-api}"
api_log="$(mktemp)"
api_pid=""
e2e_db="finmate_e2e_$$"
e2e_db_created="false"

cleanup() {
  if [[ -n "$api_pid" ]]; then kill "$api_pid" 2>/dev/null || true; fi
  if [[ "$e2e_db_created" == "true" ]]; then
    (
      cd "$api_root"
      docker compose -p "$compose_project" exec -T postgres dropdb --if-exists --force -U finmate "$e2e_db"
    ) >/dev/null 2>&1 || true
  fi
  rm -f "$api_log"
}
trap cleanup EXIT

npm run generate:api
git diff --exit-code -- src/api/generated.ts src/api/openapi.snapshot.yaml

(
  cd "$api_root"
  docker compose -p "$compose_project" up -d postgres
  for _ in {1..30}; do
    if docker compose -p "$compose_project" exec -T postgres pg_isready -U finmate -d finmate >/dev/null 2>&1; then
      docker compose -p "$compose_project" exec -T postgres createdb -U finmate "$e2e_db"
      exit 0
    fi
    sleep 1
  done
  exit 1
)
e2e_db_created="true"

(
  cd "$api_root"
  SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/$e2e_db" \
  SPRING_DATASOURCE_USERNAME=finmate \
  SPRING_DATASOURCE_PASSWORD=finmate \
  FINMATE_JWT_SECRET=finmate-demo-jwt-secret-at-least-32-characters \
  FINMATE_APP_ORIGIN=http://127.0.0.1:4174 \
  SERVER_PORT=18080 \
  SPRING_PROFILES_ACTIVE=demo \
  ./gradlew bootRun >"$api_log" 2>&1
) &
api_pid=$!

for _ in {1..90}; do
  if curl --fail --silent http://127.0.0.1:18080/actuator/health >/dev/null; then
    cd "$web_root"
    npx playwright test --config playwright.actual.config.ts
    exit 0
  fi
  sleep 1
done

cat "$api_log" >&2
exit 1
