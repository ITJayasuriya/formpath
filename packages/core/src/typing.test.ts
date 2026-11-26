import { expect, expectTypeOf, it } from "vitest";
import { defineFlow, type AnswersFor } from "./index";
import { loan, volunteer } from "../fixtures/flows";

it("infers partial answer values from authored field IDs and options", () => {
  type Loan = AnswersFor<typeof loan>;
  type Volunteer = AnswersFor<typeof volunteer>;
  expectTypeOf<Loan["equipment"]>().toEqualTypeOf<
    "drill" | "projector" | undefined
  >();
  expectTypeOf<Loan["startDate"]>().toEqualTypeOf<string | undefined>();
  expectTypeOf<Volunteer["available"]>().toEqualTypeOf<boolean | undefined>();
  expectTypeOf<Volunteer["skills"]>().toEqualTypeOf<
    ("textiles" | "electronics")[] | undefined
  >();
  const draft: Loan = {};
  // @ts-expect-error Unknown field IDs must not become accepted answers.
  draft.unknown = "no";
  // @ts-expect-error Choice answers must come from declared options.
  draft.equipment = "van";
  const volunteerDraft: Volunteer = { available: false, skills: ["textiles"] };
  // @ts-expect-error Boolean answers must not be strings.
  volunteerDraft.available = "false";
  // @ts-expect-error Multi-choice values must come from declared options.
  volunteerDraft.skills = ["cooking"];
});

it("validates authored definitions at runtime and preserves schema defaults", () => {
  const flow = defineFlow({
    id: "tiny",
    version: 1,
    steps: [
      {
        id: "first",
        title: "First",
        fields: [{ id: "name", kind: "text", label: "Name" }],
      },
    ],
  });
  expect(flow.steps[0]!.fields[0]!.required).toBe(false);
  expect(flow.steps[0]!.rules).toEqual([]);
  expect(() => defineFlow({ ...flow, version: 0 })).toThrow();
});
