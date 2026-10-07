# Convention checklist

The detail behind the four review lenses in SKILL.md. Read the relevant section(s) while reviewing — don't rely on a remembered summary.

## 1. Page Object Model (POM)

- Page-specific locators and UI actions live in a dedicated page class; the class's responsibility should be legible from its name and public methods.
- Playwright's `Page` is injected through the constructor — not imported/instantiated ad hoc inside methods.
- Navigation (`goto`, URL construction) and page-specific interactions belong in the page object, not scattered across test files.
- Locators prefer accessible, user-facing queries — `getByRole`, `getByLabel`, `getByTestId`, `getByText` — over CSS/XPath, *when the DOM supports it*. Don't flag a CSS selector as wrong without checking whether an accessible alternative is actually available.
- Locator declaration style (explicit typed properties, lazy getters, or inline in the method that uses them) should match the class's size and the project's existing pattern. Don't require every locator to be declared as both a property and re-declared inline — pick one style per class and expect consistency, not duplication.
- Don't force every DOM element the class touches into a named class property "for completeness" — a one-off element used in a single method is fine inline.
- Avoid exposing raw internals unnecessarily (e.g. a public getter that hands back a `Locator` for something that should only ever be driven through a named action method) unless the project's tests genuinely need that level of access.

## 2. Component Object Model (COM)

- Extract a reusable UI component into its own class when doing so reduces duplication across ≥2 usage sites or meaningfully improves maintainability — not preemptively.
- A component may take a `Page` (if it needs page-level operations) or a scoped `Locator` (if it's always mounted within a known root) as its constructor argument — the right choice depends on whether the component's actions ever need to escape its root, not on a fixed rule.
- Component-specific locators and interactions are encapsulated inside the component class, not leaked back into the page object that owns an instance of it.
- A genuinely reusable component (e.g. a modal, a data-table row, a nav item) should be usable unchanged from every page that has one — check whether it currently is, or whether each page has quietly reimplemented it.
- Don't create a component class for a trivial, single-use element (e.g. a single confirm button used in exactly one flow) unless there's a concrete, named benefit (e.g. it will be reused in a documented upcoming page).

## 3. BasePage and shared components

- A `BasePage` is justified only when there's functionality genuinely shared across multiple concrete page classes (e.g. a common header check, a shared wait-for-load helper, a shared toast/notification reader) — verify the sharing is real by checking whether ≥2 page classes would actually use it, not by assuming it as good practice.
- Shared components (headers, footers, nav bars) should be reachable via composition (a page holds an instance) or inheritance (a page extends a base that exposes it) — either is acceptable; judge by which gives clearer, more explicit dependencies in this codebase, not by a blanket "composition over inheritance" rule.
- Flag inheritance introduced with no shared behavior beyond "it feels architecturally proper" — that's added indirection without payoff.
- If the project has zero shared-page abstractions today, don't manufacture the need for one to review "completely" — say coverage of this concern is not applicable if there's genuinely nothing shared yet.

## 4. Locator conventions

- Prefer resilient, user-facing locators (role, label, text, test-id) over brittle structural selectors (deep CSS chains, XPath, nth-child) — but confirm a "brittle" locator is actually fragile in context (e.g. does it depend on DOM order that's likely to change, or on styling classes that are clearly presentational) before flagging it.
- Every locator should be scoped to the page or component that owns it — a page object reaching into a component's internal DOM structure directly (bypassing the component class) is a boundary violation worth flagging.
- Duplicated locator strings/logic across files are a real finding when they appear ≥2 times for the same element — point to the specific call sites, not a general "there might be duplication somewhere."
- A getter is a reasonable choice for a locator that's referenced by multiple methods in the same class, or is non-trivial to construct; an inline locator is reasonable for something used exactly once. Flag the pattern only where it's inconsistent within the same class or clearly adds boilerplate without benefit.
- Watch for strict-mode violation risk: a locator that could resolve to more than one element on the actual page (e.g. `getByRole('button')` with no accessible name where the page has multiple buttons) without a `.filter()`, `.nth()`, or a more specific query.
- Watch for locators built against dynamic content (auto-generated ids, indices into a list that can reorder) without an accompanying wait or a more stable anchor.
- Never assert a locator is wrong purely from reading the selector string — if you don't have the rendered DOM or a test-id convention doc, say the ambiguity is unverified rather than asserting a defect.

## 5. Actions and assertions

- UI interactions and reusable page/component behavior (click, fill, navigate, wait-for-state helpers) belong in the page/component object.
- Scenario-specific assertions (`expect(...)` calls that encode what a particular test expects to be true) belong in the test file, not the page object — a page object returning state for the test to assert on is fine; a page object asserting on the test's behalf usually isn't.
- An assertion embedded in a page/component method is acceptable when it's a documented project convention already used elsewhere, or when it's a genuinely reusable invariant (e.g. a `component.expectVisible()` helper the project already uses this way across many tests) — flag it only when it's a one-off test's expectation smuggled into shared code.
- Use Playwright's auto-waiting locators and web-first assertions (`expect(locator).toBeVisible()`, `toHaveText()`, etc.) rather than manual polling or `expect(await locator.isVisible()).toBe(true)`, which discards auto-retry.
- Flag fixed sleeps (`page.waitForTimeout`), unconditional `try/catch` swallowing a timeout, and fragile sequencing (an action that only works because of assumed timing rather than an awaited state) as flakiness risks — these are close to always P1 findings because they cause intermittent, hard-to-diagnose failures in CI.

## 6. TypeScript and code quality

- Access modifiers (`private`/`protected`/`public`, or the lack of them) should reflect actual intended visibility — a locator or helper only ever used inside the class should not be public by default.
- Types should be specific where it costs nothing (constructor params, method return types) — but don't demand types Playwright already infers cleanly (e.g. don't ask for an explicit `Locator` return type annotation everywhere a getter already makes it obvious) purely for verbosity's sake.
- Naming and formatting should match the existing project style — check 2-3 sibling files before suggesting a rename or reformat; don't impose an outside style guide.
- Flag unnecessary imports, real duplicated code (near-identical methods that differ only in a literal), overly long/complex methods doing several unrelated things, and abstraction that adds a layer of indirection without adding flexibility anyone uses.
- Don't recommend refactoring code that already works and is already consistent with the rest of the project just to make it "look different" or "more idiomatic" — every suggested change needs a stated, concrete benefit.
