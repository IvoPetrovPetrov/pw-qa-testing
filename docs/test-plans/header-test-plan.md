# Header UI Test Plan

**Application:** Bondar Academy UI Playground — Global Header (shared component, present on every page)
**URL:** https://playground.bondaracademy.com/
**Prepared by:** QA Engineering
**Date:** 2026-09-29
**Test type:** Functional UI, negative, boundary, and accessibility testing (component-level)

## 1. Objective

Verify that the header's six controls — sidebar toggle, theme dropdown, search, mail icon, notifications icon, and user menu — render correctly on load and behave correctly when interacted with, including the less common open/close gestures.

## 2. Scope

### In scope
- Sidebar collapse/expand toggle button and its default (expanded) state
- Theme dropdown (4 options) and the app-wide theme change it triggers
- Search button → search box open → type → Enter (closing on Enter is a documented defect — see Finding HF01)
- Mail icon (decorative, no action)
- Notifications ("ring") icon (decorative, no action)
- User icon dropdown: click-to-toggle open/close behavior
- Keyboard access, accessible names, and responsive behavior of the above

### Out of scope
- Sidebar menu item contents/navigation destinations — covered by `tests/sidebar-menu.spec.ts` / a separate plan
- Page body content and other page-specific widgets (e.g. IoT Dashboard cards) — covered by `docs/test-plans/iot-dashboard-test-plan.md`
- Any real search results/backend behavior — the header search's Enter action is not documented as performing a real search
- Security/penetration testing

## 3. Test Approach

- Use independent tests with a fresh page load and known initial state (header always starts expanded/default theme/all menus closed).
- Prefer user-facing locators and assertions on visible state (label text, applied theme class, panel visibility) over implementation details.
- Run the smoke set on Chromium, Firefox, and WebKit.
- Run responsive checks at the same viewport set as the IoT plan: 1440x900, 1024x768, 390x844.
- Where the requirement doesn't define behavior for a transition, write the case with an explicit `<UNCONFIRMED>` expected result rather than guessing — see Section 10.

## 4. Preconditions and Test Data

- The URL is reachable over HTTPS; browser JavaScript and cookies are enabled.
- Each test starts from a fresh page load with the header in its default state (sidebar expanded, default theme, search/user menu closed).
- No specific test data is required; the search box accepts arbitrary text.

## 5. Entry and Exit Criteria

**Entry criteria**
- Test environment is available and any page hosting the header responds.
- A supported browser build is installed.

**Exit criteria**
- All P0/P1 cases have passed or have an approved defect.
- Open questions in Section 10 are either answered or explicitly accepted as residual risk.
- Cross-browser smoke and mobile layout checks are complete.

## 6. Test Case Matrix

### 6.1 Smoke and positive cases

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| HDR-P01 | P0 | Load any page and inspect the header | All six controls (sidebar toggle, theme dropdown, search icon, mail icon, ring icon, user icon) are visible, and the sidebar is in its expanded state without any interaction. |
| HDR-P02 | P1 | Click the sidebar toggle once | The sidebar visually collapses (reduced width / icon-only) and the main content area reflows into the freed space; the toggle's visual/ARIA state updates to reflect "collapsed." |
| HDR-P03 | P1 | Click the sidebar toggle again | The sidebar returns to its original expanded state (matching HDR-P01) with no leftover collapsed styling or duplicated menu items. |
| HDR-P04 | P1 | Open the theme dropdown and select "Dark" | Dropdown closes, its displayed label updates to "Dark," and the applied theme changes app-wide. *(Corroborated by IOT-P06, already verified live: this changes `document.body`'s class from `nb-theme-default` to `nb-theme-dark`; options render as `<nb-option>` with no `role="option"`, so target them directly rather than via `getByRole('option', …)`.)* |
| HDR-P05 | P1 | Repeat for "Cosmic," then "Corporate," then back to "Light" | Each selection updates the label and applied theme class correctly; cycling back to "Light" restores the original theme with no leftover styling from the others. |
| HDR-P06 | P1 | Click the search icon (`nb-search button.start-search`) | A search overlay opens showing an input and helper text. *(Verified live 2026-09-29: the overlay renders as `<nb-search-field>` inside a CDK overlay pane — it is not a DOM descendant of `<nb-search>`, so locate it via `nb-search-field .search-input`, not `nb-search .search-input`. The input's actual placeholder is `"Search..."`; `"Hit enter to search"` is a separate `<span class="info">` label next to it, not the placeholder text.)* |
| HDR-P07 | P1 | With the search box open, type text and press Enter | *(Verified live 2026-09-29 — this expected result does not hold against the current build. Pressing Enter does not close the box, does not navigate, and produces no observable change at all; the overlay simply stays open indefinitely. See Finding HF01. Treat as a defect candidate to confirm with product/dev, the same way the IoT plan documents the inert Pause/Logs/Setup actions (IOT-P14/N08), rather than as a coverage gap.)* |
| HDR-P08 | P1 | Click the user icon once | A dropdown menu (`nb-context-menu nb-menu`) opens near the user icon, listing "Profile" and "Log out". *(Verified live 2026-09-29 — menu content was not specified in the supplied requirement; confirmed the two items directly rather than guessing.)* |
| HDR-P09 | P1 | With the user dropdown open, click the user icon a second time | The dropdown closes and returns to its initial closed state. *(Confirmed by HDR-N05: the control is a simple click-to-toggle — each click flips open/closed — rather than a distinct double-click-only handler; the original "double-click closes" description is consistent with two single-click toggles in a row.)* |

### 6.2 Negative cases

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| HDR-N01 | P2 | Click the mail icon | No dialog, panel, navigation, or DOM/state change occurs anywhere on the page; no console/page error is raised (confirms it is purely decorative, per requirement). |
| HDR-N02 | P2 | Click the ring (notifications) icon | Same as HDR-N01 — no observable change, no error. |
| HDR-N03 | P1 | Press Enter on the search box with empty input | No error or crash occurs. *(Updated per Finding HF01 — the box does not close on Enter regardless of input content, so this case no longer asserts closing; it only confirms empty input doesn't error. Same physical control as IOT-N06, which already covers empty/whitespace/no-match text — don't duplicate that coverage.)* |
| HDR-N04 | P2 | Type a very long or special/script-like string into the search box, then press Enter | Input is handled safely (no layout overflow, no script execution); no crash occurs. *(Updated per Finding HF01 — dropped the "box closes normally" expectation. Cross-reference IOT-N07 — same control.)* |
| HDR-N05 | P2 | Single-click the user icon once while its dropdown is already open | One click opens the menu; a second click while it is open closes the menu. |
| HDR-N06 | P2 | Click elsewhere on the page while the user dropdown is open | The dropdown is closed when clicking elsewhere on the page. |
| HDR-N07 | P2 | Rapidly double-click the sidebar toggle | Sidebar ends in a stable, correct state (matching an even/odd count of registered clicks); no partial or broken transitional layout remains. |
| HDR-N08 | P2 | With the search box open, click its visible close button (`button.close-button`, the "×" icon) | *(Verified live 2026-09-29: clicking this button produces no observable change — the overlay remains open and visible. Part of Finding HF01: the search box currently has no working close mechanism at all — not Enter, not Escape (see HDR-E04), not this close button, and not re-clicking the search toggle icon.)* |

### 6.3 Edge, boundary, and accessibility cases

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| HDR-E01 | P1 | Tab through the header using only the keyboard | Each interactive control receives visible focus in a logical order. If the mail and ring icons — decorative per requirement — are present in the tab order, that's a keyboard-accessibility defect candidate (a focusable dead end), not something to assume away. |
| HDR-E02 | P1 | Operate the sidebar toggle, theme dropdown, and search icon using only Enter/Space | Each activates identically to a mouse click (per HDR-P02/P04/P06). |
| HDR-E03 | P2 | Attempt to open/close the user dropdown using only the keyboard | `<UNCONFIRMED — the control is confirmed to be a click-to-toggle (HDR-N05) and an outside-click closes it (HDR-N06), but it is not confirmed whether Enter/Space can trigger the same toggle, or whether Escape/Tab-away also close it. Likely accessibility gap; raise as a defect candidate rather than assume it works.>` |
| HDR-E04 | P2 | Press Escape while the search box or user dropdown is open | *(Verified live 2026-09-29 for the search box: Escape does not close it — same inertness as Finding HF01. Still `<UNCONFIRMED for the user dropdown — not tested live; don't assume it works.>`)* |
| HDR-E05 | P2 | Inspect the header with a screen reader / accessibility tree | Sidebar toggle, theme dropdown, search icon, and user icon each expose a unique, meaningful accessible name/role. Confirm whether the mail and ring icons are marked decorative (e.g. `aria-hidden`) or are announced despite doing nothing. |
| HDR-E06 | P2 | Load the header at 1440x900, 1024x768, and 390x844 | All six controls remain visible/reachable at each size. On mobile width, confirm whether the sidebar toggle switches to an overlay/off-canvas pattern — a clipped or hidden control at mobile width is a defect. |
| HDR-E07 | P2 | Reload the page after switching the theme and/or collapsing the sidebar | `<UNCONFIRMED — requirement doesn't state whether theme selection or sidebar state persists across reload/navigation. Verify actual behavior and confirm expected behavior with product.>` |
| HDR-E08 | P3 | Run the smoke set (HDR-P01–P09) in Chromium, Firefox, and WebKit | Header renders and behaves consistently across all three engines. |

## 7. Non-functional Checks

- **Usability:** The user menu is a straightforward click-to-toggle with outside-click-to-close (confirmed by HDR-N05/N06) — standard dropdown behavior, no longer flagged as non-standard.
- **Accessibility:** Keyboard operation, focus visibility, semantic names; decorative icons should not create keyboard dead ends.
- **Responsive behavior:** No clipped/hidden controls at mobile width.
- **Compatibility:** Chromium, Firefox, WebKit smoke coverage.
- **Resilience:** No crash or console error from decorative icons or empty/long search input. Note: the search box's non-closing behavior (Finding HF01) is a UX defect candidate, not a crash/resilience risk — it doesn't error, it just never dismisses.

## 8. Automation Priority

1. Automate P0/P1 smoke: HDR-P01–P09, using HDR-P07's corrected (inert) expected result — document the current behavior so a real fix downstream gets caught as a change, not silently ignored, the same pattern the IoT plan uses for its inert Pause/Logs/Setup actions.
2. Automate the cheap, stable no-op checks HDR-N01/N02, and the search-box inertness checks HDR-N03/N04/N08 and the search-half of HDR-E04.
3. Automate HDR-N05 and HDR-N06 now that both behaviors are confirmed.
4. Hold off automating HDR-E03, HDR-E07, and the user-dropdown half of HDR-E04 until the underlying behavior is confirmed live — don't encode a guessed assertion for an undefined transition.
5. Add keyboard/a11y coverage (HDR-E01/E02) alongside the existing IoT plan's equivalent cases.
6. Reuse the cross-browser/viewport Playwright projects already set up for the IoT plan rather than duplicating config.
7. Raise Finding HF01 (search box has no working close mechanism) with product/dev before writing any test that assumes the box closes — confirm whether this is an intended "manual dismiss only" design (if a working dismiss mechanism exists that live testing missed) or a genuine defect.

## 9. Defect Severity Guidance

Reuses the same P0–P3 defect severity scale already defined in `docs/test-plans/iot-dashboard-test-plan.md` Section 9 (shared across Playground plans) — not duplicated here.

## 10. Risks and Assumptions

- **Finding HF01 (defect candidate):** the header search box has no working close mechanism in the current build. Verified live 2026-09-29: once opened via `nb-search button.start-search`, none of the following close it — pressing Enter (HDR-P07), pressing Escape (HDR-E04), clicking the visible close button `button.close-button` (HDR-N08), or clicking the search toggle icon again. The overlay (`nb-search-field` in a CDK overlay pane) simply remains open. This contradicts the originally supplied requirement ("hit enter closes it") and should be confirmed with product/dev rather than assumed fixed by a later build.
- HDR-N05/N06 (user dropdown click-to-toggle and outside-click-to-close) and the theme dropdown/sidebar-collapse mechanics were also verified live 2026-09-29 and behave as documented in Section 6.
- User dropdown menu contents are now confirmed live (HDR-P08: "Profile" and "Log out"). Still unknown or unconfirmed: exact ARIA labels for all six controls, whether Escape or keyboard input can open/close the user dropdown, and state persistence across reload — see the remaining `<UNCONFIRMED>` cases (HDR-E03, HDR-E04's user-dropdown half, HDR-E07).
- The header is assumed identical across all Playground pages; if any page customizes it, these cases may not generalize.
