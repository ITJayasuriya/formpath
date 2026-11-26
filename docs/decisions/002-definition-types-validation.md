# Authored definitions and cross-field validation

26 November 2026. Internal alpha API; not a published package.

`defineFlow` is the authored TypeScript entry point. It runs `parseDefinition`
and preserves literal field IDs/options. `parseDefinition(unknown)` remains the
import boundary and returns the wider runtime type. Both reject malformed or
semantically impossible conditions. There is no unchecked cast from imported
JSON to an authored definition.

```ts
import { defineFlow, type AnswersFor } from "../../packages/core/src";

const flow = defineFlow({
  id: "example",
  version: 1,
  steps: [
    {
      id: "dates",
      title: "Requested dates",
      fields: [
        { id: "start", label: "Start", kind: "date", required: true },
        { id: "end", label: "End", kind: "date", required: true },
      ],
      rules: [{ kind: "dateOrder", startField: "start", endField: "end" }],
    },
  ],
});
const draft: AnswersFor<typeof flow> = { start: "2026-12-01" };
```

Draft types are partial even for required fields: an unfinished or hidden answer
is legal in a draft. Types do not prove date validity, required completion or
active visibility. Always call `prepareSubmission` immediately before an adapter.
Its result remains a runtime projection; it does not promise every authored key
exists. Compile-time assertions run through `npm run check`, not Vitest alone.

Date ordering is deliberately one constrained same-step rule, not arbitrary
callbacks or executable imported code. The two references must name distinct
date fields in that step. Same-day loans are valid. Comparison uses validated
ISO calendar strings without timezone conversion. A reversed range attaches
`dateOrder` to the end field, so existing navigation, inline errors and summary
links can consume it. Missing/invalid fields retain their ordinary errors;
hidden fields and steps do not participate. Cross-step date rules and arbitrary
step validators await a concrete consumer requirement.

Scalar conditions accept boolean, string, valid calendar date or declared choice
values according to the referenced field. `equals`/`oneOf` do not mean array
membership: comparisons against multi-choice fields are rejected rather than
silently producing an unreachable branch. An array membership operator would
need its own explicit contract if a real consumer requires it.

Strict self-review: replaced the old reference-only traversal with one semantic
condition traversal and a field map, deleting the intermediate reference list.
Date ordering lives in canonical validation; no loan policy leaked into the
navigation reducer. Authored output types apply parser defaults without unsafe
assertions or a second runtime schema. No added dependencies or files near 1,000
lines. No unresolved structural finding in this diff.
