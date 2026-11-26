import { useLayoutEffect, useReducer, useRef } from "react";
import {
  activePath,
  initialState,
  transition,
  validate,
  type FlowDefinition,
  type FlowEvent,
  type Transition,
} from "../../core/src";

/** Memory-only binding. Core owns answers, navigation and validation policy. */
export function useFlow(definition: FlowDefinition) {
  const [result, dispatch] = useReducer(
    (previous: Transition, event: FlowEvent): Transition => {
      const next = transition(definition, previous.state, event);
      if (event.type !== "answer") return next;
      return {
        ...next,
        hiddenFieldIds: [
          ...new Set([...previous.hiddenFieldIds, ...next.hiddenFieldIds]),
        ],
        // Revalidate after an attempted progression, without moving typing focus.
        errors:
          previous.errors.length && next.state.location.type === "step"
            ? validate(
                definition,
                next.state.answers,
                next.state.location.stepId,
              )
            : [],
      };
    },
    {
      state: initialState(definition),
      errors: [],
      focus: null,
      hiddenFieldIds: [],
    },
  );
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const focus = result.focus;
    if (!focus) return;
    const id =
      focus.type === "field"
        ? `field-${focus.fieldId}`
        : focus.type === "errors"
          ? "flow-errors"
          : "flow-heading";
    const target = root.current?.querySelector<HTMLElement>(`[id="${id}"]`);
    (target?.matches("fieldset")
      ? target.querySelector<HTMLInputElement>("input")
      : target
    )?.focus();
  }, [result]);
  return {
    ...result,
    dispatch,
    root,
    path: activePath(definition, result.state.answers),
  };
}
