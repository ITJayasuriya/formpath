import { z } from "zod";
import type {
  Answers,
  Condition,
  Field,
  FlowDefinition,
  Step,
} from "./definition";

export function matches(
  condition: Condition | undefined,
  answers: Answers,
): boolean {
  if (!condition) return true;
  switch (condition.op) {
    case "equals":
      return (
        Object.hasOwn(answers, condition.field) &&
        answers[condition.field] === condition.value
      );
    case "oneOf":
      return (
        Object.hasOwn(answers, condition.field) &&
        condition.values.some((value) => answers[condition.field] === value)
      );
    case "all":
      return condition.conditions.every((child) => matches(child, answers));
    case "any":
      return condition.conditions.some((child) => matches(child, answers));
    case "not":
      return !matches(condition.condition, answers);
  }
}

/** Hidden answers cannot activate downstream branches, even while retained in a draft. */
export function activePath(flow: FlowDefinition, answers: Answers) {
  const payload: Record<string, string | boolean | string[]> = {};
  const steps: Step[] = [];
  for (const step of flow.steps) {
    if (!matches(step.visibleWhen, payload)) continue;
    const fields = step.fields.filter((field) =>
      matches(field.visibleWhen, payload),
    );
    if (!fields.length) continue;
    steps.push({ ...step, fields });
    for (const field of fields) {
      if (Object.hasOwn(answers, field.id)) {
        const value = answers[field.id];
        if (value !== undefined)
          payload[field.id] = Array.isArray(value) ? [...value] : value;
      }
    }
  }
  return { steps, payload };
}

export type ValidationError = {
  stepId: string;
  fieldId: string;
  translationKey: "required" | "invalid" | "dateOrder";
};
const dateOnly = z.iso.date();
function valid(field: Field, value: unknown): boolean {
  switch (field.kind) {
    case "text":
      return typeof value === "string";
    case "boolean":
      return typeof value === "boolean";
    case "date":
      return dateOnly.safeParse(value).success;
    case "choice":
      return typeof value === "string" && field.options.includes(value);
    case "multiChoice":
      return (
        Array.isArray(value) &&
        value.every(
          (v) => typeof v === "string" && field.options.includes(v),
        ) &&
        new Set(value).size === value.length
      );
  }
}
export function validate(
  flow: FlowDefinition,
  answers: Answers,
  stepId?: string,
): ValidationError[] {
  return activePath(flow, answers)
    .steps.filter((step) => !stepId || step.id === stepId)
    .flatMap((step) => {
      const errors = step.fields.flatMap<ValidationError>((field) => {
        const value = Object.hasOwn(answers, field.id)
          ? answers[field.id]
          : undefined;
        const empty =
          value === undefined ||
          (typeof value === "string" && !value.trim()) ||
          (Array.isArray(value) && !value.length);
        if (empty)
          return field.required
            ? [
                {
                  stepId: step.id,
                  fieldId: field.id,
                  translationKey: "required" as const,
                },
              ]
            : [];
        return valid(field, value)
          ? []
          : [
              {
                stepId: step.id,
                fieldId: field.id,
                translationKey: "invalid" as const,
              },
            ];
      });
      const activeIds = new Set(step.fields.map((field) => field.id));
      for (const rule of step.rules) {
        const start = Object.hasOwn(answers, rule.startField)
          ? answers[rule.startField]
          : undefined;
        const end = Object.hasOwn(answers, rule.endField)
          ? answers[rule.endField]
          : undefined;
        if (
          activeIds.has(rule.startField) &&
          activeIds.has(rule.endField) &&
          typeof start === "string" &&
          typeof end === "string" &&
          dateOnly.safeParse(start).success &&
          dateOnly.safeParse(end).success &&
          end < start
        ) {
          errors.push({
            stepId: step.id,
            fieldId: rule.endField,
            translationKey: "dateOrder",
          });
        }
      }
      return errors;
    });
}

/** Call immediately before handing a payload to an application-owned adapter. */
export function prepareSubmission(flow: FlowDefinition, answers: Answers) {
  const errors = validate(flow, answers);
  return errors.length
    ? { status: "invalid" as const, errors }
    : { status: "valid" as const, payload: activePath(flow, answers).payload };
}
