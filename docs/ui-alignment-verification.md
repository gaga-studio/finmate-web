# FinMate frontend-v2 UI alignment verification

## Fixed references

- Operational baseline: `gaga-studio/finmate-web@dfb2f31`
- Visual source of truth: `gaga-studio/finmate-frontend-v2@e7faff8`
- API contract: `gaga-studio/finmate-api@f50deff7`
- Integration branch: `codex/align-ui-to-frontend-v2`

The visual source repository was not modified. Its obsolete API client, router, finance-like
client calculations, birthday fund, point locks, random boxes, and unsafe investment rewards
were not copied.

## Provenance checks

The 58 copied font and image assets are listed in
[`frontend-v2-assets.sha256`](frontend-v2-assets.sha256). Each recorded digest was checked
against both the source file and the operational copy.

The following modules are byte-identical to the design source:

- `index.css`
- `home.css`
- `mate.css`
- `quest.css`
- `detailedProfile.css`
- `signature.css`
- `homeBattleOrbit.ts`

`App.css` starts from the source file and adds only vNext composition rules for API-only
screens and approved state variants. The journey selector override reindexes the seven visible
steps after the API month is reduced to the current seven-day window.

## Screen mapping

| vNext screen | frontend-v2 grammar reused | Product-owned difference |
| --- | --- | --- |
| Home raid | identity bar, battle stage, orbit animation, stat cards, bottom nav | Europe travel goal, API raid state, deterministic cosmetic progress |
| Character report | arena, nameplate, stat grid, coach and history cards | server-calculated four reports and metadata |
| Mate | three subtabs, group/adventurer cards, report and build layouts | anonymous ranges, no ranking, no product or stock copying |
| Quest | segmented tabs, summary, mascot, quest rows | XP separated from financial recalculation |
| Record | monthly summary, full-width stepping-stone path, daily sheet | tab label `기록`, API activities and seven visible steps |
| Auth/onboarding/goal | source typography, cards, buttons and form grammar | approved five-step onboarding and separate goal confirmation |
| Product/settings/states | source information cards, consent rows and sheets | information-only product view and disclosure API |

## Automated browser audit

The same authenticated Mock session opened the following seven screens at 360, 390, and
430 CSS pixels: home, character report, mate groups, routine detail, quests, record journey,
and daily record sheet.

For all 21 captures the audit checked:

- page content rendered and no Vite error overlay appeared;
- body width stayed within the viewport by at most one rounding pixel;
- every completed image had a non-zero natural width;
- no browser console error or failed network request occurred;
- the four-tab navigation and active state remained visible;
- the day sheet opened from a clickable journey step.

The source app was also started from its frozen repository and its home, mate, quest, and
record routes were captured at 390px for side-by-side inspection. Global pixel similarity is
not used as an acceptance number because the approved product intentionally changes dynamic
text, the raid goal, removed reward mechanics, and the fourth tab label. This document records
the verifiable boundaries instead of presenting a misleading percentage.

## Functional verification

- Unit/component tests: 37/37
- Mock Playwright flow: 1/1
- Isolated PostgreSQL and actual API flows: 3/3
- TypeScript typecheck: passed
- Oxlint: passed
- Production PWA build: passed

The actual API run additionally caught an overlap where 30 monthly step buttons shared a
seven-step visual path. The component now renders only the seven steps around `TODAY` (or the
latest recorded day), and a regression test fixes that count at seven.

## Release blockers

- Written Paperlogy license confirmation
- Written ownership or distribution permission for supplied character and background assets

Until both are recorded, these assets are allowed only for development and presentation, not
production distribution.
