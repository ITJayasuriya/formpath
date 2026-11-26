import { describe, expect, it } from "vitest";
import { parseDefinition } from "./definition";
const first = {
  id: "start",
  title: "Start",
  fields: [
    { id: "kind", label: "Kind", kind: "choice", options: ["person", "group"] },
  ],
};
const later = {
  id: "details",
  title: "Details",
  visibleWhen: { op: "equals", field: "kind", value: "group" },
  fields: [{ id: "name", label: "Group name", kind: "text" }],
};

describe("definition boundary", () => {
  it("accepts earlier-step conditions and defaults optional fields", () => {
    expect(
      parseDefinition({ id: "loan", version: 1, steps: [first, later] })
        .steps[0]?.fields[0]?.required,
    ).toBe(false);
  });
  it.each([
    [first, first],
    [first, { ...later, fields: first.fields }],
    [later, first],
    [{ ...first, visibleWhen: later.visibleWhen }],
    [
      first,
      {
        ...later,
        visibleWhen: { op: "equals", field: "missing", value: true },
      },
    ],
    [first, { ...later, visibleWhen: { op: "script", source: "true" } }],
    [{ ...first, extra: true }],
    [{ ...first, fields: [{ ...first.fields[0], options: ["same", "same"] }] }],
  ])(
    "rejects invalid identifiers, references and operators: %j",
    (...steps) => {
      expect(() =>
        parseDefinition({ id: "loan", version: 1, steps }),
      ).toThrow();
    },
  );
  it("rejects deeply nested and cyclic conditions without stack overflow", () => {
    const cycle: { op: string; condition?: unknown } = { op: "not" };
    cycle.condition = cycle;
    expect(() =>
      parseDefinition({
        id: "loan",
        version: 1,
        steps: [first, { ...later, visibleWhen: cycle }],
      }),
    ).toThrow();
  });
});

describe("condition operand compatibility", () => {
  it.each([
    [{ kind: "boolean" }, "true"],
    [{ kind: "text" }, false],
    [{ kind: "date" }, "2027-02-29"],
    [{ kind: "choice", options: ["yes"] }, "no"],
    [{ kind: "multiChoice", options: ["yes"] }, "yes"],
  ])("rejects impossible scalar comparisons %j", (shape, value) => {
    expect(() =>
      parseDefinition({
        id: "test",
        version: 1,
        steps: [
          {
            id: "first",
            title: "First",
            fields: [{ id: "value", label: "Value", ...shape }],
          },
          {
            id: "last",
            title: "Last",
            visibleWhen: {
              op: "not",
              condition: { op: "oneOf", field: "value", values: [value] },
            },
            fields: [{ id: "note", label: "Note", kind: "text" }],
          },
        ],
      }),
    ).toThrow("Condition values do not match field");
  });
  it.each([
    [{ kind: "boolean" }, false],
    [{ kind: "text" }, "example"],
    [{ kind: "date" }, "2028-02-29"],
    [{ kind: "choice", options: ["yes"] }, "yes"],
  ])("accepts compatible comparison %j", (shape, value) => {
    expect(() =>
      parseDefinition({
        id: "test",
        version: 1,
        steps: [
          {
            id: "first",
            title: "First",
            fields: [{ id: "value", label: "Value", ...shape }],
          },
          {
            id: "last",
            title: "Last",
            visibleWhen: { op: "equals", field: "value", value },
            fields: [{ id: "note", label: "Note", kind: "text" }],
          },
        ],
      }),
    ).not.toThrow();
  });
});
