import { describe, expect, it } from "vitest";
import { loan, loanAnswers, volunteer } from "../fixtures/flows";
import { initialState, transition, type FlowState } from "./navigation";
import { prepareSubmission } from "./path";

describe("loan navigation", () => {
  const review: FlowState = {
    answers: loanAnswers,
    location: { type: "review" },
  };
  it("walks the complete individual path and excludes organisation data", () => {
    let state = initialState(loan, loanAnswers);
    for (const stepId of ["borrower", "dates"]) {
      const next = transition(loan, state, { type: "next" });
      expect(next.focus).toEqual({ type: "heading" });
      expect(next.state.location).toEqual({ type: "step", stepId });
      state = next.state;
    }
    expect(transition(loan, state, { type: "next" }).state.location).toEqual({
      type: "review",
    });
    const result = prepareSubmission(loan, state.answers);
    expect(
      result.status === "valid" &&
        Object.hasOwn(result.payload, "organisationName"),
    ).toBe(false);
  });
  it("focuses errors on failed next, but back preserves incomplete answers", () => {
    const state: FlowState = {
      answers: { equipment: "drill" },
      location: { type: "step", stepId: "borrower" },
    };
    expect(transition(loan, state, { type: "next" })).toMatchObject({
      focus: { type: "errors" },
      errors: [{ fieldId: "borrower" }],
    });
    expect(transition(loan, state, { type: "back" })).toMatchObject({
      state: { answers: state.answers, location: { stepId: "equipment" } },
      errors: [],
    });
  });
  it("returns to the exact field and review after a correction", () => {
    const edit = transition(loan, review, {
      type: "edit",
      fieldId: "startDate",
    });
    expect(edit.focus).toEqual({ type: "field", fieldId: "startDate" });
    expect(
      transition(loan, edit.state, { type: "next" }).state.location,
    ).toEqual({ type: "review" });
  });
  it("does not skip new required branches when editing from review", () => {
    const edit = transition(loan, review, {
      type: "edit",
      fieldId: "borrower",
    }).state;
    const answers = { ...edit.answers };
    delete answers.organisationName;
    const changed = transition(
      loan,
      { ...edit, answers },
      { type: "answer", fieldId: "borrower", value: "organisation" },
    );
    const required = transition(loan, changed.state, { type: "next" });
    expect(required.state.location).toEqual({
      type: "step",
      stepId: "organisation",
      returnToReview: true,
    });
    const filled = transition(loan, required.state, {
      type: "answer",
      fieldId: "organisationName",
      value: "Synthetic group",
    });
    expect(
      transition(loan, filled.state, { type: "next" }).state.location,
    ).toEqual({ type: "review" });
  });
  it("reports hidden fields without deleting them or moving focus while typing", () => {
    const state: FlowState = {
      answers: { ...loanAnswers, borrower: "organisation" },
      location: { type: "step", stepId: "borrower" },
    };
    const changed = transition(loan, state, {
      type: "answer",
      fieldId: "borrower",
      value: "individual",
    });
    expect(changed.hiddenFieldIds).toEqual(["organisationName"]);
    expect(changed.state.answers.organisationName).toBe("Synthetic workshop");
    expect(changed.focus).toBeNull();
  });
  it("guards review, future, hidden and unknown deep links", () => {
    for (const stepId of ["review", "dates", "organisation", "missing"]) {
      expect(
        transition(loan, initialState(loan), {
          type: "open",
          target:
            stepId === "review" ? { type: "review" } : { type: "step", stepId },
        }).state.location,
      ).toEqual({ type: "step", stepId: "equipment" });
    }
    expect(transition(loan, review, { type: "back" }).state.location).toEqual({
      type: "step",
      stepId: "dates",
    });
    expect(
      transition(loan, review, { type: "edit", fieldId: "organisationName" })
        .focus,
    ).toBeNull();
    expect(() =>
      transition(loan, review, {
        type: "answer",
        fieldId: "unknown",
        value: true,
      }),
    ).toThrow();
  });
  it("reuses the model for volunteer role and multiple skills", () => {
    expect(
      prepareSubmission(volunteer, {
        role: "welcome",
        skills: ["electronics"],
        available: false,
      }),
    ).toEqual({
      status: "valid",
      payload: { role: "welcome", available: false },
    });
    expect(
      prepareSubmission(volunteer, {
        role: "repair",
        skills: ["electronics", "electronics"],
        available: true,
      }).status,
    ).toBe("invalid");
    expect(
      prepareSubmission(volunteer, {
        role: "repair",
        skills: ["textiles"],
        available: true,
      }).status,
    ).toBe("valid");
  });
});
