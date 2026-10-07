# Popover UI Test Plan

**Prepared by:** QA
**Date:** 2026-10-06
**Source documentation:** Repository implementation (`UI/pages/popover-page.ts`, `UI/pages/navigation-page.ts`, `playwright.config.ts`, and the existing UI test patterns); live UI at `https://playground.bondaracademy.com/pages/modal-overlays/popover`. No product requirements, acceptance criteria, approved designs, or Functional Inventory were supplied.

## 1. Executive Summary

This plan covers the Popover page route and its position, simple, template, component, form, and event-debouncing examples. The live UI and page object establish what is currently implemented, but they are not substitutes for product requirements; no formal expectations, priority model, supported viewport matrix, or error behavior were supplied. Core visible interactions are candidates for UI automation, while constrained-placement behavior and unresolved trigger/submission semantics need exploratory validation or clarification. Automated tests now cover POP-P01, POP-P02, the hover portion of POP-P03, POP-N01, POP-A01, POP-A02, POP-A03, and POP-R01; placement, rapid hint switching, and unresolved hint/submission behavior remain exploratory.

## 2. Scope and Objectives

**Objective:** Verify the currently observable Popover page and interaction examples without treating observed implementation as an approved product requirement.

### In scope

- Navigation to `/pages/modal-overlays/popover` and initial presentation of the five Popover example cards.
- Simple string popovers for the displayed click, hover, and hint trigger examples.
- Four placement controls and the page's stated adjustment behavior when configured placement has insufficient room.
- Template- and component-rendered tab, form, and card examples.
- User-visible behavior of moving quickly among the repeated "show hint" controls.
- Closing and reopening a popover where the observed interaction supports a reproducible check.

### Out of scope

- Direct API, backend, database, infrastructure, or implementation-unit testing.
- Standalone performance or security testing. The event-debouncing text is considered only as a user-visible UI interaction, not as a performance measurement.
- Form-submission business rules or success/error handling until expected behavior is documented.
- Responsive/browser support commitments, accessibility conformance, or visual-regression acceptance criteria; none were supplied.

## 3. Source Requirements and Traceability

No REQ/AC requirements were supplied. The `OBS-PO-*` identifiers below are evidence references for current implementation only; they are not product requirements or acceptance criteria.

| Requirement / AC ID | Source | Summary | Covered by (Test Case IDs) |
|---|---|---|---|
| OBS-PO-01 (not REQ/AC) | `UI/pages/navigation-page.ts` (`popoverPage`) and live UI route | Navigation method opens Modal & Overlays and selects Popover; route is `/pages/modal-overlays/popover`. The live page presents five named example cards. | POP-P01 |
| OBS-PO-02 (not REQ/AC) | Live UI, Simple Popovers card | The three displayed examples share the string “Hello, how are you today?” and identify click, hover, and hint triggers; click and hover activation were observed. | POP-P02, POP-P03, POP-N01 |
| OBS-PO-03 (not REQ/AC) | Live UI, Template Popovers and Component Popovers cards | Both cards expose With tabs, With form, and With card examples. Tab and card content were observed; the forms expose Recipients, Subject, Message, and Send controls. | POP-A01, POP-A02, POP-A03 |
| OBS-PO-04 (not REQ/AC) | Live UI, Popover Position card | Four controls are labelled Left, Top, Bottom, Right; page text says placement adjusts to fit the screen when configured placement lacks room. | POP-B01 |
| OBS-PO-05 (not REQ/AC) | Live UI, Event Debouncing card | Page text says quickly moving the pointer over the repeated hint buttons creates only the last popover. | POP-P04 |
| OBS-PO-06 (not REQ/AC) | Live UI interaction | Clicking elsewhere closed an open form popover; reopening behavior is a candidate for confirmation. | POP-R01 |

For case-level traceability, “none supplied” means there is no requirement ID. The listed observation references must not be treated as a claim of required behavior.

## 4. Assumptions, Dependencies, and Open Questions

**Assumptions**

- This is a preliminary implementation-based plan. Observed live behavior informs candidate checks but does not establish acceptance criteria.
- The live public playground currently corresponds to the configured `baseURL` in `playwright.config.ts`; its availability and content stability are not guaranteed by repository documentation.
- `playwright.config.ts` lists desktop Chromium, Firefox, and WebKit projects. This is observed test configuration, not evidence that all three browsers are a product-supported matrix.

**Dependencies**

- A reachable instance of `https://playground.bondaracademy.com` is needed for the current repository's UI flows and for confirming any changes to the observed examples.
- The current Popover route and example controls must remain available for cases derived from the existing implementation.

**Open questions**

- What is the intended activation event for controls labelled “on hint”? Hovering currently displayed the same popover text, but no requirement explains whether hover, focus, or another action is intended.
- What should happen when the form example's Send button is submitted with empty or populated fields? Clicking Send with the observed empty form produced no visible validation or confirmation in the inspected session; that observation does not establish the correct behavior.
- Should popovers close on Escape, clicking their trigger again, or only by another dismissal action? Only an outside click closing an open form example was observed.
- What exact placement/flip rules and supported viewport sizes define “adjust accordingly trying to fit the screen”?
- Are there error, loading, or recovery states for rendering the form, tab, or card examples? None were documented or observed.
- Are there requirements for accessibility, keyboard interaction, browser support, or responsive layout? None were supplied.

**Clarifications required from exploration**

| UI Element / Functionality | Observed | What's Unclear | Why Clarification Is Required | Test Coverage Affected |
|---|---|---|---|---|
| “on hint” controls | The page exposes an `nbpopovertrigger="hint"` attribute; hovering the simple hint control displayed “Hello, how are you today?”. | Whether hover is the intended activation event and what keyboard/focus behavior is expected. | The label/implementation and one observed interaction do not define a complete expected interaction contract. | POP-P03 and any keyboard/focus scenarios |
| Form Send button | Form popover shows Recipients, Subject, Message, and Send. Empty submission left the displayed form without visible feedback in the observed session. | Required fields, accepted values, submission result, error handling, and dismissal after submission. | No requirements or approved form behavior were supplied; asserting a guessed outcome would invent behavior. | POP-A02; form validation/submission and error/recovery coverage |
| Placement controls | Four nominal placement labels are present; the page says it adjusts placement when space is insufficient. | Exact placement and edge/viewport acceptance rules. | The supported viewport matrix and precise flip/overflow criteria are undocumented. | POP-B01 |

## 5. UI Coverage Matrix

| Page / Component / Journey | Positive | Negative | Boundary | Accessibility | Automation Candidate | Notes |
|---|---|---|---|---|---|---|
| Popover page route and initial cards | POP-P01 | POP-P01 (no popover initially) | n/a | Not specified | Yes | Route has a repository navigation helper; no Popover test currently uses it. |
| Simple popovers | POP-P02, POP-P03 | POP-N01 | n/a | Not specified | Yes, after trigger semantics are confirmed | Hint trigger contract remains open. |
| Template/component tabs | POP-A01 | n/a | n/a | Not specified | Yes | Keep template and component rendering paths covered without duplicating assertions unnecessarily. |
| Template/component forms | POP-A02 | Submission rules unconfirmed | n/a | Not specified | Partial | UI field rendering/input may be automated; submission assertions need requirements. |
| Template/component cards | POP-A03 | n/a | n/a | Not specified | Yes | Verify user-visible content in both rendering variants. |
| Placement examples | n/a | n/a | POP-B01 | Not specified | Partial | Exploratory until viewport and exact positioning criteria are agreed. |
| Event Debouncing hints | POP-P04 | n/a | Rapid sequential pointer movement | Not specified | Partial | Validate the visible “last popover” behavior only; no performance measurement. |
| Popover dismissal/reopen | POP-R01 | POP-R01 | n/a | Not specified | Yes, for outside-click behavior | Escape/trigger-toggle behavior remains unknown. |

## 6. Detailed Test Cases

### Popover page and simple triggers

**Test Case ID:** POP-P01  
**Title:** Open the Popover page and verify its initial UI  
**Priority:** P2 — if the route or main example groups are missing, the feature cannot be exercised through the page.  
**Page / Component:** Modal & Overlays → Popover  
**Test Type:** positive, navigation, initial state  
**Preconditions:** Application is reachable at the base URL in `playwright.config.ts`.  
**Test Data:** Route `/pages/modal-overlays/popover`; expected visible card headings: Popover Position, Simple Popovers, Template Popovers, Component Popovers, Event Debouncing.  
**Steps:**
1. Open the application root.
2. Open the Modal & Overlays navigation group.
3. Select Popover.
4. Inspect the page before activating any example.
**Expected Results / Assertions:**
- The URL ends in `/pages/modal-overlays/popover`.
- Each of the five named example cards is visible.
- The page exposes the position controls, three simple trigger controls, three template controls, three component controls, and repeated show hint controls.
- No example popover content is open initially.
**Requirement Reference:** No REQ/AC supplied; OBS-PO-01 is implementation evidence only.  
**Manual / Automation:** automate now — route and initial card visibility are stable, directly observable UI checks.

**Test Case ID:** POP-P02  
**Title:** Activate the simple click popover and verify its content  
**Priority:** P2 — verifies the primary simple-popover interaction shown by the page.  
**Page / Component:** Simple Popovers  
**Test Type:** positive  
**Preconditions:** Popover page is open; no popover is currently visible.  
**Test Data:** Control “on click”; observed popover text “Hello, how are you today?”.  
**Steps:**
1. Click “on click”.
2. Inspect the displayed popover.
**Expected Results / Assertions:**
- A popover containing “Hello, how are you today?” becomes visible.
- Exactly one instance of that simple popover text is visible.
**Requirement Reference:** No REQ/AC supplied; OBS-PO-02 is implementation evidence only.  
**Manual / Automation:** automate now — observed click and content are objectively verifiable.

**Test Case ID:** POP-P03  
**Title:** Activate the simple hover and hint popovers  
**Priority:** P2 — covers the two non-default trigger examples presented on the page.  
**Page / Component:** Simple Popovers  
**Test Type:** positive, alternative interaction  
**Preconditions:** Popover page is open; move the pointer away from the Simple Popovers controls between checks so an earlier popover is not mistaken for the next result.  
**Test Data:** Controls “on hover” and “on hint”; observed text “Hello, how are you today?”.  
**Steps:**
1. Hover “on hover” without clicking it.
2. Verify the simple popover content.
3. Move the pointer away and verify the content is no longer visible.
4. Move the pointer away from all Simple Popovers controls.
5. Hover “on hint” without clicking it.
6. Record whether the same content appears and how it responds when the pointer moves away.
**Expected Results / Assertions:**
- Hovering “on hover” displays “Hello, how are you today?”; moving away removes that visible instance in the observed behavior.
- Hovering “on hint” displayed the same text in the inspected session; its intended activation/dismissal contract remains unconfirmed and must not be treated as acceptance criteria until clarified.
**Requirement Reference:** No REQ/AC supplied; OBS-PO-02 is implementation evidence only.  
**Manual / Automation:** manual initially; automate the hint portion after intended trigger semantics are confirmed. The hover example is suitable for automation.
**Dependencies / Notes:** The page object’s current `openSimplePopover` helper clicks all three types, so it should not be used to prove hover-only behavior without separately verifying the action performed.

**Test Case ID:** POP-N01  
**Title:** Keep the click-triggered simple popover closed when only hovered  
**Priority:** P2 — distinguishes click activation from pointer entry for the control labelled “on click.”  
**Page / Component:** Simple Popovers  
**Test Type:** negative  
**Preconditions:** Popover page is open; no simple popover is visible; move the pointer away before the test.  
**Test Data:** “on click” control; “Hello, how are you today?” content.  
**Steps:**
1. Hover “on click” without pressing a mouse button.
2. Inspect the page for the simple popover text.
3. Click “on click”.
**Expected Results / Assertions:**
- Hover alone does not show “Hello, how are you today?” in the observed implementation.
- Clicking the control then displays that text.
**Requirement Reference:** No REQ/AC supplied; OBS-PO-02 is implementation evidence only.  
**Manual / Automation:** automate now — a distinct UI state is verifiable before and after the click.

### Template and component content

**Test Case ID:** POP-A01  
**Title:** Render and switch tabs in template and component popovers  
**Priority:** P2 — verifies both displayed rendering variants and the observed tab content transition.  
**Page / Component:** Template Popovers and Component Popovers  
**Test Type:** positive, alternative flow  
**Preconditions:** Popover page is open.  
**Test Data:** “With tabs” controls; observed first-tab text “Such a wonderful day!” and second-tab text “Indeed!”.  
**Steps:**
1. Select Template Popovers → With tabs.
2. Verify the visible tab labels and initial content.
3. Select “SECOND TAB” and inspect the content.
4. Close the popover using an agreed outside click before continuing.
5. Select Component Popovers → With tabs and repeat the same observations.
**Expected Results / Assertions:**
- Each variant displays “WHAT'S UP?” and “SECOND TAB”.
- The observed initial content is “Such a wonderful day!”.
- Selecting “SECOND TAB” changes the visible content to “Indeed!”.
- The template and component paths expose the same observed tab content and transition.
**Requirement Reference:** No REQ/AC supplied; OBS-PO-03 is implementation evidence only.  
**Manual / Automation:** automate now — labels and content transitions are observable and repeatable.
**Dependencies / Notes:** Outside click was observed to close an open form popover. Confirm that dismissal behavior for tab popovers before making Step 4 a blocking assertion.

**Test Case ID:** POP-A02  
**Title:** Render and enter text in template and component form popovers  
**Priority:** P2 — verifies the form-shaped UI shown in both rendering variants without inventing submission rules.  
**Page / Component:** Template Popovers and Component Popovers  
**Test Type:** positive, input interaction  
**Preconditions:** Popover page is open.  
**Test Data:** Recipients: `qa@example.test`; Subject: `Popover check`; Message: `UI-only sample`.  
**Steps:**
1. Select Template Popovers → With form.
2. Verify fields named Recipients, Subject, and Message, and the Send button.
3. Enter the supplied values and verify each value remains in its corresponding field.
4. Close the popover without submitting.
5. Select Component Popovers → With form and repeat the field and input checks.
**Expected Results / Assertions:**
- Each variant presents the three named fields and a Send button.
- Each field accepts and displays the value entered into it.
- No assertion is made about submission, required fields, validation, delivery, or confirmation.
**Requirement Reference:** No REQ/AC supplied; OBS-PO-03 is implementation evidence only.  
**Manual / Automation:** automate now for field visibility and input reflection; keep submission exploratory until product behavior is documented.

**Test Case ID:** POP-A03  
**Title:** Render card content in template and component popovers  
**Priority:** P3 — checks content parity in two variants of the same example.  
**Page / Component:** Template Popovers and Component Popovers  
**Test Type:** positive, alternative flow  
**Preconditions:** Popover page is open.  
**Test Data:** “With card” controls; observed heading “Hello!” and paragraph beginning “Far far away, behind the word mountains…”.  
**Steps:**
1. Select Template Popovers → With card.
2. Verify the heading and paragraph content.
3. Close the popover using a confirmed dismissal action.
4. Select Component Popovers → With card and repeat.
**Expected Results / Assertions:**
- Each variant displays the observed “Hello!” heading.
- Each variant displays the observed paragraph text beginning “Far far away, behind the word mountains”.
**Requirement Reference:** No REQ/AC supplied; OBS-PO-03 is implementation evidence only.  
**Manual / Automation:** automate now if the content is intended to remain stable; otherwise manual spot-check after content changes.

### Placement, dismissal, and repeated hints

**Test Case ID:** POP-B01  
**Title:** Keep positioned popovers within the available viewport space  
**Priority:** P2 — the page explicitly describes placement adjustment when the configured direction lacks room; exact support criteria remain open.  
**Page / Component:** Popover Position  
**Test Type:** boundary, placement  
**Preconditions:** Popover page is open in a browser with a controllable viewport.  
**Test Data:** Left, Top, Bottom, and Right controls; viewport conditions that leave insufficient room on the requested side of a trigger. No supported viewport dimensions were supplied.  
**Steps:**
1. Exercise each placement control using its intended activation event.
2. Record the rendered popover position relative to its trigger and the viewport.
3. Repeat with the trigger near viewport edges so the requested placement has insufficient room.
**Expected Results / Assertions:**
- Each control requests its labelled placement when sufficient room is available.
- When the requested placement lacks room, the popover adjusts so its user-visible content fits within the screen, as stated by the page.
- Record actual position and any clipping; do not assert a specific flip direction until placement rules and supported viewport criteria are confirmed.
**Requirement Reference:** No REQ/AC supplied; OBS-PO-04 is page-copy evidence, not a complete viewport specification.  
**Manual / Automation:** manual exploratory initially — requires agreed viewport setup and clarified placement rules before a stable automated assertion is defined.

**Test Case ID:** POP-R01  
**Title:** Dismiss and reopen a simple popover using an outside click  
**Priority:** P2 — checks recovery to the page after an open overlay and the repeatability of its trigger.  
**Page / Component:** Simple Popovers  
**Test Type:** negative, recovery  
**Preconditions:** Popover page is open.  
**Test Data:** “on click” control; text “Hello, how are you today?”.  
**Steps:**
1. Click “on click” and verify the text appears.
2. Click the Popover Position card heading, outside the open popover.
3. Verify the simple popover text is no longer visible.
4. Click “on click” again.
**Expected Results / Assertions:**
- The outside click closes the visible popover in the observed interaction.
- The “on click” control can display the text again after dismissal.
**Requirement Reference:** No REQ/AC supplied; OBS-PO-06 records outside-click behavior for the form variant only.  
**Manual / Automation:** automate after confirming the outside-click behavior for the simple variant.

**Test Case ID:** POP-P04  
**Title:** Show only the most recently hovered event-debouncing hint  
**Priority:** P2 — checks the user-visible behavior described by the Event Debouncing card, not performance.  
**Page / Component:** Event Debouncing  
**Test Type:** positive, boundary (rapid repeated interaction)  
**Preconditions:** Popover page is open with no hint visible.  
**Test Data:** At least two adjacent “show hint” controls; observed hint text “Popover!”.  
**Steps:**
1. Move the pointer quickly across two or more “show hint” controls, ending on the last control.
2. Inspect the visible hint content and its location relative to the last hovered control.
3. Move the pointer away from the controls.
**Expected Results / Assertions:**
- The visible hint is associated with the last hovered control, consistent with the page’s explanatory text.
- No more than one “Popover!” hint is visible at a time, matching the observed behavior.
- No timing threshold, throughput, or performance claim is measured.
**Requirement Reference:** No REQ/AC supplied; OBS-PO-05 is explanatory page copy, not a product requirement.  
**Manual / Automation:** manual exploratory initially; automate only after the intended hover sequence and a stable observable association are confirmed.

## 7. Risk-Based Prioritization

No business-critical journey or product impact information was supplied. Therefore no P0 or P1 is assigned; priorities below are provisional, based on the feature surface and observed risk, not confirmed release severity.

| Priority | Test Case IDs | Rationale |
|---|---|---|
| P0 | None | No evidence that Popover is an essential journey or that failure has severe user impact. |
| P1 | None | No documented critical workflow or user-impact evidence justifies P1. |
| P2 | POP-P01, POP-P02, POP-P03, POP-N01, POP-A01, POP-A02, POP-B01, POP-R01, POP-P04 | Main route, trigger, content, placement, dismissal, and repeated-hint interactions form the primary observed feature behavior. |
| P3 | POP-A03 | Card-content parity is a lower-risk content check absent evidence that the copy is business-critical. |

## 8. Manual vs. Automation Recommendations

| Test Case ID | Recommendation | Rationale |
|---|---|---|
| POP-P01 | automate now | Existing repository uses Playwright Test and has a navigation helper for this route. |
| POP-P02 | automate now | Click action and exact visible content are directly observable. |
| POP-P03 | automate now for hover; manual for hint until clarified | Hover is directly observable; hint activation semantics are not specified. |
| POP-N01 | automate now | Verifies that pointer entry alone does not activate the click-labelled example. |
| POP-A01 | automate now | Both variants expose stable labels and an observed content transition. |
| POP-A02 | automate now for rendering/input; exploratory for submission | UI controls accept input, but Send behavior and validation are undocumented. |
| POP-A03 | automate now | Check the observed heading and opening paragraph text in both rendering variants without asserting the full copy. |
| POP-B01 | manual / exploratory initially | Needs agreed viewport matrix and exact position/overflow rules before automation thresholds are stable. |
| POP-R01 | automate now | The simple variant's outside-click dismissal and reopen behavior are verified by the UI test. |
| POP-P04 | manual / exploratory initially | The page describes the behavior, but reliable identification of the last-trigger association needs a stable observable signal. Avoid timing/performance assertions. |

The project configuration lists desktop Chromium, Firefox, and WebKit. This plan does not infer that those browsers are required support targets; select browser execution only after the product/browser matrix is confirmed.

## 9. Smoke and Regression Grouping

**Smoke set** (must pass before any further testing): POP-P01, POP-P02  
**Regression set** (run each cycle): POP-P01, POP-P02, POP-P03, POP-N01, POP-A01, POP-A02, POP-R01  
**Exploratory-only**: POP-B01 (until viewport and placement criteria are specified), POP-P04 (until last-trigger association is reliably observable), and the hint/form submission investigations in Section 4.

## 10. Coverage Validation and Residual Gaps

- Requirements with no covering test case: No requirements or acceptance criteria were supplied, so requirement coverage cannot be claimed.
- Assumptions still unresolved at delivery time: Hint activation semantics; Send/validation behavior; dismissal via Escape or trigger toggle; exact edge-placement rules and supported viewports; any accessibility/browser/responsive requirements.
- Known residual gaps and why they weren't closed: The automated checks in `tests/popover.spec.ts` cover POP-P01, POP-P02, the hover portion of POP-P03, POP-N01, POP-A01, POP-A02, POP-A03, and POP-R01. POP-B01 and POP-P04 remain exploratory as their placement and last-trigger criteria are not yet stable; POP-P03's hint portion and form submission also remain unresolved. Error, loading, failure, and form success behavior were neither specified nor observed sufficiently to define expected assertions. Do not add tests asserting guessed outcomes; obtain product clarification first.
- Scope check: Cases cover user-facing web UI only. No API, backend, database, infrastructure, standalone performance, or standalone security cases are included.
