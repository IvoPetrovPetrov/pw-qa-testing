# UI Review Checklist

Read this before Phase 3 (coverage gap analysis) and Phase 4 (individual test case review).

## Scope reminder

**In scope:** pages, layouts, components, page coverage; navigation, routes, menus, tabs, links, browser navigation; user interactions and complete user journeys; forms, input validation, submission, feedback; buttons, tables, dialogs, dropdowns, tooltips, dynamic elements; UI states (initial, loading, empty, success, error, disabled, recovery); assertions and expected results; positive/negative/boundary/alternative/error-handling scenarios; UX consistency and usability; responsive layouts and supported browsers; accessibility where relevant; visual consistency/visual regression where justified; UI regression coverage and manual-vs-automation suitability; test case duplication, clarity, maintainability, traceability.

**Out of scope:** direct API testing, backend/database testing, infrastructure/deployment testing, standalone performance/security/unit testing. A dependency on one of these may be *noted* when it affects user-visible behavior (e.g. "the UI's handling of a failed data load") but never expanded into a review of the dependency itself.

## Phase 3 — the 13 coverage areas

For each area, classify as **sufficiently covered / partially covered / missing / redundant / needs clarification**, and only if the area is actually applicable to this application. Don't manufacture a finding for an area the application genuinely doesn't have (e.g. don't flag "missing responsive coverage" for an internal desktop-only tool with a documented desktop-only requirement).

1. **Page and component coverage** — every documented page/component has at least one test case; no page is entirely unaddressed.
2. **Navigation and routing** — every documented route/link/menu/tab is exercised; back/forward, deep links, and invalid routes are considered where they matter.
3. **User interactions and state transitions** — clicks, drags, toggles, selections, and the resulting state change are verified, not just the interaction itself.
4. **Forms and validation** — required fields, format rules, boundary values, submission success/failure, and inline feedback are covered for every form the plan claims to cover.
5. **User journeys and end-to-end workflows** — the critical paths a real user takes (not just isolated components) are verified end to end, including hand-offs between steps.
6. **UI assertions and expected results** — see the assertion-quality bar below; this is usually where the most real defects hide.
7. **Loading, empty, error, success, and recovery states** — each state a component can be in is addressed, not only its default/happy state.
8. **UX consistency and usability** — flagged only against a documented requirement or a describable, reproducible usability defect — never against personal aesthetic taste.
9. **Responsive behavior and supported browsers** — only evaluated where the plan or supplied material documents a viewport/browser matrix; don't invent one that was never specified.
10. **Accessibility and keyboard interaction** — only evaluated where the plan or supplied material states an accessibility requirement, or where an obvious, describable barrier exists (e.g. a control with no visible focus state).
11. **Visual consistency / visual regression** — only where justified by a stable, high-value visual surface (e.g. a themeable dashboard) — not proposed as coverage for every pixel of every page.
12. **Smoke and regression coverage** — the plan identifies (or should identify) a minimal smoke set and a broader regression set; check whether the grouping makes sense given case priority and stability.
13. **Manual vs. automation suitability** — each case's manual/automation call is sound given its stability, value, and maintenance cost, not defaulted to "automate everything" or "manual everything."

## Phase 4 — individual test case quality bar

For each existing test case, check:

- **Title** — specific and action-oriented ("Submit login with valid credentials"), not generic ("Test login").
- **Objective** — clear what risk or behavior this case exists to verify.
- **Preconditions** — the required state before step 1 is stated, not implied.
- **Test data** — concrete values are given, or "any valid X" where the value genuinely doesn't matter.
- **Steps** — reproducible by someone who wasn't in the room when it was written: literal actions, not "test the form."
- **Expected results / assertions** — see the assertion-quality bar below.
- **Positive/negative/boundary coverage** — the case's type is correct for what it's actually testing.
- **Independence** — the case doesn't silently depend on another case's leftover state.
- **Duplication** — check whether another existing case already exercises the same risk from the same layer (component-level vs. full journey) before flagging a gap that a near-duplicate would just re-cover.
- **Priority** — justified by documented user impact / journey criticality, not assigned because the case exists.
- **Manual/automation call** — sound given stability and value.

## The assertion-quality bar (shared with `senior-qa-ui-test-plan-creator`)

An expected result must be specific, observable from the UI, and objectively verifiable — sufficient on its own to catch a real defect. Flag (as UPDATE, typically P1) any assertion that:

- **Restates the action instead of verifying an outcome.** Example anti-pattern: clicking a tab, then asserting that tab's own label is still visible — true whether or not the click changed anything. The assertion must check what *changed*: an active/selected indicator, a content swap, a value update.
- **Only verifies clickability.** Clicking a control and asserting nothing about the result proves the element is clickable, not that the feature works. A real interaction test verifies: initial state, the action, the resulting state/content change, and the visible feedback.
- **Uses vague, unfalsifiable language** — "works correctly," "displays properly," "functions as expected," "looks good." The fix is a specific, checkable outcome tied to the *actual* documented behavior — never a plausible-sounding invented one.
- **Depends on volatile implementation detail** (an internal class name that isn't really the state indicator, a DOM structure likely to change) when a more stable, user-facing signal is available and would serve just as well.
- **Can pass despite a materially wrong user experience** — e.g. checking that *a* value is present without checking it's the *correct* value for the action just taken.

When the correct observable outcome for a proposed new/updated case isn't derivable from what was supplied, write it as an open question (Phase 5's INVESTIGATE classification, surfaced in section 9 of the output) rather than guessing a plausible-sounding assertion.
