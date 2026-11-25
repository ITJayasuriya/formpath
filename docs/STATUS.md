# Status

Stage: verified development foundation, not an implemented product.

Completed: repository skeleton, pinned dependencies, application setup marker, TypeScript/lint/format configuration, production build, Chromium smoke and axe check, three-browser CI configuration, contribution/security documents and implementation plans.

Local Firefox startup currently fails before page load with “Could not find profile folder.” Chromium and WebKit are the local readiness checks via `npm run test:e2e:local`; full `npm run test:e2e` includes Firefox and is required in Linux CI. Do not claim local Firefox passed.

Next: M0 discovery and first vertical slice from IMPLEMENTATION.md. No product unit tests exist yet; add meaningful domain tests with product logic.

Deferred tool integrations: unused Storybook (FormPath) and PWA tooling (RepairRelay) were removed after moderate transitive advisories. Select secure compatible versions when those milestones start.

Read SETUP-RESULT.md and OPERATIONS.md for verified setup and release prerequisites. All main-branch CI checks passed on Linux including all three browser engines. Do not create scheduled tasks: the owner will create them after readiness review.

## 25 November 2026 — day 1, core foundation in progress

Branch: `feat/core-alpha`; no implementation PR yet. Starting revision: `537f70c`.
Definition boundary implemented in `packages/core/src`: strict runtime schemas,
unique field/step IDs, earlier-step references only, eight-level condition limit,
and constrained operators. Ten domain tests and `npm run check` pass on the
working tree based on that revision. No UI changes or deployment yet.
Next: active-payload projection/validation, then pure navigation and fixtures.
Research/pilot validation remains unavailable; no interviews are claimed.
All other M1–M4 scope remains open, including React bindings, actual loan UI,
Next.js integration, drafts, submission recovery, docs/Storybook and packaging.

Active payload unit: 14 domain tests and check pass on `db247b3` plus working
tree. Hidden fields and unknown keys are omitted; hidden answers cannot drive
later branches. Only active required fields validate; date-only ISO values,
choice membership, booleans and duplicate selections have explicit rules.
Next: navigation, review corrections and guarded deep links.

Navigation unit: 21 domain tests, check and build passed on `0fa5a1c` plus working
tree. Pure transitions return explicit heading/field/error focus intentions;
review edits visit newly required steps and return to review. Deep links cannot
skip incomplete prerequisites. Synthetic loan and volunteer definitions exercise
the same engine; neither is a working consuming UI yet.
Two local Chromium/WebKit setup smoke/axe checks passed after rerunning outside
the sandbox (initial Vite bind failed with EPERM). Firefox remains CI-only.
Next: final API/research/review record, PR and required CI.
