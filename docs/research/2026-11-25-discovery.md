# Discovery decision — 25 November 2026

No interviews, usability trials or independent integration trials have occurred.
The proposed two-developer/three-completer discovery gate remains unmet. Continue
with a reversible internal alpha and synthetic acceptance fixtures; do not call
this validated product demand or freeze a public API.

The repeated problem to test is retaining an organisation name after changing
borrower type, accidentally validating/submitting it, and skipping newly required
questions on a review edit. The core tests now reproduce those synthetic paths.
This is engineering evidence, not an observed participant failure.

Official references checked on this date:

- [GOV.UK check answers](https://design-system.service.gov.uk/patterns/check-answers/)
  supports review and correction before sending information. This informs the
  interaction contract; it does not validate demand for a new React package.
- [React Hook Form advanced patterns](https://react-hook-form.com/advanced-usage)
  already cover multi-step forms, conditional fields, validation and accessibility.
  Our tentative extraction is the combined navigation/projection/focus policy,
  while RHF remains responsible for field interaction. No claim that RHF cannot
  solve this workflow, and no measured productivity comparison exists yet.

Next research action: ask developers to reproduce the synthetic three-step
branch-edit scenario with their existing stack and this binding once available.
Record time, repeated policy code and constraints without inventing results.
If tested recipes are sufficient, prefer them over maintaining an unnecessary
package. No user contact or external messages were sent during this run.
