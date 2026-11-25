import type { Answer, Answers, FlowDefinition } from "./definition";
import { activePath, validate, type ValidationError } from "./path";

export type Location =
  { type: "step"; stepId: string; returnToReview?: true } | { type: "review" };
export type FlowState = { answers: Answers; location: Location };
export type FlowEvent =
  | { type: "answer"; fieldId: string; value: Answer }
  | { type: "next" }
  | { type: "back" }
  | {
      type: "open";
      target: { type: "step"; stepId: string } | { type: "review" };
    }
  | { type: "edit"; fieldId: string };
export type Focus =
  { type: "heading" } | { type: "field"; fieldId: string } | { type: "errors" };
export type Transition = {
  state: FlowState;
  errors: ValidationError[];
  focus: Focus | null;
  hiddenFieldIds: string[];
};

export function initialState(
  flow: FlowDefinition,
  answers: Answers = {},
): FlowState {
  const first = activePath(flow, answers).steps[0];
  return {
    answers,
    location: first ? { type: "step", stepId: first.id } : { type: "review" },
  };
}

/** URL targets are IDs only; answers and successful receipts never come from a URL. */
export function transition(
  flow: FlowDefinition,
  state: FlowState,
  event: FlowEvent,
): Transition {
  const path = activePath(flow, state.answers).steps;
  const result = (
    location: Location,
    focus: Focus | null = { type: "heading" },
    errors: ValidationError[] = [],
  ): Transition => ({
    state: { ...state, location },
    focus,
    errors,
    hiddenFieldIds: [],
  });
  switch (event.type) {
    case "answer": {
      if (
        !flow.steps.some((step) =>
          step.fields.some((field) => field.id === event.fieldId),
        )
      )
        throw new Error(`Unknown field: ${event.fieldId}`);
      const answers = {
        ...state.answers,
        [event.fieldId]: Array.isArray(event.value)
          ? [...event.value]
          : event.value,
      };
      const active = activePath(flow, answers).steps;
      const activeIds = new Set(
        active.flatMap((step) => step.fields.map((field) => field.id)),
      );
      const hiddenFieldIds = path
        .flatMap((step) => step.fields.map((field) => field.id))
        .filter((id) => !activeIds.has(id));
      const lostStep =
        state.location.type === "step" &&
        !active.some(
          (step) =>
            state.location.type === "step" && step.id === state.location.stepId,
        );
      const location = lostStep
        ? initialState(flow, answers).location
        : state.location;
      return {
        state: { answers, location },
        errors: [],
        focus: lostStep ? { type: "heading" } : null,
        hiddenFieldIds,
      };
    }
    case "edit": {
      if (state.location.type !== "review") return result(state.location, null);
      const step = path.find((step) =>
        step.fields.some((field) => field.id === event.fieldId),
      );
      return step
        ? result(
            { type: "step", stepId: step.id, returnToReview: true },
            { type: "field", fieldId: event.fieldId },
          )
        : result(state.location, null);
    }
    case "open": {
      const target = event.target;
      const requested =
        target.type === "step"
          ? path.findIndex((step) => step.id === target.stepId)
          : path.length;
      const firstError = validate(flow, state.answers)[0];
      const blocked =
        firstError &&
        (requested < 0 ||
          path.findIndex((step) => step.id === firstError.stepId) < requested);
      if (blocked) return result({ type: "step", stepId: firstError.stepId });
      if (target.type === "review") return result({ type: "review" });
      return result(
        requested >= 0 ? target : initialState(flow, state.answers).location,
      );
    }
    case "back": {
      const index =
        state.location.type === "review"
          ? path.length
          : path.findIndex(
              (step) =>
                state.location.type === "step" &&
                step.id === state.location.stepId,
            );
      const previous = path[Math.max(0, index - 1)];
      return result(
        previous ? { type: "step", stepId: previous.id } : { type: "review" },
      );
    }
    case "next": {
      if (state.location.type === "review") return result(state.location, null);
      const current = state.location;
      const index = path.findIndex((step) => step.id === current.stepId);
      if (index < 0) return result(initialState(flow, state.answers).location);
      const errors = validate(flow, state.answers, current.stepId);
      if (errors.length) return result(current, { type: "errors" }, errors);
      const allErrors = validate(flow, state.answers);
      const firstError = allErrors[0];
      if (
        firstError &&
        (current.returnToReview ||
          path.findIndex((step) => step.id === firstError.stepId) < index)
      ) {
        return result({
          type: "step",
          stepId: firstError.stepId,
          ...(current.returnToReview
            ? { returnToReview: current.returnToReview }
            : {}),
        });
      }
      if (current.returnToReview) return result({ type: "review" });
      const next = path[index + 1];
      return result(
        next ? { type: "step", stepId: next.id } : { type: "review" },
      );
    }
  }
}
