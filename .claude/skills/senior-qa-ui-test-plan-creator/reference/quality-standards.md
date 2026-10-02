# Quality Standards

Read this before Phase 4 (design coverage), Phase 5 (write test cases), and Phase 7 (validate the draft).

## Scope

### In scope

- Pages, layouts, UI components, and navigation.
- User interactions and workflows.
- Forms, field validation, and submission behavior.
- Buttons, links, menus, tabs, dialogs, tables, and dynamic content.
- UI states, feedback, error messages, and recovery paths.
- Assertions and expected results for all of the above.
- Responsive UI, supported browsers, and accessibility — only where the supplied material documents a viewport/browser matrix or an accessibility requirement. Do not invent a support matrix.
- User experience and usability — only against a documented requirement or a clear, describable usability defect, never against personal aesthetic preference.
- Manual vs. UI automation suitability for each scenario.
- UI regression coverage (smoke set, high-risk areas, stable candidates for automation).

### Out of scope

- Direct API testing or API contract validation.
- Backend business logic independent of the UI.
- Database validation and data-layer testing.
- Infrastructure, deployment, and server configuration testing.
- Standalone performance/load, penetration, or security testing.
- Unit testing of frontend implementation details.

A dependency on one of these areas may be *noted* when it affects user-visible behavior (e.g. "verify the user-visible error when the page fails to load data"), but never expanded into a test of the dependency itself.

## The assertion quality bar

Every expected result must be specific, observable from the UI, and objectively verifiable — sufficient on its own to catch a real defect. Reject or rewrite an assertion that:

- **Restates the action instead of verifying an outcome.** Example anti-pattern: clicking a tab, then asserting that tab's own link/label is still visible — true whether or not the click changed anything, because the label was visible before the click too. The assertion must check what *changed*: an active/selected indicator, a content swap, a value update.
- **Only verifies clickability.** Clicking a control and asserting nothing about the result (or asserting something unrelated) proves the element is clickable, not that the feature works. Every interaction test should verify: the initial state, the action taken, the resulting state/content change, and the visible feedback.
- **Uses vague, unfalsifiable language** — "works correctly," "displays properly," "functions as expected," "looks good." Rewrite as a specific, checkable outcome instead: not *"the form works"* but *"after submitting valid values, the documented success message appears and the updated value is reflected in [the specific view]."* (This is illustrative phrasing only — never assume this exact behavior for a real feature; derive the actual expected result from the supplied requirement.)
- **Depends on volatile implementation detail** rather than user-facing state (an internal class name that isn't actually the state indicator, a DOM structure likely to change) when a more stable, user-facing signal is available.
- **Can pass despite a materially wrong user experience** — e.g. checking that *a* value is present without checking it's the *correct* value for the action just taken.

When you cannot yet state the correct observable outcome for a scenario (e.g. you don't know what visual indicator marks a selected item), say so explicitly as an open question rather than writing a plausible-sounding but unverified assertion. A wrong guess encoded as a "verified" assertion is worse than an honestly flagged gap.

## Avoiding redundant coverage

Before adding a new test case, check whether an existing one already exercises the same risk from the same layer (unit-of-UI vs. full journey). Prefer one well-asserted case over several that differ only in cosmetic details (e.g. don't write a separate case per input field for the exact same validation rule unless the boundary itself differs meaningfully). Long end-to-end journeys should not re-prove what a focused component-level case already covers — use the journey test to verify the *sequence and hand-offs* between steps, not each step's internal correctness again.
