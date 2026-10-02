# Datepicker UI Test Plan

**Application:** Bondar Academy UI Playground — Forms › Datepicker
**URL:** https://playground.bondaracademy.com/pages/forms/datepicker
**Prepared by:** QA Engineering
**Date:** 2026-09-30
**Test type:** Functional UI, negative, boundary, and accessibility testing (page-level)
**Source documentation:** User-supplied list of seven scenarios (chat, 2026-09-30), the existing page object `UI/pages/datepicker-page.ts`, and a live pass on 2026-09-30 using two throwaway Playwright/Node scripts run against the real page (Chromium only, 1440x900 plus one 390x844 check). The scripts were deleted after use. "Verified live" notes reflect that pass, following the convention of `footer-test-plan.md` / `header-test-plan.md`. No requirements document, design, or acceptance criteria was supplied, so expected results come from the user's scenarios and observed behavior, and each is labeled accordingly.

## 1. Objective

Verify that the three Nebular datepickers on the page (Common, With Range, With Disabled Min Max Values) render, open, close, navigate, and select dates correctly, and that the value shown in each input matches the date the user picked.

*Verified live 2026-09-30:* the page has exactly three `nb-card` sections, headed "Common Datepicker", "Datepicker With Range" and "Datepicker With Disabled Min Max Values". Each holds one text input (placeholders `Form Picker`, `Range Picker`, `Min Max Picker`). The inputs are not read-only or disabled, so typing is possible (see DPK-N04/N05). The calendar renders in the global `nb-overlay-container`, not inside the card.

## 2. Scope

### In scope
- Page load and presence of the three datepicker cards
- Initial input state (placeholder text, empty value)
- Opening and closing each calendar (click, click outside, select a date; Escape and focus are observed)
- Current-date highlighting (`today`) and selected-date highlighting
- Date selection and the formatted value shown in the input
- Range selection (start, end, highlighted range, reopen state)
- Min/Max restrictions (disabled cells, month navigation, blocked selection)
- Month/year navigation, including the view-mode switch to a year list
- Keyboard and accessibility basics; one mobile-width check

### Out of scope
- Other pages under Forms (Form Layouts etc.), covered by `tests/form-layouts.spec.ts` and its own plans
- Header, sidebar and footer (see `header-test-plan.md`, `footer-test-plan.md`)
- Nebular library internals; only user-visible behavior is tested
- Locale/timezone testing (not documented), other than the date-relativity risk in Section 10
- Security/performance testing

## 3. Test Approach

- Independent tests, fresh page load, default state each time.
- **All "today"-based expectations must be computed at runtime** (`new Date()`), never hard-coded. The Min/Max calendar's enabled window is relative to today (see Section 6.4).
- Prefer user-facing locators (placeholder, header text) for the inputs. Calendar cells have no accessible role or label, so use the Nebular tags/classes (`nb-calendar-day-cell`, `.today`, `.selected`, `.disabled`, `.bounding-month`), scoped to `nb-overlay-container`. This is a stability trade-off; see Section 8.
- Select "random" dates from **enabled, in-month** cells only. Exclude `.bounding-month` cells in the generic selection cases (they select the neighbouring month; covered separately in DPK-B01/B03/B04) and pick by cell content with `exact: true`, because `getByText('1')` would also match 10-19, 21, 31.
- Assert the closed state as `toHaveCount(0)` on the calendar in `nb-overlay-container`, with web-first assertions (no fixed sleeps).
- Where behavior is unclear, the case is written with an explicit `<UNCONFIRMED>` result rather than a guess, and listed in Section 10.

## 4. Preconditions and Test Data

- The URL is reachable over HTTPS; JavaScript is enabled.
- Each test starts from a fresh load of the datepicker page at 1440x900 unless stated.
- Test data: none required. The date to select is any enabled in-month day (Common/Range) or a day inside the Min/Max window.
- Observed date format in the input: `MMM d, yyyy` (e.g. `Sep 15, 2026`); range: `MMM d, yyyy - MMM d, yyyy`.

## 5. Entry and Exit Criteria

**Entry:** environment reachable; the page loads with all three cards.
**Exit:** all P0/P1 cases passed or have an approved defect; open questions in Section 10 answered or accepted as residual risk; smoke set green on the target browsers.

## 6. Test Case Matrix

### 6.1 Page and initial state (your scenarios 1-3)

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| DPK-P01 | P0 | Load the datepicker page | URL is `/pages/forms/datepicker`; three cards are visible; no calendar overlay is open. *(Verified live. Page `<title>` is the generic `ui-playground-bondaracademy`, so use URL plus card headers as the load signal, not the title.)* |
| DPK-P02 | P1 | Verify the three cards are presented | Headers "Common Datepicker", "Datepicker With Range" and "Datepicker With Disabled Min Max Values" are visible, in that order, each with exactly one input. |
| DPK-P03 | P1 | Verify the predefined text in each input before any interaction | Inputs show the placeholders `Form Picker`, `Range Picker` and `Min Max Picker` respectively, and each input's value is empty. *(Verified live: the "predefined text" is the **placeholder**; the actual value is `""`. Assert `toHaveAttribute('placeholder', ...)` and `toHaveValue('')`; `toHaveText` is the wrong assertion.)* |

### 6.2 Open / close behavior (your scenarios 4-6)

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| DPK-P04 | P0 | Click each of the three inputs in turn (fresh load each time) | A calendar appears in the overlay: `nb-calendar` for Form and Min Max, `nb-calendar-range` for Range. Only one calendar is open. Header shows the current month and year (e.g. "September 2026"), with weekday row Su-Sa. |
| DPK-P05 | P1 | With a calendar open, click on an empty area outside it | The calendar disappears (overlay count 0) and the input value is unchanged. *(Verified live for Form Picker; Range verified with a start-only selection, see DPK-N03.)* |
| DPK-P06 | P0 | Open each calendar and inspect the highlighted "today" cell | Exactly one cell carries the `today` class; its number equals today's day-of-month and the header equals today's month/year. Nothing is `selected` and the input stays empty. *(Verified live: `today = 30` on 2026-09-30, no selected cells. Compute the expected day at runtime.)* |
| DPK-P07 | P2 | Click the "today" cell in the Common calendar | Input value becomes today's date formatted `MMM d, yyyy` (verified live: `Sep 30, 2026`) and the calendar closes. |
| DPK-E01 | P2 | Focus an input via keyboard (Tab / `.focus()`) without clicking | Calendar opens on focus. *(Verified live on Form Picker; other two inputs share the same Nebular directive but were not individually checked.)* |
| DPK-E02 | P2 | With the Common calendar open, press Escape | **Observed: calendar stays open** (verified live for Form and Min Max). Escape is the expected close key for a popup, so raise as an accessibility finding (DF02) after product confirms, and assert the current behavior meanwhile. |
| DPK-E03 | P3 | Open the Common calendar, then click the Range input | Only one calendar is visible afterwards (verified live: overlay count 1). Which one remains was not asserted; confirm during automation. |

### 6.3 Selection: Common and Range (your scenario 7 plus range flow)

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| DPK-P08 | P0 | Common: open, click a random enabled in-month day (e.g. 15) | Calendar closes; input value is the selected day in the header's month/year, formatted `MMM d, yyyy` (verified live: 15 → `Sep 15, 2026`). Assert the *specific* day picked, not merely that a value exists. |
| DPK-P09 | P1 | Common: reopen after DPK-P08 | Header shows the selected month; exactly one cell is `selected` and it is the picked day (verified live: `15`). |
| DPK-P10 | P0 | Range: click start day (10), then end day (20) | After the first click the input shows only `Sep 10, 2026` and the calendar **stays open**. After the second it shows `Sep 10, 2026 - Sep 20, 2026` and the calendar closes. *(Verified live.)* |
| DPK-P11 | P1 | Range: reopen after DPK-P10 | Start cell (10) has `start` class; cells 10-20 carry `in-range`/`selected`; cells outside the range do not. *(Verified live: 10 has `in-range start selected`; the end cell class name was not captured, so assert cells 10-20 are `selected` and confirm the end-marker class during automation.)* |
| DPK-P12 | P2 | Navigate to next and previous month with the arrow buttons (Common) | Header changes September 2026 → October 2026 → back through August 2026 (verified live); day grid re-renders for the shown month. |
| DPK-P13 | P1 | Common: year → month → day flow. Click the header ("September 2026"), pick year 2024, pick month Mar, pick day 7 | Header goes "September 2026" → year page `2016 - 2027` → month view headed `2024` (Jan-Dec) → day grid headed `March 2024`. After clicking 7 the calendar closes and the input shows `Mar 7, 2024`. Reopening shows `March 2024` with only 7 `selected`. *(Verified live. Assert the specific picked year/month/day, not just that a value exists. Choosing a year or month alone does **not** set the input or close the calendar.)* |
| DPK-P16 | P2 | Common: year page and month-view arrows | In the year view the prev arrow moves the page `2016 - 2027` → `2004 - 2015` (12-year pages). In the month view the next arrow moves the year `2004` → `2005`. *(Verified live.)* |
| DPK-P17 | P1 | Range: year → month → day flow. Open Range Picker, click the header, pick 2025, pick Feb, then click day 3 and day 9 | Header goes `2016 - 2027` → `2025` → `February 2025`. After the second day click the input shows `Feb 3, 2025 - Feb 9, 2025` and the calendar closes. *(Verified live. The Range header is also a clickable button.)* |
| DPK-B01 | P2 | Common: select a day from the **previous** month's leading cells (Sep 2026 grid shows Aug 30, 31) | Clicking `30` in the leading cells sets the input to `Aug 30, 2026` and closes the calendar. Assert the *previous* month/year in the value, not the displayed one. *(Verified live. Leading cells carry the `bounding-month` class.)* |
| DPK-B03 | P2 | Common: select a day from the **next** month's trailing cells (Sep 2026 grid shows Oct 1, 2, 3) | Clicking `3` in the trailing cells sets the input to `Oct 3, 2026` and closes the calendar; reopening shows header `October 2026` with `3` selected. *(Verified live. The header follows the selected date, unlike the Aug 30 case, which was not reopened, so check the reopen header for both.)* |
| DPK-B04 | P2 | Min Max: click an **enabled** out-of-month cell (Oct 1 in the trailing cells of the Sep 2026 grid) | Input shows `Oct 1, 2026`. Disabled out-of-month cells (e.g. Aug 30) are not selectable, same as DPK-N01. *(Verified live for the enabled case; the disabled out-of-month click was not tested. Results depend on the run date, since the window is relative to today; only run when the grid actually shows enabled out-of-month days.)* |

### 6.4 Min/Max restrictions

*Verified live 2026-09-30 (today = Sep 30):* enabled days were Sep 25-30 and, after navigating next, Oct 1-5; every other day was `disabled`, and two further months forward showed 0 enabled days. **Inferred rule: min = today − 5 days, max = today + 5 days** (an 11-day window). This is a runtime-relative window, so compute it, never hard-code.

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| DPK-P14 | P0 | Open Min Max calendar | Enabled cells are exactly today−5 … today+5 (crossing into the adjacent month when needed); all other days carry `disabled` (verified live: 26 disabled of 35 cells shown for September). |
| DPK-P15 | P0 | Click an enabled day (first enabled = today−5) | Calendar closes; input shows that date (verified live: `Sep 25, 2026`). |
| DPK-N01 | P0 | Click a disabled day (e.g. the 15th) | Input value stays empty and the calendar stays open (verified live). |
| DPK-B02 | P1 | Boundary: select each edge (today−5, today+5) and try each edge±1 | Edges are selectable; the days just outside (today−6, today+6) are disabled and not selectable. Cross-month case: run when today is within 5 days of month end/start. |
| DPK-N02 | P2 | Navigate month arrows to months outside the window | Outside months show 0 enabled days (verified live: next+2 and prev-3 showed 0). Navigation itself is **not** blocked; arrows remain enabled. `<UNCONFIRMED>` whether that is intended. |

### 6.5 Negative and input-handling cases

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| DPK-N03 | P2 | Range: click only a start day, then click outside | Calendar closes and no full range is formed (verified via automation: the value never contains ` - `). *(Updated 2026-09-30: which exact value the input is left with — empty vs. the lone start day — was not consistent across probes depending on exactly where/how the outside click landed; automation asserts only the stable part. See Q5.)* |
| DPK-N04 | P2 | Range: click end-before-start (20, then 10) | **Updated 2026-09-30, verified via automation on all 3 engines:** the picker normalises the pair into an ascending range, `Sep 10, 2026 - Sep 20, 2026`, and the calendar closes. My initial manual read (`Sep 20, 2026` only) was a stale observation — most likely read before the range settled. Q2 is resolved: this is graceful, intended-looking behavior, not a defect. |
| DPK-N05 | P2 | Type a valid date (`Jan 5, 2024`) into the Common input and press Enter | Value is accepted as typed (verified live). Whether the calendar syncs to Jan 2024 was not checked. |
| DPK-N06 | P2 | Type invalid text (`garbage`) into the Common input, Enter, click away | **Observed:** the text stays in the input, with no error styling (class list unchanged) and no message. Raise as finding DF01 (no validation feedback); confirm with product (Q4). |
| DPK-N07 | P1 | Type an out-of-range date (`Jan 1, 2000`) into the Min Max input, Enter, click away | **Observed:** value `Jan 1, 2000` is retained, with no error styling. The min/max rule can be bypassed by typing. Raise as finding DF03 (see Q4). |

### 6.6 Accessibility and responsive

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| DPK-E04 | P2 | Inspect the accessible naming of the three inputs and the calendar controls | **Observed:** inputs have no `id`, `name`, `aria-label` or `aria-labelledby`; only the placeholder names them. Prev/next month buttons have no text or `aria-label` (icon-only). Raise as finding DF04. |
| DPK-E05 | P3 | Load at 390x844 and open the Common calendar | Calendar renders fully inside the viewport (verified live: box x=30, width 330 within 390). |
| DPK-E06 | P3 | Run the smoke set (DPK-P01, P04, P08, P10, P14/15) on Chromium, Firefox, WebKit | Identical behavior. *(Live check Chromium only.)* |

## 7. Non-functional Checks

- **Accessibility:** input labelling and unlabeled icon buttons (DPK-E04); Escape (DPK-E02); keyboard opening (DPK-E01).
- **Responsive:** calendar fits mobile width (DPK-E05).
- **Compatibility:** three-engine smoke (DPK-E06).
- **Resilience:** no console or page error while opening, navigating and selecting.

## 8. Automation Priority and Page-Object Review

**Automate now (P0/P1):** DPK-P01-P06, P08-P11, P14, P15, N01, B02, N07 (current behavior).
**Automate now (new, verified):** DPK-P13, P17 (year/month/day flows), B01, B03 (out-of-month selection). DPK-P16, B04 are P2, automate with the batch.
**Automate after confirmation:** DPK-E02 (Escape), N04 (reverse range), N02.
**Exploratory:** keyboard arrow-key navigation inside the grid and screen-reader announcements. Not walked, and not automation-friendly.

**Review of `UI/pages/datepicker-page.ts`.** The card and input locators are reliable and match the live DOM. Gaps against the cases above:

| Missing locator | Needed by | Suggested selector (verified live) |
|---|---|---|
| Card headers | DPK-P02 | `nb-card-header` inside each card |
| Day cells (Common, Min Max) | P06-P09, P14-P15, N01, B02 | `nb-overlay-container nb-calendar-day-cell` |
| Day cells (Range) | P10, P11, N03, N04 | `nb-overlay-container nb-calendar-range-day-cell` *(different tag from the single calendar)* |
| Today / selected / disabled / out-of-month cells | P06, P09, P14, N01 | `.today`, `.selected`, `.disabled`, `.bounding-month` on the cell |
| Range markers | P11 | `.in-range`, `.start` on the range cell |
| Prev / next month buttons | P12, N02 | `.prev-month`, `.next-month` (no text or aria-label) |
| Header / view-mode button | P13, P06 | `nb-calendar-view-mode button` (text = "September 2026") |
| Year and month cells | P13, P16, P17 | no reliable tag/class identified for year cells; month cells are `nb-calendar-month-cell`. Use `getByText('2024', { exact: true })` and `getByText('Mar', { exact: true })` scoped to the calendar (verified live) |

Notes on the existing locators: `formPickerCalendar` and `minMaxPickerCalendar` are identical (`nb-overlay-container nb-calendar`), which is correct because only one calendar is open at a time, but a single shared locator would be clearer. The card locators use `hasText`, which is substring-based; it works today because the three headers don't contain each other, so keep an eye on it if headers change.

## 9. Defect Severity Guidance

Reuses the P0-P3 scale defined in `docs/test-plans/iot-dashboard-test-plan.md` Section 9 (shared across Playground plans); not duplicated here.

## 10. Risks, Findings and Open Questions

**Findings (observed live, need product confirmation before being called defects):**
- **DF01:** Free-text input in the Common picker is accepted without validation or error feedback (DPK-N06).
- **DF02:** Escape does not close an open calendar (DPK-E02).
- **DF03:** The Min/Max restriction only applies to the calendar UI; typing an out-of-range date is accepted (DPK-N07).
- **DF04:** Inputs and month arrows have no accessible name (DPK-E04).

**Open questions:**
- **Q1:** Is min = today−5 / max = today+5 the documented rule? It was inferred from a single day's observation; re-verify on a second date (ideally a month boundary).
- **Q2 (resolved 2026-09-30):** Picking the end date before the start date normalises into an ascending range (`Sep 10 - Sep 20`), confirmed via automation on Chromium, Firefox and WebKit. The plan's original manual observation was stale/mistimed.
- **Q3 (resolved 2026-09-30):** Clicking an out-of-month (`bounding-month`) cell selects that date (Aug 30, Oct 3) and closes the calendar; see DPK-B01/B03/B04. Still open: whether this is intended, and the disabled out-of-month case in Min Max.
- **Q4:** Is typed input meant to be supported and validated, or is this a demo playground where that is out of scope?
- **Q5 (new 2026-09-30):** For DPK-N03 (start-only range, click outside), the input's leftover value varied between empty and the lone start day across manual probes with slightly different outside-click coordinates, with no pattern identified. Automation (`tests/datepicker.spec.ts`) only asserts the part that was stable across 3 engines × 2 repeats: the calendar closes and no full range (` - `) is ever formed. The exact leftover value is a residual gap.

**Risks and assumptions:**
- All "today" expectations depend on the machine's clock and timezone. A test running near midnight, or in a timezone different from the app's, can flake; compute the date once per test and avoid running across midnight.
- Class names (`today`, `selected`, `disabled`, `in-range`, `bounding-month`) are Nebular implementation details and may change with a library upgrade. No user-facing alternative exists (cells have no role or aria labels), so this is an accepted, documented trade-off.
- **Residual gaps:** the exact leftover value for DPK-N03 (Q5); year/month cells have no identified Nebular tag or class (the day cells do), so locate them by exact text within the calendar; the year-view highlight of the current or selected year was not identified; disabled out-of-month click in Min Max not tested; range end-cell class not captured; keyboard grid navigation not covered; the Common calendar's behavior for typed dates (does it sync to the typed month?) not checked.
