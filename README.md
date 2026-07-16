# FinMate Web

FinMate vNext 모바일 웹/PWA입니다. 제품 계약은
[`gaga-studio/finmate-api`](https://github.com/gaga-studio/finmate-api)의 OpenAPI를 기준으로 합니다.

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

The default `.env.example` uses the real local API. Start `finmate-api` on the
URL configured by `VITE_API_BASE_URL`. To run the representative flow with MSW
fixtures instead, use `npm run dev:mock`.

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run test:e2e:api
```

`test:e2e:api` starts PostgreSQL and the API `demo` profile, then verifies the
full signup-to-goal-completion flow against the real HTTP contract.

디자인 인수 원본은 운영 브랜치에 직접 병합하지 않습니다. 인수 절차와 분류 기준은
[`HANDOFF.md`](HANDOFF.md)를 따릅니다.
