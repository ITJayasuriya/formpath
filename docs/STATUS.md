# Status

Stage: internal M1 core alpha; no working product UI or published package yet.
Delivery window: 25 November 2026–5 January 2027. Day 1 of 42.

## 25 November — delivered

- Strict definition boundary: unique IDs, bounded constrained condition AST,
  earlier-step references and field shapes/options.
- Canonical active-path projection: retains hidden draft answers but excludes
  them and unknown keys from active validation/payload and downstream conditions.
- Native value rules: required answers, choice/multi-choice membership, date-only
  calendar validation, false as a valid boolean answer.
- Pure next/back/deep-link/review-edit navigation with explicit focus intentions,
  branch notices and required-step recovery after a review edit.
- Synthetic loan and volunteer fixtures; API/discovery decision and strict review
  records in `docs/decisions/001-core-alpha.md` and
  `docs/research/2026-11-25-discovery.md`.

PR: https://github.com/ITJayasuriya/formpath/pull/12 (`feat/core-alpha`).
Implementation commits: `db247b3`, `0fa5a1c`, `0005e02`.
Daily target: four coherent commits, selected once; fourth is the API/research
and verification record. Do not reroll or start a second daily implementation.

## Verification

Tested implementation revision: `0005e02`; remaining changes are documentation.
`npm run check`, 21 domain tests and `npm run build` passed. Two Chromium/WebKit
setup-page smoke/axe tests passed locally; they do not test a product UI.
Initial sandbox Vite bind failed with EPERM; authorized rerun passed.
Required Linux CI on the PR runs all three engines; awaiting its final head check.
Local Firefox has the previously documented startup failure and was not run.

The existing live site https://isuru-formpath.pages.dev returned HTTP 200; checked
its setup-marker content in installed Chromium and inspected desktop/mobile
screenshots. No deployment was made because this change adds no browser feature.
The generic browser tool lacked Chrome; installed Playwright Chromium worked.
No performance or manual screen-reader claims are made.

Ponytail and Thermo-Nuclear review resolved ambiguous route targets and unnecessary
reflection in payload writes, keeping branching in one core policy and effects
outside it. No remaining structural blocker for this internal alpha. No new
dependencies. No `codex`/`codex-automation` labels exist in the repository.

## Next concrete work

1. Finish M1 application validation (step-level/date ordering) and strengthen
   definition-derived answer typing; use the synthetic loan fixture throughout.
2. Build React binding and memory-only loan UI: errors/summary focus, heading
   focus, progress, branch notices, review edit/return and a clearly demo receipt.
   Apply interface-design and better-typography when UI work starts.
3. Test real keyboard/branch/review journeys on desktop/mobile, then deploy the
   checked main revision to existing Pages. Keep one implementation PR at a time.

## Remaining v1 scope and evidence gaps

React/core workspace packaging and Changesets; full loan Vite and volunteer
Next.js SSR/hydration consumers; styled/headless components; browser history and
same-step focus recovery; opt-in drafts/migrations/multi-tab conflicts and import
boundaries; idempotent submission adapter/unknown outcome; locale/RTL/long-label
fixtures; secure compatible Storybook/docs; clean npm-pack consumers; release,
accessibility/performance evidence and contributor verification.

No participant interviews or independent integration trials exist. Discovery
proceeds provisionally with synthetic engineering evidence, without claiming
validated demand or closing issue #4. Issues #5–#7 remain broader incomplete
milestones. No credentials or service access block current implementation.
First npm publication/trusted-publisher binding may later require owner action.
