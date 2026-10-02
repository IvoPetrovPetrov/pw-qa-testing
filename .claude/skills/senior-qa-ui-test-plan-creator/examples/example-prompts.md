# Example Prompts

The skill is invoked automatically when a request matches its description — you don't need to name it explicitly, but you can (`"use the senior-qa-ui-test-plan-creator skill to..."`) if you want to force it.

## Creating a new plan from scratch

> "Here are the acceptance criteria and three screenshots for a new account-settings dialog (attached/pasted below). Create a UI test plan. Flag anything you can't verify from what I've given you instead of guessing."

> "Using this Jira epic and its linked user stories, draft a UI test plan for the checkout flow. We support Chrome, Safari, and Firefox on desktop only — no mobile support yet."

## Extending an existing plan

> "I have an existing UI test plan for the dashboard at docs/test-plans/dashboard-test-plan.md. Extend it with test cases for the new export button described in this ticket: <paste>. Keep the existing IDs and structure."

## Reviewing before finalizing

> "Review this UI test plan draft against the attached wireframes and requirements doc. Tell me what's missing, what's redundant, and where the assertions are too vague, before I finalize it."

## Narrow, single-area ask

> "Add negative and boundary test cases for the password-reset form's validation, based on this requirements section. Don't touch the rest of the plan."

## URL-based exploration

**URL only:**
> "Explore https://app.example.com/settings and create a UI test plan for it. I don't have written requirements for this page — work from what you can observe, and flag anything you can't confirm."

**URL + Functional Inventory:**
> "Explore https://app.example.com/dashboard and create a UI test plan. Here's a Functional Inventory with what I know is implemented and what isn't:
>
> ```
> Page: Dashboard
> Navigation:
> - Dashboard → landing page
> - Reports → Reports page
> Dashboard:
> - Refresh → refreshes dashboard data
> - Export → currently not implemented
> ```
>
> Treat this as authoritative over anything you observe that conflicts with it."

**URL + Functional Inventory + Requirements/Acceptance Criteria:**
> "Explore https://app.example.com/users and create a UI test plan. Attached: the acceptance criteria for the Users page (AC-1 through AC-6), plus a Functional Inventory covering navigation and known limitations. Requirements win if anything conflicts with what you observe on the live page — tell me if that happens."

**Intentionally unimplemented control (expected handling):**
> "Explore https://app.example.com/dashboard. The Functional Inventory says: `Export button (Dashboard) → present in UI, backend not built yet`. When you get to Export, don't write a failing test case for it — record it as a known limitation, and only note it as a coverage gap if we decide to test it once it ships."
>
> Expected: the skill records Export as classification category 3 (known limitation), does *not* propose a test case asserting it should work, and does not classify it as a potential defect — because the Functional Inventory already established the expected behavior (unimplemented) before exploration ever touched it.

## What to expect

- If your acceptance criteria don't specify something the plan needs (a browser matrix, an error message's exact wording, a viewport list), the skill will either ask you directly or proceed with an explicitly labeled assumption — it will not invent the missing detail silently.
- When exploring a URL, discovering a control and interacting with it are not the same as knowing what it's supposed to do — the skill will report an unclear result as unclear, not as a defect, unless an expected behavior was already established from a requirement, the Functional Inventory, or documentation.
- It will not write automation code unless you ask for that separately.
- It will not create tests for API/backend/database/infrastructure/performance/security concerns, even if your source documents mention them — it will note the dependency and move on.
- It will not attempt to bypass a login/auth wall during exploration; it reports what couldn't be reached and continues with the accessible UI.
