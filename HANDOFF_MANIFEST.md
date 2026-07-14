# Frontend Design Handoff Manifest

## Source

- Received at: `2026-07-14`
- Source type: `Git`
- Original repository: `https://github.com/gaga-studio/finmate-frontend-v2.git`
- Original commit SHA: `e7faff88b7469f742e5661b58306365cec391b65`
- Original commit timestamp: `2026-07-14T09:02:15+09:00`
- Frozen branch: `design-handoff/2026-07-14`
- Frozen tag: `design-handoff-2026-07-14`
- Frozen tree SHA: `28d6a65653b05ce773793b7e8d5d60492f1f5b45`
- Tracked source size: `53.7 MB`

## Runtime

- Node.js: `v22.22.0`
- npm: `10.9.4`
- App directory: `frontend/`
- Install command: `npm ci`
- Development command: `npm run dev`
- Build command: `npm run build`
- Required environment variables:
  - `VITE_API_BASE_URL` (legacy default: `http://localhost:8080`)
  - `VITE_DUMMY_MODE` (legacy default: `true`)
- Successful locally: `yes`
- Dependency audit: `123 packages`, `0 known vulnerabilities` at handoff audit time
- Lint: exit `0`, with 33 `react(only-export-components)` warnings
- Build: exit `0`
- Build warning: main JavaScript chunk `538.39 kB` (`149.72 kB` gzip), above Vite's 500 kB warning threshold

The delivered E2E was not executed against vNext. It calls legacy reset/import endpoints
and asserts birthday-fund, comparison, profile, and five-tab behavior. Running it against
the current API could mutate the wrong fixture and would not validate the approved product.

## Design Sources

- Figma: not provided
- Interaction recording: not provided
- Source screenshots: `UI_이미지/*.png`
- Fonts: Paperlogy WOFF2 files provided; license notice not provided
- Image assets: 3D character, RPG icon, battle background, record background files provided; ownership/license notice not provided
- Supported viewports: not documented by source
- Native wrapper: Capacitor iOS project included, but PWA is the approved MVP platform

Font and asset license/ownership confirmation remains a release blocker. Internal evaluation
may use the supplied files; production distribution requires a written source or license record.

## Screen Audit

| Delivered area | Source evidence | Status | Decision | Notes |
| --- | --- | --- | --- | --- |
| Authentication | `AuthPage.tsx` | partial | `REBUILD` | legacy API/session and prefilled demo password |
| Onboarding | `OnboardingPage.tsx` | partial | `REBUILD` | approved six-step content and goal timing differ |
| Home battle | `HomeBattleScene.tsx`, `home.css` | complete visual | `REFINE` | remove time-driven combat, currency recharge, reward chest, and overspending boss semantics |
| Character report | `HomeCharacterReportPage.tsx` | partial | `REFINE` | bind four reports to vNext calculation metadata |
| Mate friends/groups/explore | `MatePanels.tsx`, mate screenshots | complete visual | `REFINE` | keep layouts; remove unsafe direct stat gains and routine-product coupling |
| Routine adaptation | `MateBuildPage.tsx` | partial | `REFINE` | use recommended candidate first and preserve main goal |
| Quest list | `QuestPanels.tsx`, quest screenshot | complete visual | `REFINE` | separate XP from MyData recalculation; remove boss/stat direct rewards |
| Record journey | `RoadmapPage.tsx`, roadmap screenshots | complete visual | `KEEP` | rebind to `DailyJourneyMonth`; label must be `기록` |
| Daily record sheet | `RoadmapPage.tsx`, roadmap screenshot | complete visual | `REFINE` | replace direct stat chips with data-recalculation summary and XP |
| Goal completion/demo | legacy special screens | partial | `REBUILD` | must use deterministic vNext demo contract |
| Birthday fund/FOMO/profile | multiple legacy screens | complete legacy | `DROP` | outside approved IA and MVP |

## Known Issues

- `App.css` is about 168 kB and `screenRenderer.tsx` about 95 kB; concerns are tightly coupled.
- Runtime uses a custom history router instead of the approved React Router structure.
- `mockApi.ts` contains product behavior and finance-like values that duplicate server ownership.
- Source includes duplicate root/public assets and a web-local synthetic data bundle.
- Some screens still label the fourth tab `로드맵`, while the approved IA uses `기록`.
- Quest and friend feed copy directly awards financial stats from UI actions.
- Mate screens expose product/stock names without separating information viewing from routine following.
- The delivered `home-boss.png` is still an overspending drink character, not a Europe travel-fund goal boss.
- Loading, empty, stale, insufficient, and replacement-confirmation states are incomplete.
- The app has a single large bundle and no route-level code splitting.

## Security And Data Audit

- Hardcoded API origin: legacy `http://localhost:8080` fallback
- Secrets: no private key, GitHub token, or cloud credential found in the initial pattern scan
- Demo credential: `p001@synthetic.finmate.local / password123!` is hardcoded in README, auth UI, and E2E
- Session storage: bearer-like mock access token stored in `localStorage`
- Financial calculations: legacy client renderer and mock layer own product data and presentation calculations
- Personal/account data: supplied data is described as synthetic, but web must not ship the raw bundle
- Unlicensed assets: Paperlogy and all supplied visual assets lack an accompanying license notice
- Destructive tests: legacy E2E calls reset/import endpoints and must not run in current CI

## Integration Boundary

The operational app keeps these vNext foundations unchanged:

- OpenAPI-generated TypeScript types and shared API client
- React Router route ownership
- TanStack Query server state
- MSW examples aligned to OpenAPI
- goal/routine/quest/raid causality tests
- four-tab IA: `홈 · 메이트 · 퀘스트 · 기록`

Only approved assets, visual tokens, and screen composition patterns are copied into the
operational branch. Source API, route, session, mock, calculation, and old E2E files are not copied.

## Frontend-v2 Alignment Verification

- Web baseline: `gaga-studio/finmate-web@dfb2f31`
- Design source: `gaga-studio/finmate-frontend-v2@e7faff8`
- API contract source: `gaga-studio/finmate-api@f50deff7`
- Copied asset hashes: 58/58 identical to the frozen design source
- Exact source modules: `index.css`, `home.css`, `mate.css`, `quest.css`,
  `detailedProfile.css`, `signature.css`, `homeBattleOrbit.ts`
- Unit/component tests: `37 passed`
- TypeScript typecheck: passed
- Lint: passed
- Production PWA build: passed
- Dependency audit: `0 vulnerabilities`
- Mock representative E2E: `1 passed`
- Isolated PostgreSQL + actual API E2E: `3 passed`
  - full representative flow and goal completion
  - partial demo logout/login resume
  - explore-only onboarding followed by later goal confirmation
- Mobile visual audit: baseline, home, character report, friends, comparison explore,
  group, adventurer, comparison report, routine, product information, quest detail,
  record, and daily sheet at
  `360px`, `390px`, and `430px`
- Browser audit: no console errors, failed image requests, or horizontal overflow
- Visual captures: home, report, mate, routine, quest, record, and daily sheet at
  `360px`, `390px`, and `430px` (21 captures)
- Record interaction regression: only the seven current journey steps are rendered,
  preventing hidden monthly steps from intercepting pointer events
- MVP IA completion: all seven formerly planned screens are implemented against Mock and
  actual API contracts; social writes, free-form search, and in-app product enrollment remain deferred

Generated screenshots and temporary capture automation were used only for verification and are
not committed. Global screenshot similarity is not reported as a synthetic percentage because
the approved IA intentionally changes content, goal semantics, tab labels, and removed unsafe
features. Asset identity, source CSS identity, viewport behavior, and screen-by-screen composition
are verified separately.

## Sign-off

- Design handoff audit: Codex, `2026-07-14`
- Product/asset license owner confirmation: pending
- Frontend owner review: pending
- Next review: stacked Draft PR review and product/asset license confirmation
