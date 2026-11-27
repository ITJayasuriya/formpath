import { describe, expect, it } from "vitest";
import { flowHash, readFlowHash } from "./routes";

describe("flow URL boundary", () => {
  it("round trips encoded IDs without carrying review return intent", () => {
    const location = {
      type: "step",
      stepId: "dates / 日",
      returnToReview: true,
    } as const;
    const hash = flowHash("loan / demo", location);
    expect(readFlowHash("loan / demo", hash)).toEqual({
      type: "step",
      stepId: location.stepId,
    });
    expect(readFlowHash("loan", flowHash("loan", { type: "review" }))).toEqual({
      type: "review",
    });
  });
  it.each([
    "",
    "#/apply/other/review",
    "#/apply/loan/receipt",
    "#/apply/loan/step/",
    "#/apply/loan/step/%E0%A4%A",
    "#/apply/loan/step/dates/extra",
    "#/apply/loan/review?answer=secret",
  ])("rejects unrecognized target %s", (hash) => {
    expect(readFlowHash("loan", hash)).toBeNull();
  });
});
