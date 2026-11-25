import { describe, expect, it } from "vitest";
import { parseDefinition, type Answers } from "./definition";
import { activePath, matches, prepareSubmission, validate } from "./path";
const flow = parseDefinition({
  id: "loan",
  version: 1,
  steps: [
    {
      id: "borrower",
      title: "Borrower",
      fields: [
        {
          id: "kind",
          kind: "choice",
          options: ["group", "person"],
          label: "Who?",
          required: true,
        },
      ],
    },
    {
      id: "group",
      title: "Group",
      visibleWhen: { op: "equals", field: "kind", value: "group" },
      fields: [
        { id: "groupName", kind: "text", label: "Group name", required: true },
      ],
    },
    {
      id: "extra",
      title: "Extra",
      visibleWhen: { op: "equals", field: "groupName", value: "Workshop" },
      fields: [{ id: "secret", kind: "text", label: "Extra", required: true }],
    },
    {
      id: "dates",
      title: "Dates",
      fields: [
        { id: "start", kind: "date", label: "Start", required: true },
        { id: "consent", kind: "boolean", label: "Consent", required: true },
      ],
    },
  ],
});
describe("active answers", () => {
  it("retains the draft but excludes hidden answers, unknown keys and downstream branches", () => {
    const answers = Object.freeze({
      kind: "person",
      groupName: "Workshop",
      secret: "hidden",
      unknown: "drop",
      start: "2028-02-29",
      consent: false,
    });
    expect(prepareSubmission(flow, answers)).toEqual({
      status: "valid",
      payload: { kind: "person", start: "2028-02-29", consent: false },
    });
    expect(answers.groupName).toBe("Workshop");
    expect(validate(flow, { ...answers, kind: "group" })).toEqual([]);
  });
  it("requires only active answers and rejects invalid dates and enum values", () => {
    expect(
      validate(flow, { kind: "person", start: "2027-02-29", consent: false }),
    ).toEqual([
      { stepId: "dates", fieldId: "start", translationKey: "invalid" },
    ]);
    expect(prepareSubmission(flow, { kind: "other" }).status).toBe("invalid");
    expect(
      validate(flow, { kind: "group", start: "2026-12-01", consent: true })[0]
        ?.fieldId,
    ).toBe("groupName");
  });
  it("covers every condition operator and ignores inherited answers", () => {
    const a = { kind: "person" };
    expect(
      matches(
        {
          op: "all",
          conditions: [
            { op: "oneOf", field: "kind", values: ["person"] },
            {
              op: "not",
              condition: { op: "equals", field: "kind", value: "group" },
            },
          ],
        },
        a,
      ),
    ).toBe(true);
    expect(
      matches(
        {
          op: "any",
          conditions: [{ op: "equals", field: "kind", value: "group" }],
        },
        a,
      ),
    ).toBe(false);
    const inherited: Answers = Object.create(a);
    expect(activePath(flow, inherited).payload).toEqual({});
  });
  it("never projects inactive keys across 100 deterministic branch changes", () => {
    for (let i = 0; i < 100; i++) {
      const kind = i % 2 ? "person" : "group";
      const result = activePath(flow, {
        kind,
        groupName: `Group ${i}`,
        secret: "stale",
      });
      expect(Object.hasOwn(result.payload, "groupName")).toBe(kind === "group");
      expect(Object.hasOwn(result.payload, "secret")).toBe(false);
    }
  });
});
