# IoT Dashboard Test Plan

**Application:** Bondar Academy UI Playground IoT Dashboard  
**URL:** https://playground.bondaracademy.com/pages/iot-dashboard  
**Prepared by:** QA Engineering  
**Date:** 2026-09-28  
**Test type:** Functional UI, negative, boundary, responsive, accessibility, and resilience testing

## 1. Objective

Verify that the IoT Dashboard loads reliably, presents the correct dashboard areas and current values, responds correctly to user interaction, and remains usable when data, viewport, browser, or network conditions are unfavorable.

## 2. Scope

### In scope

- Dashboard route, initial rendering, navigation, and theme control
- Device controls: Light, Roller Shades, Wireless Audio, and Coffee Maker
- Temperature and humidity widgets
- Consumption and spending summary with week/month views
- Room Management selection: Kitchen, Bedroom, Hallway, and Living Room
- Contacts and Recent contacts list
- Solar Energy Consumption card and progress/value display
- Traffic Consumption chart and date/weather summary
- Security Cameras card, camera selection, playback/pause, logs, search, and setup controls
- Responsive layout, keyboard access, accessible names, visual state, and error handling

### Out of scope

- Backend sensor accuracy or real IoT hardware behavior
- Authentication, account management, and unrelated Playground pages
- Load/performance benchmarking beyond basic page-load and interaction responsiveness
- Security penetration testing

## 3. Test Approach

- Use independent tests with a fresh page and known initial state.
- Prefer user-facing locators and assertions on visible text, accessible names, selected state, and changed UI state.
- Run the functional smoke set on Chromium, Firefox, and WebKit.
- Run responsive checks at desktop, tablet, and mobile viewports.
- Record the initial value/state before each toggle or selector test; do not assume state persists between tests.
- Where the UI is currently static or demo-driven, assert deterministic presentation and interaction behavior rather than real sensor readings.

## 4. Preconditions and Test Data

- The URL is reachable over HTTPS.
- Browser JavaScript and cookies are enabled.
- Test data is not required; use the dashboard's default seeded values.
- Capture the initial dashboard state before tests that change controls.
- Recommended viewport set: 1440x900, 1024x768, and 390x844.
- Recommended network variants: normal, offline after initial load, delayed responses, and failed asset/API request where mocking is available.

## 5. Entry and Exit Criteria

**Entry criteria**

- Test environment is available and the dashboard route responds.
- A supported browser build is installed.
- No blocking deployment or maintenance notice is present.

**Exit criteria**

- All P0/P1 cases have passed or have an approved defect.
- No unexplained console errors, broken controls, or layout overlap remain.
- Cross-browser smoke and mobile layout checks are complete.
- Defects include reproduction steps, expected/actual results, browser, viewport, and evidence.

## 6. Test Case Matrix

### 6.1 Smoke and positive cases

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| IOT-P01 | P0 | Open the dashboard URL | Page loads successfully without a blank state, fatal error, or unexpected redirect, and no unexpected console/page errors are raised (ties to Section 5 exit criteria). |
| IOT-P02 | P0 | Verify page identity and main navigation | IoT Dashboard is the active/current page and the Playground navigation is visible. |
| IOT-P03 | P0 | Verify primary dashboard sections | Device controls, temperature, humidity, consumption, room management, contacts, solar, traffic, weather, and security camera areas are visible. |
| IOT-P04 | P1 | Toggle each device control once | The selected device changes state visually and its label/state indicator updates consistently. |
| IOT-P05 | P1 | Toggle each device control twice | The control returns to its original state without duplicate labels, stale styling, or unintended changes to other devices. |
| IOT-P06 | P1 | Open the header theme selector (labeled "Light") and choose "Dark" | The selector is a dropdown, not a single-click toggle: opening it reveals a "Dark" option; selecting it changes the theme across the dashboard, text/controls remain readable, and the selector's displayed value updates to "Dark". *(Verified live: this is the `nb-select` in the header, distinct from the unrelated "Light" device card covered by IOT-P04/P05 — see Finding F01. Confirmed live 2026-09-28: the dropdown exposes four options — Light, Dark, Cosmic, Corporate — rendered as plain `<nb-option>` elements with no `role="option"` attribute, same as the consumption-period dropdown (see Finding F14) — `getByRole('option', ...)` matches zero of them, so automation must target the `nb-option` tag/text directly. Selecting "Dark" changes `document.body`'s class from `nb-theme-default` to `nb-theme-dark` and updates the header button's text to "Dark".)* |
| IOT-P07 | P1 | Inspect temperature and humidity widgets, then switch between the two tabs | Current values, units, labels, and visual indicators are present and formatted consistently; after switching tabs, the `active`/`content-active` state moves to the selected tab (verified live: the indicator is on the tab's `<li>` and its `nb-tab` panel, not on the inner link, so asserting the link's class is a no-op) and the displayed reading corresponds to the selected tab. Also verify Humidity shows a unit/desc label — verified live it currently shows only a bare number ("87") with no "%"-equivalent label, unlike Temperature's "Celsius" desc; confirm with product whether this is intentional (Finding F11). |
| IOT-P08 | P1 | Switch consumption period between week, month, and year | The selected period is visually indicated and the displayed chart/summary updates without layout breakage. *(Verified live 2026-09-28: this is an `nb-select` dropdown with three options — week, month, year — not two; the plan previously omitted "year". The collapsed control only displays the currently selected value as its own button text, so a locator matching a button named "month" will always find nothing until the dropdown is opened — that is not evidence "month" is unsupported. Options render as `<nb-option>` elements with no `role="option"` attribute, so `getByRole('option', ...)` matches zero of them. See Finding F14.)* |
| IOT-P09 | P1 | Select every room in Room Management | Each room can be selected without forcing the click past normal actionability checks; selected styling is visibly applied to the chosen room only, and room-specific content updates correctly. *(Current automation force-clicks the SVG room shapes — see Finding F03. Verified live 2026-09-28: the actual selected-state indicator is an SVG `<g class="selected-room">` wrapping the room shape — its `id` moves between rooms (e.g. Kitchen→0, Bedroom→1, Living Room→2, Hallway→3) and only one room ever carries it at a time. The `<text class="room-text">` label that current automation clicks never itself carries any selected/active class, so no assertion today could verify selection even if one were added without retargeting the locator. See Finding F15. Finding F03 is now resolved, not just assessed: the `<text class="room-text">` label has `pointer-events: none` by design, so clicks on it never reach anything — that is why a normal click times out and why `{force: true}` was used. The sibling `<path class="room-bg">` has `pointer-events: auto` and is the true clickable shape; clicking it directly succeeds with a normal (non-forced) click and correctly moves the `selected-room` indicator. This is not a product defect — it's an intentional "label doesn't block the shape" pattern — but the automation was targeting the wrong element. The fix is to retarget the click at `path.room-bg` scoped to the room's `<g>`, which removes the need for `{force: true}` entirely.)* |
| IOT-P10 | P1 | Review Contacts and Recent contacts, then switch between the two tabs | Contact names, contact type/label, and avatar/image areas render without missing or overlapping content; after switching tabs, the active tab is visibly distinguished and the listed contacts correspond to the selected tab. |
| IOT-P11 | P1 | Inspect Solar Energy Consumption | Used/available values, units, and progress visualization are visible and internally consistent. |
| IOT-P12 | P1 | Inspect Traffic Consumption and weather summary | Chart, period control, date, temperature, and weather metrics render with readable labels and units. |
| IOT-P13 | P1 | Select each of the four security cameras individually | For each camera selected, a distinct selected indicator is applied to that camera only, and any other cameras remain unselected. *(Verified live 2026-09-28: this expected result's premise does not hold against the current build. Clicking any `.camera` tile does not add a "selected" class among four simultaneously visible tiles — it switches the entire card into single-view mode and removes the other three cameras from the DOM outright (tile count goes 4→1, and re-selecting a different camera timed out on a `.click()` because that tile no longer exists). The real state indicator is the single-view/grid-view toggle buttons swapping `appearance-outline`/`appearance-filled`, not a per-camera class. This case needs rewriting around that mechanism rather than a per-tile "selected" assertion. See Finding F16.)* |
| IOT-P14 | P1 | Pause and resume camera playback | Playback state changes correctly and the control label/icon reflects the current state. *(Verified live 2026-09-28: clicking "Pause" produces no observable change at all — the label text stays "Pause" and its icon attribute stays `pause-circle-outline`; the action is fully inert, consistent with the already-noted inertness of Logs/Setup (RVW-010). This case's expected result is not met by the current build — treat as a defect candidate to confirm with product/dev rather than an automation gap. See Finding F17.)* |
| IOT-P15a | P1 | Open camera Logs | The Logs view/panel opens with identifiable log content or an explicit empty state; dashboard remains on the same route. |
| IOT-P15b | P2 | Click the Security Cameras card's Search action | *(Verified live: clicking this icon produces no observable change — no panel, dialog, or input appears anywhere on the page; the global header search's `.form-wrapper` is a separate, unrelated control that this click does not open.)* Confirm with product/dev whether the camera Search action is meant to be functional. If confirmed non-functional by design, downgrade to a simple "does not error or navigate away" check; if it is meant to work, this is a P1 defect, not a coverage gap. |
| IOT-P15c | P1 | Open camera Setup | The Setup view/panel opens with configurable controls or an explicit "not available" state; dashboard remains on the same route. |
| IOT-P16 | P1 | Reload after a normal dashboard interaction | Page returns to a valid dashboard state; no corrupted markup, duplicate widgets, or persistent transient overlay appears. |

### 6.2 Negative cases

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| IOT-N01 | P0 | Navigate to the dashboard with JavaScript disabled or blocked | The page returns HTTP 200 but the Angular app never bootstraps: a bare loading-spinner placeholder is displayed indefinitely. *(Verified live 2026-09-28: with JavaScript disabled, zero dashboard cards render, no console/page errors occur, and no explicit "enable JavaScript" or failure message is ever shown — a "Loading..." text node exists in the markup but is not visually rendered on screen. No interactive controls are exposed, since nothing beyond the spinner ever renders. This resolves the finding raised in review as RVW-009.)* |
| IOT-N02 | P1 | Open the dashboard while an image, chart, or widget asset fails | The remaining dashboard stays usable and the failed area has an understandable fallback rather than broken layout. |
| IOT-N03 | P1 | Interrupt or fail a data request during initial load | A loading/error state is shown; the page does not silently display misleading partial data. |
| IOT-N04 | P1 | Click a device toggle repeatedly during a delayed response | The UI prevents contradictory state updates, duplicate requests, or controls stuck between states. |
| IOT-N05 | P1 | Select a room or camera while its content request is delayed/failed | The user receives a stable loading or error state and can recover by selecting another option or retrying. *(Verified live 2026-09-28: selecting a room and selecting a camera each trigger zero network requests — both are purely client-side state changes with no request to delay or fail. As written, this case's premise does not hold against the current implementation; it cannot be exercised via route mocking unless retargeted at a different request, e.g. the initial page load. Raised in review as RVW-010 — needs a decision on whether to retarget or mark not applicable, rather than being automated as-is.)* |
| IOT-N06 | P2 | Use the header's global search (`nb-search` → `.form-wrapper` → `.search-input`, "Hit enter to search") with empty input, whitespace, and no-match text | Input is handled without a crash; empty/no-match states are clear and no unrelated results are shown. *(Reassigned from the Security Cameras Search icon, which is non-functional per IOT-P15b — this is the only real search input verified on the page, but it is Playground-wide, not camera-specific; confirm it's still in scope before automating.)* |
| IOT-N07 | P2 | Enter very long search text and special characters into the same header search input | Input remains contained and safe; no layout overflow, script error, or unintended interpretation occurs. |
| IOT-N08 | P1 | Click Logs, Setup, or camera controls when the feature has no data | The UI gives an empty state or clear disabled state instead of opening a broken or blank panel. *(Verified live 2026-09-28: clicking Logs and clicking Setup each produce zero DOM change anywhere on the page and zero network requests — confirmed via whole-page element-count and overlay/dialog checks before and after each click. Neither an empty-state panel nor a disabled-state indicator appears; both actions are currently fully inert with no observable feedback at all — a third outcome not covered by this case's original either/or wording. Raised in review as RVW-010.)* |
| IOT-N09 | P1 | Use browser Back/Forward after selecting a dashboard control | Navigation remains valid and does not create duplicate dashboard instances or stale overlays. |
| IOT-N10 | P1 | Go offline after the page loads and interact with controls | The app does not crash; unavailable actions are disabled or report failure clearly, and existing content remains readable. |

### 6.3 Edge and boundary cases

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| IOT-E01 | P1 | Load at 390x844 mobile viewport | No horizontal scrolling is required for core content; controls and labels remain usable. |
| IOT-E02 | P1 | Load at 1024x768 tablet viewport | Cards, charts, navigation, and controls reflow without overlap or clipped text. |
| IOT-E03 | P1 | Zoom browser to 200% | Content remains operable; text and controls do not overlap or become unreachable. |
| IOT-E04 | P1 | Resize continuously from desktop to mobile | Layout transitions without duplicated elements, visual corruption, or lost selected state. |
| IOT-E05 | P1 | Rapidly alternate rooms, periods, cameras, and theme | Final selected states are consistent with the last action and unrelated widgets do not change unexpectedly. |
| IOT-E06 | P1 | Toggle all device controls on, then all off | Every control remains independently addressable and the final states are correct. |
| IOT-E07 | P1 | Verify zero, maximum, and decimal display values when supplied by mocked data | Values retain correct units, precision, progress bounds, and readable formatting; negative or over-maximum values are rejected or represented safely. |
| IOT-E08 | P1 | Refresh at the top and after scrolling to the bottom | The page restores a usable initial state and no widget is permanently hidden or displaced. |
| IOT-E09 | P1 | Use keyboard only: Tab, Shift+Tab, Enter, Space, and Escape | Focus order is logical, visible focus is present, controls activate without a mouse, and overlays can be dismissed. |
| IOT-E10 | P1 | Inspect with a screen reader/accessibility tree | Interactive controls have unique meaningful names, state changes are announced/exposed, and decorative images are not announced as confusing content. |
| IOT-E11 | P2 | Load in Chromium, Firefox, and WebKit | Core layout, labels, controls, and state changes behave consistently across supported browsers. |
| IOT-E12 | P2 | Load with slow network and CPU throttling | Loading indicators and progressive rendering remain understandable; controls do not appear usable before initialization. |
| IOT-E13 | P2 | Repeatedly reload the page in separate contexts | No memory-like accumulation, duplicate notifications, or state leakage appears between contexts. |
| IOT-E14 | P1 | Tab to a device control (Light, Roller Shades, Wireless Audio, Coffee Maker) and activate it with Enter/Space | The control receives visible keyboard focus and can be toggled without a mouse. *(Verified live: device cards render as plain `nb-card` elements with no `role` or `tabindex`, so this is a likely genuine gap rather than a theoretical one — see Finding F02.)* |
| IOT-E15 | P1 | Attempt to select a room using only the keyboard, and inspect the Room Management floor plan with a screen reader | A room can be selected without a mouse, or the floor plan exposes an equivalent accessible name/role per room. *(Verified live: rooms are plain SVG shapes with no `role` or `tabindex`, and current automation must force-click them — see Finding F03.)* |

## 7. Non-functional Checks

- **Usability:** Labels, units, selected states, and control feedback are understandable without inspecting implementation details.
- **Accessibility:** Keyboard operation, focus visibility, semantic names, color contrast, and meaningful image alternatives.
- **Responsive behavior:** No clipped text, overlapping cards, unusable touch targets, or mandatory desktop-only interaction.
- **Compatibility:** Chromium, Firefox, and WebKit smoke coverage; mobile viewport coverage.
- **Resilience:** Graceful loading, empty, failed-request, offline, and missing-asset states.
- **Observability:** No unexpected page errors or console errors during the smoke flow; failures produce screenshot, trace, and network evidence.

## 8. Automation Priority

1. Automate P0 smoke cases IOT-P01 through IOT-P03.
2. Automate deterministic interactions IOT-P04, IOT-P05, IOT-P08, IOT-P09, IOT-P13, and IOT-P14.
3. Add keyboard/accessibility assertions from IOT-E09, IOT-E10, IOT-E14, and IOT-E15.
4. Add mobile and cross-browser projects for IOT-E01, IOT-E02, and IOT-E11.
5. Use Playwright route mocking for IOT-N02 through IOT-N05 and boundary-value checks in IOT-E07.
6. Keep visual snapshots focused on stable dashboard regions and review them when the demo site's seeded values change. *(No dedicated visual-regression test case currently exists in Section 6 — add one if this becomes a tracked activity. Raised in review as RVW-013.)*
7. Fix `IotDashboardPage.switchTheme()` before automating IOT-P06: it currently only opens the header theme dropdown and never selects an option, so it cannot actually switch the theme, and no existing test calls it (Finding F01).
8. Split the combined camera-actions test into three assertions (Logs/Search/Setup), each checking its own opened view, instead of one click-through ending in a single unrelated visibility check (Findings F06, IOT-P15a–c).
9. ~~Re-evaluate the `{force: true}` click used by `IotDashboardPage.selectRoom()`~~ — resolved: retarget the click at the room's `path.room-bg` (which has `pointer-events: auto`) instead of its `<text class="room-text">` label (`pointer-events: none` by design), which removes the need for `{force: true}` entirely (Finding F03).
10. Rewrite `IotDashboardPage.selectConsumptionPeriod()` to open the `nb-select` dropdown and choose the option by its `nb-option` element, not by matching a same-named button — it currently only "succeeds" for whichever period is already selected, and would fail for `month` or `year` today (Finding F14).
11. Rewrite `IotDashboardPage.selectRoom()`'s companion assertions to target the SVG `<g class="selected-room">` ancestor instead of the clicked `<text>` label, since the label itself never carries selected state (Finding F15).
12. Re-scope IOT-P13 around the single-view/grid-view toggle mechanism instead of a per-tile selected class, and split camera-selection assertions accordingly, since selecting any camera removes the other three from the DOM (Finding F16).

## 9. Defect Severity Guidance

*Note: this severity scale reuses the P0–P3 labels from Section 6's test-case priorities but describes defect impact, not test-case priority — a defect's severity and the priority of the case that found it are independent judgments. (Raised in review as RVW-015.)*

- **P0 blocker:** Dashboard cannot load or the primary page is unusable.
- **P1 critical:** A core device, selector, chart, camera action, or responsive/accessibility workflow is broken.
- **P2 major:** A secondary feature is incorrect, confusing, or inconsistent in one browser/viewport.
- **P3 minor:** Cosmetic issue with no meaningful workflow or comprehension impact.

## 10. Risks and Assumptions

- The dashboard is a public demo and may change its seeded values, assets, or implementation without notice.
- Some widgets may be presentation-only; tests should verify the observable contract and avoid asserting real-world sensor behavior.
- Exact expected numeric ranges should be confirmed with product requirements before turning mocked boundary cases into hard assertions.
- Third-party image, chart, or weather content may introduce intermittent failures; capture network evidence before classifying these as product defects.
- The header "Light"/"Dark" theme selector and the "Light" device card are two unrelated controls that happen to share the word "Light"; test cases and locators must disambiguate them explicitly (Finding F01).
- Device toggle cards and the Room Management floor plan render without native interactive semantics (`role`, `tabindex`) in the current build; until confirmed otherwise with the product/dev team, treat keyboard and screen-reader operability of these two areas as an open defect risk rather than an assumption that they work (Findings F02, F03).
- The Security Cameras card's "Search" action is confirmed non-functional in the current build (no panel, dialog, or input appears on click); IOT-N06/N07 have been reassigned to the header's global search, which is a genuinely different, page-wide control, not a camera-scoped one — re-confirm this is still meaningful in-scope coverage for an IoT-dashboard-focused plan (Finding F12).
- Confirmed live: the Temperature/Humidity tabset's active-state class lives on the tab `<li>` and its `nb-tab` panel, never on the inner `<a>` link — any assertion written against the link's class will always be a false negative/no-op (Finding F13).
- The consumption period control is a 3-option (`week`/`month`/`year`) `nb-select` dropdown whose options render without `role="option"`; automation must target the `nb-option` elements directly rather than ARIA roles or a same-named button, and the collapsed control's button text is only ever the currently selected value (Finding F14).
- The Room Management "selected" state lives on an SVG `<g class="selected-room">` wrapping the room shape, not on the `<text>` label current automation clicks; only one room carries this class at a time (Finding F15).
- Selecting any Security Camera switches the whole card into single-view mode and removes the other three cameras from the DOM entirely; there is no simultaneous multi-camera "selected vs. unselected" state, so IOT-P13 as originally written cannot be automated against the current build (Finding F16).
- The Security Cameras "Pause" action is confirmed inert in the current build (no label, icon, or DOM change on click), the same as Logs/Setup/Search; treat IOT-P14's playback-state expectation as unmet rather than assume it can be automated as written (Finding F17).
