import type { ReactNode } from "react";
import type { ValidationError } from "../../core/src";
import { focusTarget } from "./focus";

/** Headless summary: applications supply messages and optional styles. */
export function ErrorSummary({
  errors,
  children,
}: {
  errors: ValidationError[];
  children: (error: ValidationError) => ReactNode;
}) {
  if (!errors.length) return null;
  return (
    <div
      className="error-summary"
      id="flow-errors"
      tabIndex={-1}
      aria-labelledby="error-title"
    >
      <h2 id="error-title">There is a problem</h2>
      <ul>
        {errors.map((error) => (
          <li key={error.fieldId}>
            <a
              href={`#field-${error.fieldId}`}
              onClick={(event) => {
                event.preventDefault();
                focusTarget(
                  event.currentTarget.ownerDocument.getElementById(
                    `field-${error.fieldId}`,
                  ),
                );
              }}
            >
              {children(error)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
