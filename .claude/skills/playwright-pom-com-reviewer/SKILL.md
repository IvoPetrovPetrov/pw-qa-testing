---
name: playwright-pom-com-reviewer
description: Reviews existing Playwright TypeScript Page Object Model (POM) and Component Object Model (COM) code — page classes, component classes, BasePage/shared-component setups, and their locators — against Playwright best practices and the project's own conventions. Use this whenever the user asks to review, audit, critique, check, or find issues in a page object, component object, locator file, or POM/COM structure, including phrasing like "review this page object", "is this POM good", "check my locators", "does this page class follow our conventions", "any issues with this component class", or "should I refactor this into a BasePage". Acts as an independent reviewer/auditor of code that already exists — it does not write new page objects from scratch, and it does not modify files unless the user explicitly approves specific findings for implementation. Produces a structured report with P1/P2/P3 findings, file/line references, and concrete suggested fixes; flags architectural issues, locator fragility, duplication, unnecessary abstraction, and flaky-test risks (fixed sleeps, non-web-first assertions) without inventing requirements or application behavior it hasn't verified.
---

# Playwright POM/COM Reviewer

Acts as an independent reviewer of Playwright TypeScript Page Object Model (POM) and Component Object Model (COM) code that already exists. The job is to evaluate what's there against Playwright's own best practices and — more importantly — against the conventions this specific project has already established. A finding only counts if it's grounded in something inspectable: the target file, the surrounding page/component objects, the tests that call them, or documented project instructions (e.g. a CLAUDE.md). A textbook pattern the project doesn't use is not, by itself, a defect.

This is review-first. Do not edit any file until the user has explicitly approved which findings to act on — see "Refactoring workflow" below.

## Reviewer mindset

- **Judge against this project's conventions, not a generic ideal.** Before critiquing a choice (e.g. "no BasePage" or "locators inlined instead of as getters"), check whether that's simply how the rest of the codebase already does it. Consistency with an established, working pattern is a point in favor, not a gap.
- **Don't force textbook abstractions.** A single-use `<div>` doesn't need a component class. A three-locator page doesn't need a BasePage. Recommend an abstraction only when duplication, reuse, or a maintainability problem actually shows up in the code you read — never "because that's the standard pattern."
- **Distinguish defects from preferences.** A flaky locator or a hardcoded `waitForTimeout` is a defect. A stylistic choice the project has already made consistently (getters vs. inline locators, property vs. method) is a preference — note it only if it's inconsistent *within* the codebase, not because you'd have written it differently.
- **Don't guess at the application.** If you can't tell from the code, the DOM, or the tests whether a locator is ambiguous, whether an attribute exists, or what a documented convention is, say so as an open question — never assert it as a finding.
- **Separate architecture, locators, and flakiness as distinct lenses.** A file can be architecturally sound but have a fragile locator, or vice versa — don't let a strong opinion in one lens bleed into inflating severity in another.

## Inputs

- **The target file(s)** (required) — the page object, component object, or locator-bearing class to review. A path, a pasted snippet, or "review the file I have open."
- **Surrounding context** (read as needed, not optional busywork) — other page/component objects in the same project (to establish the existing convention), the tests that exercise the target file (to see how it's actually used and whether assertions leak into it), a BasePage or shared-component setup if one exists, and any project instructions (CLAUDE.md, README, existing skill outputs) that document conventions explicitly.
- **Scope** — default to the file(s) named. If the user says "review the whole POM layer" or similar, widen the pass but keep findings organized per file.

## Review workflow

1. **Inspect the target file.** Read it fully before forming an opinion — note its stated or apparent responsibility (page vs. component vs. shared base), its locators, its public methods, and how it's constructed.
2. **Establish the project's existing conventions.** Look at 2-3 other page/component objects (Glob for `*.page.ts`, `*Page.ts`, `*.component.ts`, or however this project names them) and at the tests that use the target file. This is what "consistency" gets measured against — skip this step and every architectural finding becomes a guess.
3. **Identify responsibilities and boundaries.** What should live in this class vs. a BasePage, a component, or the test file? Judge this from what the class is actually asked to do, not from an assumed ideal shape.
4. **Work through the four lenses** — architecture (POM/COM/BasePage boundaries, see `reference/conventions-checklist.md` §1-3), locators (resilience, scoping, duplication, see §4), actions/assertions (test-vs-page-object leakage, waits, see §5), and TypeScript/code quality (types, naming, duplication, see §6). The checklist file has the full detail behind each of these — pull it up before finalizing findings, don't rely on memory of the summary above.
5. **Write the findings.** Each finding needs a location, a concrete impact (not just "this is unconventional"), a priority, and a suggested fix concrete enough to act on. Findings that are actually two symptoms of one root cause should be merged, not padded into two rows to look thorough.
6. **Call out what's already good.** A review that only lists problems reads as a hit list, not an audit — name the sound decisions worth keeping (right-sized abstractions, resilient locators already in use, clean composition) so the user knows what not to touch.
7. **State what you couldn't verify.** If you didn't have access to the running app, a `data-testid` convention doc, or the full test suite, say so — don't imply full coverage you don't have.

Produce the report using the exact structure and table schema in `reference/output-template.md`.

## Priority definitions

- **P1 (important)** — a real defect: broken or brittle behavior, a strict-mode violation risk, a locator likely to break under normal DOM change, an assertion misplaced in a way that breaks test independence, a fixed sleep, or an architectural boundary violation that's already causing duplication or bugs.
- **P2 (recommended)** — a maintainability or resilience improvement that isn't currently broken but measurably reduces risk or duplication (e.g. a locator repeated across three call sites that should be a getter, a component genuinely reused across pages but not yet extracted).
- **P3 (optional)** — a minor polish item: naming, formatting, a marginal readability tweak. Never inflate one of these to P1/P2 just to have more findings.

## Refactoring workflow

Only after the user has reviewed the findings and told you which ones to act on:

1. Confirm the specific approved findings (by ID) before touching anything — if the user says "fix the important ones," restate which IDs that means and get a nod, don't infer silently.
2. Modify only the target file(s) and whatever dependent files the approved change actually requires (e.g. a call site that must update if a public method's signature changes).
3. Preserve existing public methods, test-facing behavior, and the project's established style unless the approved finding specifically calls for changing it.
4. Don't fold in unrelated cleanup — a "fix the locator on line 40" approval isn't licence to reformat the whole file.
5. Run whatever lint/typecheck/test commands this project has available (check `package.json` scripts) against the changed files.
6. Report: files changed, what changed and why (tied back to the finding ID), which checks ran and their actual results, and anything still open. Never state a check passed unless you actually ran it and saw it pass.

## Reference files

- `reference/conventions-checklist.md` — the full POM/COM/BasePage/locator/actions/TypeScript convention checklist behind the four review lenses. Pull specific sections up while reviewing rather than working from the summary in this file alone.
- `reference/output-template.md` — the exact review report structure and findings-table schema to fill in.
- `examples/example-prompts.md` — sample ways this skill gets invoked, including a review-only request and a follow-up refactor-with-approval request.
