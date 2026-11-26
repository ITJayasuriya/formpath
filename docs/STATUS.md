# Status

Stage: internal M1 core alpha; no working product UI or published package yet.
Delivery window: 25 November 2026–5 January 2027. Day 2 of 42.

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

Merged PR: https://github.com/ITJayasuriya/formpath/pull/12.
Local branch: `main`; squash merge `46be070`.
Implementation commits: `db247b3`, `0fa5a1c`, `0005e02`.
Daily target: four coherent commits, selected once; fourth is the API/research
and verification record (`28b7539`). Daily goal completed and integrated.
Do not reroll or start a second daily implementation.

## Verification

Tested final PR revision: `28b7539` (same implementation as `0005e02`).
Final post-merge operational updates to STATUS/RUN-STATE remain local and should
be preserved and committed with the next implementation; no product code is dirty.
`npm run check`, 21 domain tests and `npm run build` passed. Two Chromium/WebKit
setup-page smoke/axe tests passed locally; they do not test a product UI.
Initial sandbox Vite bind failed with EPERM; authorized rerun passed.
Required Linux CI passed on final PR head `28b7539`: check, 21 domain tests,
build and three Chromium/Firefox/WebKit setup smoke/axe tests.
Evidence: https://github.com/ITJayasuriya/formpath/actions/runs/45608743533.
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

## 26 November — core validation and types

Daily target: three coherent commits, retained for any recovery run. Branch:
`feat/core-validation-types`. Units: `a95b70a` date-range rules; `c9f6573`
authored definitions/answer inference; third unit adds semantic condition
validation and review-date correction coverage. No working product UI yet.

- Same-step date-order rules validate references at load time; active validation,
  navigation and submission share one rule. Same-day ranges pass; missing,
  malformed and hidden dates follow existing field policy.
- `defineFlow` validates authored definitions while preserving literal IDs/options;
  `AnswersFor` infers partial drafts, choice unions, boolean and multi-choice types.
- Impossible condition operands now fail at load time, including unsupported
  scalar comparisons against array answers. No silent unreachable branch.
- Date correction from review blocks on invalid order and returns to review after
  correction, retaining hidden draft answers while excluding them from submission.

Verification on the third unit working tree: check (including positive/negative
compile-time assertions), 41 domain tests and build passed. Local Chromium/WebKit
setup smoke/axe: 2 passed after the initial sandbox EPERM bind failure. These
browser tests cover the setup page only. Linux three-engine CI will run on the PR.
Existing live setup page inspected in Chromium at desktop and 360px; no deployment
because no browser feature changed. No local Firefox/manual screen-reader or
performance claim. Strict review recorded in decisions/002: one condition
traversal replaces reference flattening, core owns all validation, no casts or
new dependencies. No unresolved structural finding.

PR triage: #3 TypeScript 7 cannot install (typescript-eslint requires <6.1).
#1/#2 optional major Actions updates are deferred, not merged on old CI.
Next: integrate this PR after required CI, then React memory-only loan binding
and accessible UI with actual browser journeys. M1 end-to-end alpha is still
incomplete. Remaining mandatory v1 scope and discovery gaps above still apply.

PR: https://github.com/ITJayasuriya/formpath/pull/13. Reviewed/tested head:
`3d3d5b61fdba42654582e0f34128df1429237814`. Three daily commits completed:
`a95b70a`, `c9f6573`, `3d3d5b6`. Required Linux CI passed on the reviewed exact head (check, 41 tests, build,
three browser setup smoke/axe tests):
https://github.com/ITJayasuriya/formpath/actions/runs/45860441684.
PR #13 merged normally as `6219821fd87d2b54ad537439e0ed7f6b81fc27a7`.
Local main synchronized without discarding operational docs; post-merge 41 tests
and build passed. Day 2 completed; same-date recovery should skip after cheap
necessary-PR triage. No credential blocker or lost delivery day. Final operational
outcome updates remain local until the next meaningful implementation commit.

## 27 November — memory-only React loan alpha (in progress)

Daily target: five coherent commits, chosen once. Branch `feat/loan-ui`.
Added a memory-only React transition binding. Core remains canonical for answers,
branching and validation; the binding applies focus intentions and revalidates
errors after progression attempts without moving typing focus. Current working
UI passed check, 41 domain tests/build and four actual loan browser journeys
(Chromium/WebKit), including axe, exact review focus and mobile date recovery.
Next: commit the loan consumer and its browser regression coverage, review
browser-history behavior and open one implementation PR. No deployment yet.

Loan consumer now implements conditional organisation details, native fieldset/
legend semantics, active-only review, change/confirm and explicit local-only
receipt. Cream paper, ink and teal tokens follow IMPLEMENTATION; screenshots
inspected at 1365px and 360px with no clipping. No new dependencies. Browser
history/deep-link UI, RHF composition and reusable styled/headless patterns are
still incomplete v1 work; this alpha does not claim them.

Product browser regressions replace the setup smoke test: keyboard error-summary
links, heading/exact-field focus, hidden payload exclusion, back retention,
review date-order recovery and reload-clears-memory. Axe runs on initial mobile,
error and review states. All four local Chromium/WebKit cases passed; local
Firefox not run. Linux three-engine CI is required before merge.

Strict review extracted the error-summary pattern and consolidated grouped-field
focus into one policy. Review edits now focus the selected radio instead of
always the first radio. Revised regression passes in Chromium/WebKit (four
cases); check/41 tests/build pass. No casts, new dependencies, generic renderer
or duplicated validation policy added. Internal patterns use a single-flow DOM
ID contract; multi-instance IDs/localisation remain release work.
