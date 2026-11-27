import { useEffect, useRef, useState } from "react";
import { initialState, type FlowDefinition } from "../../core/src";
import type { useFlow } from "./useFlow";
import { flowHash, readFlowHash } from "./routes";

/** Opt-in, one flow per page. Browser effects run only after hydration. */
export function useFlowHistory(
  definition: FlowDefinition,
  flow: ReturnType<typeof useFlow>,
) {
  const [recovered, setRecovered] = useState(false);
  const pending = useRef<string | null>(null);
  const initialized = useRef(false);
  const { dispatch } = flow;
  useEffect(() => {
    const open = () => {
      pending.current = window.location.hash;
      dispatch({
        type: "open",
        target:
          readFlowHash(definition.id, window.location.hash) ??
          initialState(definition).location,
      });
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [definition, dispatch]);

  useEffect(() => {
    // Let the initial core open transition resolve before canonicalizing its URL.
    if (!initialized.current && flow.focus === null) return;
    initialized.current = true;
    const hash = flowHash(definition.id, flow.state.location);
    if (pending.current !== null) {
      setRecovered(pending.current !== "" && pending.current !== hash);
      window.history.replaceState(null, "", hash);
      pending.current = null;
    } else if (window.location.hash !== hash) {
      setRecovered(false);
      window.history.pushState(null, "", hash);
    }
  }, [definition.id, flow.state.location, flow.focus]);
  return recovered;
}
