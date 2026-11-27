# Memory-only loan alpha

Run `npm ci` with Node 24.21.0, install Chromium and WebKit using
`npx playwright install chromium webkit`, then `npm run dev`. Use fictitious
answers. This is a synthetic library request; no availability service or real
submission exists. A reload clears everything, including the demo receipt.

## Boundaries and extension points

- `packages/core/src` validates definitions, computes the active path and owns
  navigation/validation. `defineFlow` preserves authored literal IDs/options;
  `AnswersFor<typeof definition>` describes partial drafts, not validated payloads.
- `packages/react/src/useFlow.ts` binds that policy to memory state and focus
  effects. Attach its `root` to the flow container. It assumes one mounted flow
  and an unchanged definition for that mount. Mount a new instance to reset it.
- The heading uses `flow-heading` with `tabIndex={-1}`. Inputs use `field-<id>`;
  fieldsets use that ID and focus the checked control or first available control.
  `ErrorSummary` uses `flow-errors` and takes an application-rendered message.
  Inline errors need `aria-describedby` and stable IDs. Styling is application
  owned; see `src/style.css` for the optional example theme.
- `src/LoanApp.tsx` is a loan-specific consumer, not a generic field renderer.
  Native radio/text/date controls are used. React Hook Form composition is still
  required before the planned public API is complete; this alpha has one answer
  owner and does not keep a second form store in sync.
- Always call `prepareSubmission` immediately before an application-owned adapter.
  Hidden answers remain in memory to permit branch restoration. They are excluded
  from review and payload by the core projection. The current receipt just
  renders that payload locally, with an explicit non-submission message.

## Reproduce the evidence

`npm run check`, `npm test` and `npm run build` cover types/lint/format, 50 core/route/server-boundary
cases and a production bundle. `npm run test:e2e:local` runs five product journeys
and two upstream browser probes in Chromium and WebKit (14 cases). Linux CI
runs all seven in Firefox too (21 cases). This is
product behavior coverage, replacing the original setup-page smoke test.

The keyboard journey triggers validation, follows an error link to its radio,
continues with Space, completes the organisation branch, edits borrower type
from review and checks hidden payload exclusion. The mobile journey checks
back retention, date-order errors, `aria-invalid`, exact-field review focus and
return to review after correction. Axe examines initial, error and review states.
A reload test verifies the memory-only promise. Manual screen-reader testing remains unverified. Loaded-page offline navigation
and forced-colors emulation were inspected; this is not native high-contrast
or assistive-technology validation.

Desktop (1365px) and mobile (360px) screenshots were inspected on macOS Chromium.
Body/control text is at least 16px, body line-height 1.6, headings 1.25 and text
stays within the reading column. The footer includes the Git revision from the
build so deployed behavior can be tied to checked source. Build artifacts stay
ignored. No performance benchmark or field Web Vitals claim is made.

## Strict review outcome and remaining gates

The review consolidated error-summary markup and focus handling; grouped edits
return to the selected radio. Core remains the single validation/navigation
policy. No new dependency, cast-heavy adapter or input abstraction was needed.
The UI follows the existing paper/ink/teal direction; review change controls and
error links make exact-answer correction visible.

This is not v1. Next work includes multi-instance
IDs and localisation, RHF composition, opt-in drafts/migrations/multi-tab conflicts,
idempotent submission/unknown outcomes, workspace exports/packed consumers,
Next.js SSR/hydration, secure Storybook and complete accessible styled/headless
patterns. See IMPLEMENTATION and STATUS for the full mandatory scope. External
pilot and reviewed Sinhala evidence are still absent; no interviews are claimed.

## Opt-in browser history

Call `useFlowHistory(definition, flow)` alongside `useFlow`. Attach one flow per
page and keep its definition stable for that mount. The memory hook still works
without URL integration. Both hooks render a deterministic empty server snapshot;
browser URL reads and writes happen after hydration. The Node regression verifies
that boundary; the real Next.js SSR/hydration consumer remains required work.

The static Pages demo uses `#/apply/equipment-loan/step/equipment` and
`#/apply/equipment-loan/review`; no server rewrite or Next.js server is implied.
Routes contain IDs only. Neither answers nor edit-return intent enter the URL or
history state. Review change buttons preserve exact-field focus and return intent
within that visit; browser Back/Forward restores the step with heading focus,
without restoring stale edit intent.

Every incoming hash passes through core `open`. Missing prerequisites recover to
the first invalid step; unknown/hidden step IDs use the core safe fallback. A
recovery notice explains the change and the rejected history entry is replaced,
so Back does not create a redirect loop. In-app route changes push a new entry;
answer edits and failed validation do not. A branch that becomes visible again
retains its in-memory answers. Reload clears them and rechecks the requested URL.
Receipt URLs are rejected: a local demo receipt exists only after explicit user
action, and browser traversal clears it. Browser history never proves submission.
