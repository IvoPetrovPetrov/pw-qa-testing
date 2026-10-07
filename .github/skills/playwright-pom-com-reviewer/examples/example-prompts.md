# Example prompts

Sample ways this skill gets invoked.

## Review-only

> "Can you review [dialog-page.spec.ts](../../../../tests/dialog-page.spec.ts)'s page object? I want to know if the locators are solid before I add more tests against it."

> "Take a look at our IoT dashboard page object and component classes — anything you'd flag before we add the next feature's tests on top of them?"

> "Is this component class over-engineered? It's only used on one page."

Each of these stays in review mode: read the target and its surrounding context, produce the full report from `reference/output-template.md`, and stop — no files get touched.

## Review, then approved refactor

> "Review `IotDashboardPage.ts`." → (report comes back with F1-F5) → "Go ahead and fix F1 and F3, leave the rest for now."

This is a two-turn flow: the review happens first and stands on its own; the refactor only starts once the user names which finding IDs to act on. Don't collapse this into a single pass that reviews and fixes in the same turn unless the user's first message already says to.

## Narrow scope

> "Just check whether this locator is going to be flaky: `page.locator('div:nth-child(3) > button')`."

A narrow ask still gets the same rigor (check whether an accessible alternative exists, check for strict-mode/dynamic-content risk) but doesn't need the full report structure — a direct answer with the reasoning is enough.
