#!/usr/bin/env bash
set -euo pipefail

web_root="$(cd "$(dirname "$0")/.." && pwd)"
api_root="$(cd "$web_root/../finmate-api" && pwd)"
api_log="$(mktemp)"
api_pid=""

cleanup() {
  if [[ -n "$api_pid" ]]; then kill "$api_pid" 2>/dev/null || true; fi
  rm -f "$api_log"
}
trap cleanup EXIT

npm run generate:api
git diff --exit-code -- src/api/generated.ts src/api/openapi.snapshot.yaml

(
  cd "$api_root"
  docker compose up -d postgres
)

(
  cd "$api_root"
  SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/finmate \
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
