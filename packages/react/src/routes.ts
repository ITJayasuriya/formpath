import type { Location } from "../../core/src";

/** Static-host-safe routes contain IDs only, never answers or receipt claims. */
export function flowHash(flowId: string, location: Location): string {
  const base = `#/apply/${encodeURIComponent(flowId)}`;
  return location.type === "review"
    ? `${base}/review`
    : `${base}/step/${encodeURIComponent(location.stepId)}`;
}

export function readFlowHash(flowId: string, hash: string): Location | null {
  const base = `#/apply/${encodeURIComponent(flowId)}`;
  if (hash === `${base}/review`) return { type: "review" };
  const prefix = `${base}/step/`;
  if (!hash.startsWith(prefix)) return null;
  const id = hash.slice(prefix.length);
  if (!id || id.includes("/")) return null;
  try {
    return { type: "step", stepId: decodeURIComponent(id) };
  } catch {
    return null;
  }
}
