# Repository Instructions

This repository is a Playwright Test and TypeScript QA automation project. Apply these instructions when working in this repository, and consult the surrounding code and documentation when project-specific context matters.

## Playwright

- Use Playwright Test (`@playwright/test`) for browser tests.
- Prefer Playwright web-first assertions such as `await expect(locator).toBeVisible()` and `toHaveText()`.
- Avoid fixed waits such as `page.waitForTimeout()` unless there is a documented reason and no suitable state-based wait.
- Prefer stable, user-facing locators such as role, label, and text locators when the UI supports them.
- Follow the locator conventions already used in the relevant part of the project before introducing a different style.

## Page and Component Objects

- Use the Page Object Model (POM) and Component Object Model (COM) where they provide meaningful encapsulation or reuse.
- Check surrounding page/component objects and project documentation before introducing or recommending a POM/COM pattern.
- Constructor-initialized `readonly Locator` properties are a valid implementation; do not treat them as defects merely because another locator style is used elsewhere.
- Getter- or method-based locators are also valid when appropriate.
- Do not classify a valid alternative implementation as a defect solely because another pattern exists elsewhere in the repository.
- Distinguish functional defects from maintainability improvements and optional style preferences. Explain the practical impact of each finding.

## QA and Change Scope

- Do not invent application behavior, requirements, acceptance criteria, or business rules.
- Inspect surrounding code and available project documentation before making architectural judgments.
- Clearly distinguish verified facts, assumptions, risks, recommendations, and unknowns.
- Preserve existing behavior unless a change is explicitly requested.
- Avoid unrelated refactoring.

## Review Behavior

- For code and test-plan reviews, review first. Modify files only when the user explicitly requests changes or approves the proposed changes.
- Provide concrete file and line references where possible.
- Prioritize evidence-backed functional defects over subjective preferences, and explain why each finding matters.
- Do not call an established project convention a defect merely because it differs from generic best practices.

## Validation and Reporting

- Inspect `package.json` for the validation commands available in this repository before choosing checks.
- Run relevant tests, type checks, linting, or other available validation when appropriate to the change.
- Report the actual commands run and their results.
- Never claim a check passed unless it was executed and passed.
