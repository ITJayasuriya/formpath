# Stable browser-test pin for ARIA reflection regression

27 November 2026. Playwright 1.65.1 is the latest npm stable release on this date;
1.66 is a development alpha. Its Firefox build 1572 has the upstream null-pointer
regression described in [Playwright #44135](https://github.com/microsoft/playwright/issues/44135)
and the linked Mozilla report. Reading ARIA relationships in the page (axe) and
isolated locator world can crash a named-region document. The failure matches
both loan journeys; required date semantics alone are not evidence of a defect.

Keep a static named-region/axe/label regression and a native required-date
control case. Retain all product journeys and accessibility scans across all
three engines. Pin the compatible stable test runner and its axe peer
`playwright-core` to 1.64.1; the explicit peer pin prevents npm retaining 1.65.1's
incompatible Page types. No casts, test skips, browser sandbox changes, production
markup workarounds or alpha dependencies. All three versions in the lockfile
must agree when updating. Re-evaluate this pin once a stable release includes
the Firefox fix, using this regression and the complete product suite.

This changes only development tooling. npm audit reports zero advisories for
the resolved tree. It is not a claim that older bundled browsers have no defects
or that audit covers browser-engine security. Browser binaries serve synthetic
local tests, not real user browsing. No application dependency was changed.

Strict self-review: focus remains in the shared React policy, navigation and
validation in core, native controls in the loan consumer. The largest changed
source file is below 300 lines. No new wrapper or production branch is needed.
The isolated tests establish the dependency boundary rather than adapting the
product to a tool crash. Independent human review is not claimed.
