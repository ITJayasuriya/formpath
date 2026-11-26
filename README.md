# FormPath

[![CI](https://github.com/ITJayasuriya/formpath/actions/workflows/ci.yml/badge.svg)](https://github.com/ITJayasuriya/formpath/actions/workflows/ci.yml)

Accessible conditional-form toolkit in development. The internal alpha includes a pure typed flow engine and a memory-only React equipment-loan demo: conditional organisation details, date validation, active-answer review and exact-field corrections. Demo receipts are local; no application is sent or equipment reserved.

Packages are not yet published. Persistence, browser-history routes, React Hook Form composition, Next.js integration, submission contracts and release documentation remain in progress. See [the alpha integration guide](docs/alpha-integration.md) for current boundaries.

## Local development

Use Node 24.21.0.

```sh
npm ci
npm run dev
npm run check
npm test
npm run build
npx playwright install chromium webkit
npm run test:e2e:local # Chromium and WebKit on this Mac; CI runs all three browsers
```

Read [implementation plan](docs/IMPLEMENTATION.md), [engineering standards](docs/ENGINEERING.md) and [current status](docs/STATUS.md).

## Contributions

See [CONTRIBUTING.md](CONTRIBUTING.md). Report defects with synthetic data only.

[Live demo](https://isuru-formpath.pages.dev) · [Delivery board](https://github.com/users/ITJayasuriya/projects/2) · [Setup results](docs/SETUP-RESULT.md)
