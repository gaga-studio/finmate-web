# Task 5 Report: Real API Integration

## Status

Completed in `/Users/sungjh/Projects/finmate-web` on `codex/bootstrap-vnext`.

## Delivered

- Regenerated `src/api/generated.ts` and `src/api/openapi.snapshot.yaml` from the final API OpenAPI document.
- Added one shared API layer for mock and real modes. `VITE_USE_MOCKS=true` starts MSW; real mode uses `VITE_API_BASE_URL` with `/api/v1` appended once.
- Added in-memory access-session handling with `sessionStorage` restoration, bearer headers for protected calls, cookie credentials, one refresh-and-retry on 401, and local logout cleanup. Refresh tokens are never stored in JavaScript.
- Updated signup/login validation and payloads for display name plus UTF-8 byte password limits.
- Persisted six-step onboarding choices locally and changed goal confirmation to an editable Europe-travel draft, independent of an incomplete server onboarding view.
- Wired the real quest-completion, record range/day, mate/routine, and demo APIs through the same query layer used by mocks.
- Made the demo completion sequence issue valid expected stages `0`, `1`, and `2`, refetch home and raid projections, and show goal completion at terminal raid stage `3`.
- Preserved the mock representative flow and added a separate live API Playwright flow plus `npm run test:e2e:api`, which starts PostgreSQL and the API `demo` profile with mocks disabled.

## Verification

All commands passed:

```text
npm test
# 2 files, 9 tests passed

npm run typecheck
npm run lint
npm run build

npm run test:e2e
# 1 mock Playwright test passed

npm run test:e2e:api
# 1 actual-API Playwright test passed against PostgreSQL and demo-profile API
```
