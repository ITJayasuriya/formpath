# Status

Stage: internal memory-only loan UI alpha; package publication and full v1 remain incomplete.
Delivery window: 25 November 2026–5 January 2027. Day 3 of 42.

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

Alpha integration/reproduction guide added; README now describes actual product
behavior and installs both browsers needed by the local command. Build embeds
its actual Git revision in the footer for deployment verification. Final planned
unit is the integration/evidence guide. Remaining mandatory scope above remains
open; no npm publication or pilot validation is claimed.

Final accessibility review found missing native required semantics. Required
radio/text/date controls now expose their required state while form `noValidate`
keeps the core error-summary policy in charge. Added the browser assertion.
This necessary correction is a sixth commit beyond the target of five; no
padding work was added. Required CI must use this corrected head.

Required Linux CI run 45881417690 failed twice at reviewed head 4051360: both
Firefox pages crashed (review axe evaluation and date-input fill); all four
Chromium/WebKit cases passed, as did check/41 tests/build. Added browser-process
diagnostics to CI without removing tests or changing required protections.
No merge/deployment until the actual cause is resolved and required CI passes.
Production-build loaded-page offline journey passed locally; 200% text at 360px
had no horizontal overflow, and emulated forced-colors error screenshot was
inspected (not a Windows high-contrast/manual screen-reader claim).

### Run outcome — 27 November

Seven actual commits (target five; two required accessibility/CI corrections):
`e4c59b2`, `ea49589`, `a845cc8`, `ded3378`, `0dd6866`, `4051360`, `1d85ace`.
PR https://github.com/ITJayasuriya/formpath/pull/14 remains open on
`1d85acece8ccbd362f91058b37db7892468521b9`.

Required Linux diagnostic CI failed:
https://github.com/ITJayasuriya/formpath/actions/runs/45882023712.
Check/41 core tests/build and four Chromium/WebKit product cases passed there;
two Firefox cases crashed. Process diagnostics show Firefox content processes
exiting on signal 11, not an assertion failure. The cause is NOT yet established;
the namespace EPERM warning alone is not proof of cause. Earlier CI attempt and
one bounded retry at 4051360 failed at the same two operations. No further blind
retries, test skips, weakened protection, merge or deployment were performed.

Last local product-tested code: 4051360 (check, 41 tests, build and four browser
cases). Head 1d85ace changes only CI diagnostics/status and passed local check;
its CI confirms the same passing non-Firefox checks. Current deployed site is
still the setup marker, verified before work. No release/package publication.
Final operational checkpoint/status changes remain local for recovery.

Next concrete action: on this same branch/PR, add minimal Linux Firefox probes
for native required date-input fill and axe on static markup, compare their
content-process failures with the loan journey, then fix the established cause.
Keep all six required product cases. Review and rerun required CI on the final
head, merge normally only when green, then build/deploy checked main and verify
the full hosted journey plus footer revision. Today's implementation is useful
but daily integration is unfinished; retain the selected target and seven commits
on same-date recovery. No full delivery day has been marked completed and the
5 January deadline is unchanged. No owner credential/action is needed now.

### 27 November recovery — isolate browser regression

Resumed PR #14, retaining target five and all seven prior commits. Upstream
Playwright #44135 matches the axe/label/ARIA reflection crash in Firefox build 1572. Added independent static named-region/axe/date probe and a native required
date control without axe; all product tests remain. First run tests the existing
pin to establish the local CI reproduction before selecting a compatible stable
version. No product markup changes, skips or protection changes.

Linux run 46029891689 at 1d65dd1 reproduced the static axe/label crash with
Playwright 1.65.1, while the native required-date control passed. Nine cases
passed; three Firefox cases crashed (static reproduction and both product
journeys). This isolates the upstream regression without changing the UI.
Pinned stable runner and axe peer to 1.64.1; local check, 41 core tests, build,
eight Chromium/WebKit cases passed. npm audit: zero advisories. Required Linux
CI on the new pin is next. Decision 003 records compatibility and upgrade gate.

### Recovery outcome — 27 November completed and deployed

Two recovery commits: `1d65dd1` isolates the upstream Firefox crash;
`c5b7cd1` pins compatible stable Playwright runner/axe peer and documents the
upgrade gate. Nine implementation commits today against the retained target of
five; additional commits fixed required semantics and the actual CI blocker,
not a new daily goal. Strict review resolved the dependency/type mismatch with
an explicit matching peer pin; no production workaround or skipped test.

Required Linux CI passed on reviewed head `c5b7cd14f95eb0a2755d269478ef320014c31030`:
https://github.com/ITJayasuriya/formpath/actions/runs/46030310618 — check, 41 core
tests, build, all 12 Chromium/Firefox/WebKit cases. PR #14 was normally squash
merged with the exact-head guard as `f95eaa12f8b5fc5c11f3ac379f8b08717d7cfe20`.
Local main safely synchronized; 41 tests/build passed again. The redundant
push-to-main CI run 46030831733 was queued at final inspection, not claimed green.

Deployed that build once to the existing Pages project (deployment `e6e76639`).
https://isuru-formpath.pages.dev now serves the loan alpha, replacing the setup
marker. Production footer verified against full merge SHA. Both actual product
journeys passed in Chromium/WebKit (four cases), including desktop/mobile axe,
error focus, conditional payload exclusion, review/date correction and reload.
Production desktop/360px error screenshots inspected; no clipping, 16px controls,
visible error focus. Local and hosted Firefox/manual screen-reader checks were
not run; required Linux Firefox passed. No npm publication or real submission.

The day's concrete memory-only goal is now integrated and verified. No lost
whole delivery day or owner action; the original deadline remains 5 January.
Next: browser-history/deep-link recovery with meaningful browser regressions,
then RHF composition and workspace exports before the second Next.js consumer.
All remaining v1 scope and external validation gaps listed above remain open.
No whole-project weekly audit is claimed on day 3. Final operational STATUS and
RUN-STATE updates remain local for the next meaningful implementation commit;
no product code is dirty. The completed-day duplicate check must use PR #14's
merged evidence, retain target five and avoid another deployment.

## 28 November — guarded browser history

Day 4; daily target five, chosen once. Branch `feat/browser-history`.
Static-host-safe hash routes contain flow/step IDs only. The strict route reader
rejects malformed escapes, foreign flows and receipt claims. Core `open` remains
the sole active-path/prerequisite guard. URL boundary has eight regression cases.
Prior day's main CI 46030831733 passed. Dependency PR #15 is blocked by actual
TypeScript 7 / typescript-eslint <6.1 peer conflict and would restore the known
Playwright 1.65.1 Firefox regression; not merged. Optional Actions majors #1/#2
remain deferred. Remaining v1 scope/external validation gaps above still apply.

Opt-in React history binding now delegates every initial/hash navigation to core,
replaces denied URLs and pushes successful in-app transitions. Effects run after
hydration; StrictMode initial deep links are covered. Memory answers stay out of
both URLs and history state. Browser traversal clears the local demo receipt;
revisiting review cannot invent success. Review return intent remains transient.
Working tree: check, 49 unit tests/build and 14 Chromium/WebKit cases passed.
Linux Firefox and visual recovery inspection pending. No dependencies changed.

History regression coverage now exercises invalid/malformed/receipt links,
prerequisite recovery, Back/Forward with branch disappearance/reappearance,
same-step review correction, transient edit intent and receipt/reload recovery.
All 14 local Chromium/WebKit cases pass. Desktop/360px recovery screenshots
inspected: readable notice, visible heading focus, no horizontal overflow.
Loaded-page offline back also passed. No local Firefox/manual screen-reader claim.
