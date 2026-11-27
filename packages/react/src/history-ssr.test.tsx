import { renderToString } from "react-dom/server";
import { expect, it } from "vitest";
import { loan } from "../../core/fixtures/flows";
import { useFlow } from "./useFlow";
import { useFlowHistory } from "./useFlowHistory";

function ServerFlow() {
  const flow = useFlow(loan);
  const recovered = useFlowHistory(loan, flow);
  return (
    <main ref={flow.root}>
      <h1 id="flow-heading" tabIndex={-1}>
        {flow.state.location.type === "step" && flow.state.location.stepId}
      </h1>
      <p>{recovered ? "Recovered" : "Initial snapshot"}</p>
    </main>
  );
}

it("renders a deterministic empty snapshot without a browser or URL reads", () => {
  expect(typeof window).toBe("undefined");
  const html = renderToString(<ServerFlow />);
  expect(html).toContain("equipment");
  expect(html).toContain("Initial snapshot");
  expect(renderToString(<ServerFlow />)).toBe(html);
});
