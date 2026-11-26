/** A grouped field returns to its selected control, or its first control if empty. */
export function focusTarget(target: HTMLElement | null | undefined) {
  (target?.matches("fieldset")
    ? (target.querySelector<HTMLElement>("input:checked") ??
      target.querySelector<HTMLElement>("input, select, textarea"))
    : target
  )?.focus();
}
