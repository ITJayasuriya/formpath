import { describe, expect, it } from "vitest";
import { loan, loanAnswers } from "../fixtures/flows";
import { parseDefinition } from "./definition";
import { initialState, transition } from "./navigation";
import { prepareSubmission, validate } from "./path";

const reversed = { ...loanAnswers, endDate: "2026-11-30" };
const error = {
  stepId: "dates",
  fieldId: "endDate",
  translationKey: "dateOrder",
};
describe("step date ordering", () => {
  it("blocks progression and submission and focuses the summary", () => {
    expect(validate(loan, reversed, "dates")).toEqual([error]);
    expect(validate(loan, reversed, "equipment")).toEqual([]);
    expect(prepareSubmission(loan, reversed)).toEqual({
      status: "invalid",
      errors: [error],
    });
    const state = {
      ...initialState(loan, reversed),
      location: { type: "step" as const, stepId: "dates" },
    };
    expect(transition(loan, state, { type: "next" })).toMatchObject({
      errors: [error],
      focus: { type: "errors" },
      state,
    });
    expect(
      transition(loan, state, { type: "open", target: { type: "review" } })
        .state.location,
    ).toEqual(state.location);
  });
  it("allows same-day loans and compares calendar dates across years", () => {
    expect(
      validate(loan, { ...loanAnswers, endDate: loanAnswers.startDate }),
    ).toEqual([]);
    expect(
      validate(loan, {
        ...loanAnswers,
        startDate: "2026-12-31",
        endDate: "2027-01-01",
      }),
    ).toEqual([]);
  });
  it("leaves missing and malformed dates to field validation", () => {
    expect(validate(loan, { ...loanAnswers, endDate: "" })).toEqual([
      { ...error, translationKey: "required" },
    ]);
    expect(validate(loan, { ...loanAnswers, endDate: "2026-02-30" })).toEqual([
      { ...error, translationKey: "invalid" },
    ]);
  });
  it("ignores rules whose fields or steps are hidden", () => {
    const flow = parseDefinition({
      ...loan,
      steps: loan.steps.map((step) =>
        step.id === "dates"
          ? {
              ...step,
              fields: step.fields.map((field) =>
                field.id === "endDate"
                  ? {
                      ...field,
                      visibleWhen: {
                        op: "equals",
                        field: "borrower",
                        value: "organisation",
                      },
                    }
                  : field,
              ),
            }
          : step,
      ),
    });
    expect(validate(flow, reversed)).toEqual([]);
    const hidden = parseDefinition({
      ...loan,
      steps: loan.steps.map((step) =>
        step.id === "dates"
          ? {
              ...step,
              visibleWhen: {
                op: "equals",
                field: "borrower",
                value: "organisation",
              },
            }
          : step,
      ),
    });
    expect(validate(hidden, reversed)).toEqual([]);
  });
  it.each([
    { kind: "dateOrder", startField: "startDate", endField: "missing" },
    { kind: "dateOrder", startField: "startDate", endField: "startDate" },
    { kind: "dateOrder", startField: "equipment", endField: "endDate" },
    { kind: "script", startField: "startDate", endField: "endDate" },
  ])("rejects invalid rule definitions %j", (rule) => {
    expect(() =>
      parseDefinition({
        ...loan,
        steps: loan.steps.map((step) =>
          step.id === "dates" ? { ...step, rules: [rule] } : step,
        ),
      }),
    ).toThrow();
  });
});

it("returns a corrected date edit to review without dropping hidden drafts", () => {
  const review = {
    answers: loanAnswers,
    location: { type: "review" as const },
  };
  const edit = transition(loan, review, { type: "edit", fieldId: "endDate" });
  expect(edit.focus).toEqual({ type: "field", fieldId: "endDate" });
  const changed = transition(loan, edit.state, {
    type: "answer",
    fieldId: "endDate",
    value: "2026-11-30",
  });
  expect(transition(loan, changed.state, { type: "next" }).focus).toEqual({
    type: "errors",
  });
  const fixed = transition(loan, changed.state, {
    type: "answer",
    fieldId: "endDate",
    value: "2026-12-05",
  });
  const returned = transition(loan, fixed.state, { type: "next" });
  expect(returned.state.location).toEqual({ type: "review" });
  expect(returned.state.answers.organisationName).toBe(
    loanAnswers.organisationName,
  );
  const submission = prepareSubmission(loan, returned.state.answers);
  expect(submission.status).toBe("valid");
  expect(
    submission.status === "valid" &&
      Object.hasOwn(submission.payload, "organisationName"),
  ).toBe(false);
});
