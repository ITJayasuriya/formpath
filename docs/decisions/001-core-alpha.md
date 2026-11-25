# Core alpha boundary — 25 November 2026

Decision: build a small pure flow layer, with explicit payload projection and
navigation effects. This is an internal alpha, not a published API. Source lives
in `packages/core`; the root TypeScript/Vitest configurations check it now.
Workspace manifests, declaration builds, packed-consumer verification and npm
names are deferred until real React/Vite/Next consumers exercise this boundary.
No package is published and no namespace availability is implied.

## Model and ownership

`parseDefinition(unknown)` is the runtime definition boundary. Zod rejects extra
properties, invalid IDs, duplicate options and unknown operators. IDs are unique
within step/field namespaces. Definitions have positive integer versions and
nonempty bounded steps/fields. Conditions have at most eight levels and may
reference only fields from earlier steps, preventing self/forward/cyclic graphs.
Supported operators are equals, oneOf (scalar membership), all, any and not.
Missing references evaluate false for equals/oneOf, and true for their negation.
Definitions are application-owned and must not be mutated after parsing.

`Answers` is a string/boolean/string-array map. The alpha does not yet infer an
answer record's keys and choice literals from a definition. Native date-only
strings remain strings, checked as calendar dates without timezone conversion.
Required boolean means an answer exists; false is valid. Applications requiring
true consent need an application validation rule. Step-level/date-order rules
and strongly inferred per-definition answer types remain M1 work.

`activePath` walks in order, evaluating conditions against earlier **active**
answers. Hidden answers stay in the supplied memory snapshot but cannot activate
later branches. Only own declared active keys enter the projected payload.
`validate` checks active values, required answers, choice membership, duplicate
multi-selections and calendar dates. `prepareSubmission` validates the whole
active path and yields either errors or a projection. It never sends anything.
No application should pass its retained draft directly to a submission adapter.
Imported drafts will need a separate runtime envelope boundary before use.

`initialState` and `transition` own navigation, not field interaction. Next
validates; back preserves incomplete work. Open guards step/review targets using
the earliest incomplete prerequisite. Review edits carry return intent, visit
newly required steps and then return to review. Unknown edit targets are ignored;
unknown answer field IDs throw. There is no URL receipt or successful submission
state in this alpha. An adapter, not routing, must establish success.

Transitions return focus intentions and IDs that became hidden. React will
perform focus effects after commit: next/back/open → heading, failed next →
error summary, review change → exact field, typing → no focus movement. The
binding still needs same-step focus recovery, corrected-field revalidation,
browser-history messages and tests against actual DOM/assistive technology.
RHF will own field interaction/dirty tracking; its values must synchronize through
one binding rather than become a second independent answer store.

## Acceptance fixtures and remaining gates

`packages/core/fixtures/flows.ts` has synthetic loan and volunteer definitions.
Loan: equipment → borrower → conditional organisation → dates → review.
Changing organisation to individual retains its name locally and excludes it
from active validation/payload. Volunteer: role → conditional skills → availability.
These are test fixtures, not working consumer applications or real submissions.

Twenty-one deterministic domain cases cover schema failures, chained hidden
branches, active validation, navigation and both fixtures. They do not establish
UI accessibility, SSR, storage durability, exactly-once submission or adoption.

## Strict review

Applied Ponytail and Thermo-Nuclear Code Quality Review to the alpha diff.
Resolved: ambiguous string route targets replaced by a tagged step/review union;
reflection-based payload writes replaced by ordinary assignment (ID grammar
excludes the prototype setter key); hidden dependency evaluation centralized in
one ordered projection; no React/DOM imports or effects in core. Modules remain
under 200 lines each. No structural blocker remains for this internal alpha.

Deferred deliberately: generic plugin system, new primitive inputs, persistence,
service wrappers, Storybook dependencies and npm publication. Those are either
outside scope or need real consuming UI. Missing product features remain in the
implementation plan rather than being silently removed.
