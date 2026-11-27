# Guarded browser history — 28 November 2026

Use an opt-in hash adapter beside the memory binding. Hash routes work on the
existing static host without adding server routes or relying on a Next.js server.
A router dependency is unnecessary for two target shapes. Core `open` owns
permission/prerequisite recovery; the adapter only parses IDs and applies browser
effects. No answer snapshots are serialized into URLs or history state.

Initial render is deterministic. Effects read the URL after hydration and wait
for the core transition before replacing it with its canonical target. This also
works under StrictMode's effect replay. Incoming navigation replaces denied
entries; in-app navigation pushes only when the step/review route changes.
Review edit intent is deliberately transient; browser traversal uses heading
focus. Receipt visibility is tied to the state that produced the local receipt,
so Back/Forward cannot present a previous success as a new submission.

## Thermo-Nuclear review

Reviewed the complete change against main. The main simplification is reuse of
core `open`, avoiding a second prerequisite/branch validator in the URL adapter.
Review found two boundary hazards before commit: the initial synchronization
could overwrite a deep link during StrictMode replay, and a direct first-step
array access excluded empty definitions. Synchronization now waits for the core
focus result; fallback uses `initialState`. Browser regressions cover StrictMode
recovery, and the existing core owns empty-flow policy. No casts, new dependencies,
generic routing framework, reducer modes or duplicated domain rules. Largest
changed product file remains below 300 lines; the history hook is 45 lines.
No actionable structural finding remains for this alpha change. Whole-project
weekly audit and public API review remain scheduled delivery work.

## Verification limits

Local check, 50 unit/boundary tests and build passed. Fourteen Chromium/WebKit
cases include real history/branch/review/receipt recovery and automated axe.
Desktop and 360px recovery screenshots inspected with visible heading focus,
readable notice and no horizontal overflow. Loaded-page offline back passed.
Node server-render regression is not evidence of Next.js hydration. Required
Linux CI includes Firefox; see STATUS for its final head/result. No local Firefox,
manual screen reader, real pilot or performance benchmark is claimed.
