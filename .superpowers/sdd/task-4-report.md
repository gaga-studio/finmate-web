# Task 4 Report: FinMate React PWA Mock Product Flow

## Changed files

- Replaced the Vite starter surface with the mobile route flow in `src/App.tsx`, `src/App.module.css`, and `src/index.css`.
- Added API generation, generated contract types, MSW browser/node handlers, and TanStack Query API hooks under `scripts/`, `src/api/`, and `src/mocks/`.
- Added React Query/MSW startup wiring, PWA configuration, and a generated MSW service worker.
- Added Vitest/Testing Library tests and a Playwright representative mobile flow test.
- Added `docs/screen-inventory.md` and the required `typecheck`, `test`, `test:e2e`, and `generate:api` scripts.

## Commands and exact results

| Command | Result |
| --- | --- |
| `npm run generate:api` | Exit 0; regenerated `src/api/openapi.snapshot.yaml` and `src/api/generated.ts` from `../finmate-api/docs/vnext/06-api/openapi.yaml`. |
| `npm run typecheck` | Exit 0. |
| `npm run lint` | Exit 0. |
| `npm run test` | Exit 0; 1 test file and 2 tests passed. |
| `npm run build` | Exit 0; Vite PWA generated `dist/sw.js` and `dist/workbox-9c191d2f.js`. |
| `npm run test:e2e` | Exit 0; 1 Playwright mobile representative-flow test passed. |
| Playwright visual check | Exit 0; reviewed signup at desktop and 393x851 mobile viewports. |

## Notes

- No design handoff branch or tag was created. The UI is a clean implementation shell pending the stated handoff.
- MSW owns all runtime mock responses; components request data only through the API/query layer.

## Review fixes

- Replaced UI-local routine replacement with typed TanStack Query mutations backed by MSW's global active routine build. Replacement uses `POST /api/v1/routine-builds/active/replacement` with `confirmReplacement: true`; the active main goal remains independent.
- Moved runtime requests to the generated OpenAPI contract base `/api/v1` and contract paths, including onboarding, home, monthly report, mate groups, adventurer routines, routine adaptations, quests, records, and demo timeline advancement.
- Resolved group, adventurer, and routine data from route parameters and removed the first-item detail selection and unsafe home-response cast.
- Rewrote Playwright coverage for signup, six-step onboarding, goal confirmation, home, monthly animal report, group, anonymous adventurer routine, adaptation candidate, explicit replacement confirmation, quest, record bottom sheet, demo advance, and goal completion.
- Added integration coverage proving an API-backed routine replacement persists on home navigation and preserves the active Europe goal, plus a non-default group route assertion.

| Command | Result |
| --- | --- |
| `npm run generate:api` | Exit 0. |
| `npm run typecheck` | Exit 0. |
| `npm run lint` | Exit 0. |
| `npm run test` | Exit 0; 1 test file and 3 tests passed. |
| `npm run build` | Exit 0; PWA service worker generated. |
| `npm run test:e2e` | Exit 0; 1 full representative mobile flow passed. |
