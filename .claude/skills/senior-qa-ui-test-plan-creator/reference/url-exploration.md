# URL-Based Exploration

Read this whenever a URL is supplied, before continuing into Phase 4 of the core workflow.

## Purpose and boundaries

Exploration exists to discover the UI and produce accurate input for test design: mapping pages, navigation, components, and journeys, and establishing what's confirmed vs. unclear. It is **not** unrestricted exploratory testing for its own sake, and it is **not** permission to report a defect just because an interaction produced no observable result, or an unexpected one. A defect requires an established expected behavior that the observed behavior contradicts — see Classification below.

## What to look for

- Pages
- Navigation menus
- Navigation links
- Buttons
- Forms
- Input fields
- Dropdowns
- Checkboxes and radio buttons
- Tabs
- Tables
- Filters
- Sorting controls
- Modals/dialogs
- Tooltips
- Pagination
- Search functionality
- Validation messages
- Success/error messages
- Loading states
- Empty states
- Disabled states
- Visible UI state changes
- URL/navigation changes
- Basic user journeys through the application

## Five distinct stages — don't collapse them

Discovering an element does not mean its behavior is known. Track these as five separate, explicit stages for anything non-trivial:

1. **Element discovered** — it exists in the rendered UI (e.g. an "Export" button is visible on the Reports page).
2. **Element interacted with** — an action was actually taken on it (clicked, typed into, selected).
3. **Behavior observed** — what happened afterward, described factually (a network request fired, nothing visible changed, a modal opened, the URL changed to X).
4. **Expected behavior established** — *only* when a requirement, the Functional Inventory, or approved documentation states what should happen. Observation alone never establishes this.
5. **Test scenario proposed** — written only once stages 1–4 give enough basis for a meaningful, specific assertion (see the assertion quality bar in `quality-standards.md`).

A control can sit at stage 1, 2, or 3 without ever reaching stage 4 — that's expected, and it should be reported as unclear (classification below), not papered over with an invented stage-4 assumption.

## Exploration approach

- Full interaction is in scope by default — submit forms, click controls, navigate — in order to actually observe behavior, not just enumerate elements.
- One exception: pause and confirm before an action that is clearly irreversible and high-cost in the real world (e.g. finalizing a real payment, permanently deleting an account or data with no undo). Everything else proceeds without asking first.
- No fixed crawl-depth limit — explore as needed to build an accurate, complete picture of the UI relevant to the requested test plan, not on a fixed hop count. Use judgment on when the picture is complete rather than exhaustively crawling every reachable page.
- Don't retry a blocked or failing interaction indefinitely. If something can't be exercised (auth wall, missing permission, unavailable backend, missing test data), record the limitation once — what was attempted and what prevented it — and move on to the remaining accessible UI.

## Authentication and access

- If a URL or flow requires authentication and no credentials/test access are available, report that limitation clearly and explicitly (what's behind the wall, what couldn't be explored).
- Never attempt to bypass authentication or access controls.
- Continue exploring whatever is publicly or already accessible.

## Classification

Apply to every non-trivial observed control or flow, in this priority order — use the first that applies:

1. **Confirmed expected behavior** — supported by requirements, acceptance criteria, functional documentation, or explicit notes.
2. **Confirmed implemented behavior** — reliably observed during exploration (stage 3 above), even without a documented requirement.
3. **Known limitation / intentionally unimplemented** — explicitly stated by the user (e.g. via the Functional Inventory) or project documentation.
4. **Unclear / requires clarification** — intended behavior can't be established from any source.
5. **Potential defect** — only when an expected behavior is already established (category 1, or reliably implied by consistent implemented behavior elsewhere) **and** the observed behavior contradicts it. Clicking a button and observing nothing, with no prior established expectation, is category 4 — never jump straight to category 5.

## Output order when a URL is supplied

This elaborates Phases 1–3 of the core workflow into explicit intermediate output, so ambiguity surfaces before a final plan is produced:

1. Exploration summary
2. Pages and navigation discovered
3. UI components/interactions discovered
4. Functional Inventory reconciliation (if one was supplied)
5. Confirmed functionality
6. Known limitations / unimplemented functionality
7. Unclear behavior / clarification questions
8. Proposed UI test coverage *(→ core workflow Phase 4)*
9. Complete UI test plan *(→ core workflow Phases 5–6, 8, using the standard templates)*
10. Coverage gaps and assumptions *(→ core workflow Phase 7)*

Do not skip straight to step 9 when step 7 turned up significant ambiguity — surface it first. Assumptions used to proceed anyway must be labeled as such in step 10 and in the plan's own Assumptions section (Section 4 of `test-plan-template.md`; use its optional clarification table when meaningful unknowns affect coverage).

## Source-of-truth reminder

Requirements/acceptance criteria define expected behavior. The Functional Inventory supplies explicit implementation/context. A URL supplies *observable evidence* of the current UI — nothing more. Never let observed URL behavior override an explicit requirement; if they conflict, report the conflict and ask rather than silently picking one. Full hierarchy in `SKILL.md`.
