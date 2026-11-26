import { ErrorSummary } from "../packages/react/src/ErrorSummary";
import { useState } from "react";
import { loan } from "../packages/core/fixtures/flows";
import { prepareSubmission, type ValidationError } from "../packages/core/src";
import { useFlow } from "../packages/react/src/useFlow";

const messages: Record<ValidationError["translationKey"], string> = {
  required: "Enter an answer before continuing.",
  invalid: "Enter a valid answer.",
  dateOrder: "End date must be on or after start date.",
};
const labels = Object.fromEntries(
  loan.steps.flatMap((step) =>
    step.fields.map((field) => [field.id, field.label]),
  ),
);

export function LoanApp() {
  const flow = useFlow(loan);
  const [receipt, setReceipt] = useState(false);
  const { state, dispatch, path } = flow;
  const current = state.location;
  const step =
    current.type === "step"
      ? path.steps.find((step) => step.id === current.stepId)
      : undefined;
  const position = step ? path.steps.indexOf(step) + 1 : path.steps.length + 1;
  return (
    <>
      <header>
        <a href="/" className="brand">
          FormPath<span>Community equipment library · synthetic demo</span>
        </a>
      </header>
      <main>
        <div className="intro">
          <p className="eyebrow">Borrow something useful</p>
          <p>
            Try a conditional loan request. Use fictitious details only. Nothing
            is sent to an organisation.
          </p>
        </div>
        <div className="flow-layout" ref={flow.root}>
          <nav aria-label="Request progress">
            <p className="eyebrow">Your request</p>
            <ol>
              {path.steps.map((item, index) => (
                <li
                  key={item.id}
                  aria-current={step?.id === item.id ? "step" : undefined}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.title}
                </li>
              ))}
              <li aria-current={current.type === "review" ? "step" : undefined}>
                <span>{String(path.steps.length + 1).padStart(2, "0")}</span>
                Check answers
              </li>
            </ol>
          </nav>
          <section aria-labelledby="flow-heading" className="form-sheet">
            <p className="eyebrow">
              {receipt
                ? "Demo complete"
                : `Step ${position} of ${path.steps.length + 1}`}
            </p>
            <h1 id="flow-heading" tabIndex={-1}>
              {receipt
                ? "Your demo receipt"
                : (step?.title ?? "Check your answers")}
            </h1>
            <p className="memory-note">
              Memory only — reloading clears your answers.
            </p>
            <div role="status">
              {flow.hiddenFieldIds.length > 0 && (
                <p className="notice">
                  Your branch changed. Hidden answers are kept for this visit
                  and excluded from the review and demo payload.
                </p>
              )}
            </div>
            <ErrorSummary errors={flow.errors}>
              {(error) => (
                <>
                  {labels[error.fieldId]}: {messages[error.translationKey]}
                </>
              )}
            </ErrorSummary>
            {receipt ? (
              <>
                <p className="notice">
                  This is a local demonstration. No application was submitted,
                  no equipment was reserved, and no organisation received your
                  details.
                </p>
                <h2>Demo payload</h2>
                <pre>{JSON.stringify(path.payload, null, 2)}</pre>
                <a href="/">Start a new demo</a>
              </>
            ) : step ? (
              <form
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  dispatch({ type: "next" });
                }}
              >
                {step.fields.map((field) => {
                  const error = flow.errors.find(
                    (error) => error.fieldId === field.id,
                  );
                  const describedBy = error ? `error-${field.id}` : undefined;
                  const value = state.answers[field.id];
                  return (
                    <div className="question" key={field.id}>
                      {field.kind === "choice" ? (
                        <fieldset
                          id={`field-${field.id}`}
                          aria-describedby={describedBy}
                          aria-invalid={!!error}
                        >
                          <legend>{field.label}</legend>
                          {field.options.map((option) => (
                            <label className="choice" key={option}>
                              <input
                                type="radio"
                                name={field.id}
                                value={option}
                                checked={value === option}
                                onChange={() =>
                                  dispatch({
                                    type: "answer",
                                    fieldId: field.id,
                                    value: option,
                                  })
                                }
                              />
                              <span>
                                {option[0]?.toUpperCase()}
                                {option.slice(1)}
                              </span>
                            </label>
                          ))}
                        </fieldset>
                      ) : (
                        <>
                          <label htmlFor={`field-${field.id}`}>
                            {field.label}
                          </label>
                          <input
                            id={`field-${field.id}`}
                            type={field.kind === "date" ? "date" : "text"}
                            value={typeof value === "string" ? value : ""}
                            aria-describedby={describedBy}
                            aria-invalid={!!error}
                            onChange={(event) =>
                              dispatch({
                                type: "answer",
                                fieldId: field.id,
                                value: event.target.value,
                              })
                            }
                          />
                        </>
                      )}
                      {error && (
                        <p className="field-error" id={describedBy}>
                          {messages[error.translationKey]}
                        </p>
                      )}
                    </div>
                  );
                })}
                <div className="actions">
                  <button type="submit">
                    {current.type === "step" && current.returnToReview
                      ? "Confirm changes"
                      : "Continue"}
                    <span aria-hidden="true"> →</span>
                  </button>
                  {position > 1 && (
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => dispatch({ type: "back" })}
                    >
                      Back
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <>
                <p>
                  Only answers relevant to your current request appear here.
                </p>
                <dl className="review">
                  {path.steps.flatMap((item) =>
                    item.fields.map((field) => (
                      <div key={field.id}>
                        <dt>{field.label}</dt>
                        <dd>
                          <bdi>
                            {String(path.payload[field.id] ?? "Not provided")}
                          </bdi>
                          <button
                            className="change"
                            onClick={() =>
                              dispatch({ type: "edit", fieldId: field.id })
                            }
                          >
                            Change
                            <span className="sr-only"> {field.label}</span>
                          </button>
                        </dd>
                      </div>
                    )),
                  )}
                </dl>
                <div className="actions">
                  <button
                    onClick={() => {
                      if (
                        prepareSubmission(loan, state.answers).status ===
                        "valid"
                      ) {
                        setReceipt(true);
                        requestAnimationFrame(() =>
                          document.getElementById("flow-heading")?.focus(),
                        );
                      } else
                        dispatch({ type: "open", target: { type: "review" } });
                    }}
                  >
                    Generate demo receipt
                  </button>
                  <button
                    className="secondary"
                    onClick={() => dispatch({ type: "back" })}
                  >
                    Back
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
      <footer>
        <a href="https://github.com/ITJayasuriya/formpath">
          Source and contribution guide
        </a>
        <span data-revision={__BUILD_REVISION__}>
          FormPath · internal alpha · {__BUILD_REVISION__.slice(0, 7)}
        </span>
      </footer>
    </>
  );
}
