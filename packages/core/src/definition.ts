import { z } from "zod";

export type Answer = string | boolean | string[];
export type Answers = Readonly<Record<string, Answer>>;
export type Condition =
  | { op: "equals"; field: string; value: string | boolean }
  | { op: "oneOf"; field: string; values: (string | boolean)[] }
  | { op: "all" | "any"; conditions: Condition[] }
  | { op: "not"; condition: Condition };

const id = z.string().regex(/^[a-z][a-zA-Z0-9-]{0,63}$/);
const scalar = z.union([z.string().max(1000), z.boolean()]);
// Bound recursion before parsing, including cyclic objects supplied by JS callers.
function conditionSchema(depth: number): z.ZodType<Condition> {
  if (depth === 0) return z.never();
  const child = z.lazy(() => conditionSchema(depth - 1));
  return z.discriminatedUnion("op", [
    z.strictObject({ op: z.literal("equals"), field: id, value: scalar }),
    z.strictObject({
      op: z.literal("oneOf"),
      field: id,
      values: z.array(scalar).min(1).max(50),
    }),
    z.strictObject({
      op: z.literal("all"),
      conditions: z.array(child).min(1).max(10),
    }),
    z.strictObject({
      op: z.literal("any"),
      conditions: z.array(child).min(1).max(10),
    }),
    z.strictObject({ op: z.literal("not"), condition: child }),
  ]);
}
const visibleWhen = conditionSchema(8).optional();
const fieldBase = {
  id,
  label: z.string().min(1).max(500),
  required: z.boolean().default(false),
  visibleWhen,
};
const options = z
  .array(z.string().min(1).max(1000))
  .min(1)
  .max(100)
  .refine((v) => new Set(v).size === v.length, "Duplicate options");
export const fieldSchema = z.discriminatedUnion("kind", [
  z.strictObject({ ...fieldBase, kind: z.literal("text") }),
  z.strictObject({ ...fieldBase, kind: z.literal("boolean") }),
  z.strictObject({ ...fieldBase, kind: z.literal("date") }),
  z.strictObject({ ...fieldBase, kind: z.literal("choice"), options }),
  z.strictObject({ ...fieldBase, kind: z.literal("multiChoice"), options }),
]);
const stepSchema = z.strictObject({
  id,
  title: z.string().min(1).max(500),
  visibleWhen,
  fields: z.array(fieldSchema).min(1).max(100),
  rules: z
    .array(
      z.strictObject({
        kind: z.literal("dateOrder"),
        startField: id,
        endField: id,
      }),
    )
    .max(100)
    .default([]),
});
const definitionSchema = z.strictObject({
  id,
  version: z.number().int().positive(),
  steps: z.array(stepSchema).min(1).max(100),
});
export type Field = z.infer<typeof fieldSchema>;
export type Step = z.infer<typeof stepSchema>;
export type FlowDefinition = z.infer<typeof definitionSchema>;

function references(condition: Condition): string[] {
  switch (condition.op) {
    case "equals":
    case "oneOf":
      return [condition.field];
    case "not":
      return references(condition.condition);
    case "all":
    case "any":
      return condition.conditions.flatMap(references);
  }
}

/** Parse at load time. Conditions may depend only on declared fields in earlier steps. */
export function parseDefinition(input: unknown): FlowDefinition {
  const flow = definitionSchema.parse(input);
  const steps = new Set<string>();
  const fields = new Set<string>();
  for (const step of flow.steps) {
    if (steps.has(step.id)) throw new Error(`Duplicate step: ${step.id}`);
    steps.add(step.id);
    for (const condition of [
      step.visibleWhen,
      ...step.fields.map((f) => f.visibleWhen),
    ]) {
      if (condition && references(condition).some((ref) => !fields.has(ref))) {
        throw new Error(
          `Condition in ${step.id} must reference earlier fields`,
        );
      }
    }
    for (const rule of step.rules) {
      const start = step.fields.find((field) => field.id === rule.startField);
      const end = step.fields.find((field) => field.id === rule.endField);
      if (
        rule.startField === rule.endField ||
        start?.kind !== "date" ||
        end?.kind !== "date"
      ) {
        throw new Error(
          `Date order in ${step.id} requires two distinct date fields in that step`,
        );
      }
    }
    for (const field of step.fields) {
      if (fields.has(field.id)) throw new Error(`Duplicate field: ${field.id}`);
      fields.add(field.id);
    }
  }
  return flow;
}

type DefinedField<F> =
  F extends z.input<typeof fieldSchema> ? F & { required: boolean } : never;
type DefinedStep<S> =
  S extends z.input<typeof stepSchema>
    ? Omit<S, "fields" | "rules"> & {
        fields: DefinedField<S["fields"][number]>[];
        rules: Step["rules"];
      }
    : never;
type DefinedFlow<T extends z.input<typeof definitionSchema>> = Omit<
  T,
  "steps"
> & {
  steps: DefinedStep<T["steps"][number]>[];
};

/** Preserve literal IDs/options for authored flows; unknown data uses parseDefinition. */
export function defineFlow<const T extends z.input<typeof definitionSchema>>(
  input: T,
): DefinedFlow<T>;
export function defineFlow(input: unknown): FlowDefinition {
  return parseDefinition(input);
}

type ValueFor<F extends Field> = F extends { kind: "boolean" }
  ? boolean
  : F extends { kind: "choice"; options: (infer O extends string)[] }
    ? O
    : F extends { kind: "multiChoice"; options: (infer O extends string)[] }
      ? O[]
      : string;

/** Drafts are partial: required fields may be unanswered or on a hidden branch. */
export type AnswersFor<D extends FlowDefinition> = {
  [F in D["steps"][number]["fields"][number] as F["id"]]?: ValueFor<F>;
};
