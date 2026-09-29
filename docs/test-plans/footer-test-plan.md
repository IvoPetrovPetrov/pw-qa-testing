# Footer UI Test Plan

**Application:** Bondar Academy UI Playground — Footer (component under test on the IoT Dashboard page)
**URL:** https://playground.bondaracademy.com/pages/iot-dashboard
**Prepared by:** QA Engineering
**Date:** 2026-09-29
**Test type:** Functional UI, negative, boundary, and accessibility testing (component-level)
**Source documentation:** User-supplied footer element description (chat, 2026-09-29), cross-checked live on 2026-09-29 via a throwaway Playwright script run against the real page (no MCP browser tool was available, so a disposable Node script using the repo's own `@playwright/test` dependency was used instead; the script was deleted after use). "Verified live" notes below reflect that pass, following the same annotation convention as `header-test-plan.md` / `iot-dashboard-test-plan.md`.

## 1. Objective

Verify that the footer's two attribution links (Akveo, Bondar Academy) and four social icons (GitHub, Facebook, Twitter, LinkedIn) render correctly and navigate correctly when interacted with, including via keyboard.

*Verified live 2026-09-29: the footer is a global layout component (`<nav class="fixed"><ngx-footer>…`), confirmed present with identical markup on both `/pages/iot-dashboard` and `/pages/dashboard` — same as the header (per `header-test-plan.md` Section 1). This plan's cases apply wherever the footer appears, not only on the IoT Dashboard page.*

## 2. Scope

### In scope
- "Created by Akveo" text and its hyperlink → confirmed live: `href="https://akveo.page.link/8V2f"`, `target="_blank"`, anchor wraps only the word "Akveo"
- "Modified by Bondar Academy" text and its hyperlink → confirmed live: `href="https://www.bondaracademy.com"` (note: resolves to `www.` — the originally supplied requirement said `https://bondaracademy.com/` without `www.`; functionally the same destination but the literal `href` differs, see Section 10), `target="_blank"`, anchor wraps only "Bondar Academy"
- Four social icons (GitHub, Facebook, Twitter, LinkedIn): hover affordance and click behavior. Confirmed live: each is `<a href="#" target="_blank" class="ion ion-social-*">` with no text content — clicking opens a new tab that resolves `#` against the current page URL, landing back on `https://playground.bondaracademy.com/pages/iot-dashboard` (or whichever page the footer is on), matching the supplied requirement.
- New-tab (`target="_blank"`) behavior and `rel` hygiene for all six links
- Keyboard access and accessible naming of the above

### Out of scope
- Any other page content (cards, charts, header, sidebar) — covered by `docs/test-plans/iot-dashboard-test-plan.md` and `docs/test-plans/header-test-plan.md`
- Content of the destination pages (`akveo.page.link/8V2f`, `bondaracademy.com`) — only that navigation to them occurs correctly
- Security/penetration testing

## 3. Test Approach

- Independent tests, fresh page load, default state each time.
- Prefer user-facing locators (visible text, accessible name) over implementation details (CSS classes, icon font names).
- New-tab assertions: verify via Playwright's `page.waitForEvent('popup')` (or context `page.on('page')`) rather than only checking the `target` attribute, since an attribute can be present without actually working.
- Run the smoke set on Chromium, Firefox, and WebKit, reusing the projects already configured for the IoT dashboard/header plans.
- Run responsive checks at the same viewport set as the other Playground plans: 1440x900, 1024x768, 390x844.
- Where behavior is not confirmed from the supplied description (icon `aria-label`s, hover visual, anchor scope of the attribution text), write the case with an explicit `<UNCONFIRMED>` expected result rather than guessing — see Section 10.

## 4. Preconditions and Test Data

- The URL is reachable over HTTPS; browser JavaScript and cookies are enabled; pop-up blocking is not enforced by the test browser context (new tabs must be observable).
- Each test starts from a fresh load of the IoT Dashboard page, scrolled so the footer is in view.
- No specific test data is required.

## 5. Entry and Exit Criteria

**Entry criteria**
- Test environment is available and the IoT Dashboard page responds.
- A supported browser build is installed.

**Exit criteria**
- All P0/P1 cases have passed or have an approved defect.
- Open questions in Section 10 are either answered or explicitly accepted as residual risk.
- Cross-browser smoke and mobile layout checks are complete.

## 6. Test Case Matrix

### 6.1 Smoke and positive cases

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| FTR-P01 | P1 | Load a page with the footer (e.g. IoT Dashboard) and scroll the footer into view | The footer displays, in order: "Created by Akveo" text with its hyperlink, "Modified by Bondar Academy" text with its hyperlink, and four social icons (GitHub, Facebook, Twitter, LinkedIn), all visible without further interaction. *(Verified live: exact markup is `<span class="created-by">Created by <b><a>Akveo</a></b>. Modified by <b><a>Bondar Academy</a></b>. </span>` followed by `<div class="socials">` containing the four icon anchors, in GitHub → Facebook → Twitter → LinkedIn order.)* |
| FTR-P02 | P1 | Click the Akveo hyperlink | A new browser tab opens navigating to `https://akveo.page.link/8V2f`; the original tab remains on the same page, unchanged. *(Verified live: exact `href` confirmed.)* |
| FTR-P03 | P1 | Click the Bondar Academy hyperlink | A new browser tab opens navigating to `https://www.bondaracademy.com`; the original tab remains on the same page, unchanged. *(Verified live: the actual `href` is `https://www.bondaracademy.com` — with `www.` — not `https://bondaracademy.com/` as originally described; assert the exact live value, not the originally supplied one.)* |
| FTR-P04 | P2 | Hover the mouse over each of the four social icons in turn, without clicking | Each icon shows a visible hover affordance and a pointer cursor. *(Verified live on the GitHub icon: computed `color` changes from `rgb(143, 155, 179)` (muted gray-blue) to `rgb(34, 43, 69)` (dark navy) on `:hover` — a real, assertable CSS change via `getComputedStyle`. Not independently re-verified for the other three icons, but they share the same `.socials a` styling, so the same rule is expected to apply.)* |
| FTR-P05 | P1 | Click each of the four social icons (GitHub, Facebook, Twitter, LinkedIn) individually, one per test iteration | For each icon, a new browser tab opens landing back on the current page's URL. *(Verified live: each icon anchor is `<a href="#" target="_blank" class="ion ion-social-{network}">` with no real destination — `#` resolves relative to the current document, so the "new tab" is just a duplicate of the page the footer is on. This is not a per-icon custom redirect; it's the same placeholder mechanism on all four. See confirmed Finding FF01 in Section 10 — this is very likely unintended/placeholder behavior, not a deliberate design choice, and should be raised with product/dev.)* |

### 6.2 Negative cases

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| FTR-N01 | P2 | Ctrl-click (or middle-click) the Akveo link, the Bondar Academy link, and each social icon | Each still opens correctly in a new/background tab via native browser handling. *(High-confidence, not independently re-tested for the ctrl-click gesture specifically: all six are confirmed live to be real `<a href>` elements — not JS-only `onclick` handlers — so native modifier-click handling is expected to work without extra code. Automate to lock this in.)* |
| FTR-N02 | P1 | Click each of the six footer links and confirm the state of the *original* tab afterward | The original tab's URL and content remain exactly unchanged — no same-tab navigation occurs for any of the six links. *(Consistent with `target="_blank"` confirmed live on all six.)* |
| FTR-N03 | P2 | Inspect the `rel` attribute on each of the six links that opens a new tab | **Confirmed live defect, not just a candidate:** none of the six footer links (`Akveo`, `Bondar Academy`, or the four social icons) has a `rel` attribute at all — `rel` is `null` on every one. All six open `target="_blank"` without `rel="noopener"`, a real reverse-tabnabbing exposure (the opened page can access and redirect `window.opener`). Raise as a defect; priority raised from P3 to P2 since this is confirmed, not hypothetical. |
| FTR-N04 | P2 | Inspect whether the entire attribution phrase ("Created by Akveo" / "Modified by Bondar Academy") is clickable, or only the company name | **Confirmed live:** only the company name is the link — the anchor wraps just `Akveo` / just `Bondar Academy` (each inside a `<b>`); the surrounding text ("Created by ", ". Modified by ", ". ") is plain, non-clickable text in the same `<span class="created-by">`. |

### 6.3 Edge, boundary, and accessibility cases

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| FTR-E01 | P2 | Tab through the footer using only the keyboard | All six interactive elements (2 text links + 4 icons) receive visible focus, in a logical left-to-right order, with no dead stops or skipped elements. *(Verified live that none of the six anchors carries `tabindex="-1"` or is otherwise removed from the tab order — all are native, unmodified `<a>` elements, so default browser tab behavior applies. Actual visual focus-ring styling and exact tab sequence not independently walked key-by-key; confirm during automation.)* |
| FTR-E02 | P2 | With each footer link focused via keyboard, press Enter | Each activates identically to a mouse click (per FTR-P02/P03/P05) — opens the same destination in a new tab. |
| FTR-E03 | P1 | Inspect the accessible name of each social icon (e.g. via the accessibility tree / screen reader) | **Confirmed live defect, priority raised from P2 to P1:** all four social icons have `aria-label="null"` and empty text content (`textContent` is `""` — the icon glyph is rendered purely via a CSS `::before`/icon-font class, `ion ion-social-*`, with no accessible text at all). A screen reader announces these as unlabeled links with no distinguishing name — a real accessibility defect, not just a risk. |
| FTR-E04 | P3 | Load the footer at 1440x900, 1024x768, and 390x844 | Both text links and all four icons remain visible and reachable (not clipped) at each size. *(Verified live at 390x844: the footer wraps to two rows — the two text links stack into two lines on the left, and the four social icons wrap into a 2x2 grid on the right — but every one of the six links stays fully visible with a non-zero bounding box; nothing is clipped or hidden.)* |
| FTR-E05 | P3 | Run the smoke set (FTR-P01–P05) in Chromium, Firefox, and WebKit | Footer renders and all links behave consistently across all three engines. *(Live check performed on Chromium only; Firefox/WebKit not independently verified this pass.)* |

## 7. Non-functional Checks

- **Accessibility:** Icon-only links need accessible names (FTR-E03); keyboard reachability and activation (FTR-E01/E02).
- **Security hygiene:** `rel="noopener"` on all `target="_blank"` links (FTR-N03).
- **Responsive behavior:** No clipped/overlapping footer content at mobile width (FTR-E04).
- **Compatibility:** Chromium, Firefox, WebKit smoke coverage (FTR-E05).
- **Resilience:** No console/page error from hover or click on any of the six links.

## 8. Automation Priority

1. Automate P0/P1 smoke now: FTR-P01, FTR-P02, FTR-P03, FTR-P05, FTR-E03 — all now have confirmed, exact live values (hrefs, DOM structure, missing accessible names), so there's nothing left to guess. Reuse one popup-detection helper across all "opens new tab" cases rather than writing it three times.
2. Automate FTR-N02–N04 alongside the above — same locators, confirmed values, low maintenance cost.
3. Automate FTR-N03 (missing `rel="noopener"`) as a real regression guard, not a speculative check — it's a confirmed current defect; the test should currently fail (or explicitly assert-and-flag the vulnerable state) until product/dev fixes it, the same "document the current behavior" pattern used for the header's Finding HF01.
4. Automate FTR-P04 (hover color change) now that an exact `getComputedStyle` assertion is confirmed for the GitHub icon; extend to the other three icons in the same pass since they share the same CSS rule.
5. Automate FTR-E01/E02 (keyboard) — tab order/reachability is unblocked (no `tabindex="-1"` found), but do one manual key-by-key pass first to confirm the exact visual sequence before locking in assertions.
6. Automate FTR-N01 (ctrl/middle-click) as a quick confirmation pass — low risk given confirmed real anchors, but cheap to lock in.
7. Reuse the existing cross-browser/viewport Playwright projects already set up for the IoT dashboard/header plans (FTR-E04/E05) rather than duplicating config; FTR-E05 only ran on Chromium this pass, so include Firefox/WebKit when this is wired into the suite.

## 9. Defect Severity Guidance

Reuses the same P0–P3 defect severity scale already defined in `docs/test-plans/iot-dashboard-test-plan.md` Section 9 (shared across Playground plans) — not duplicated here.

## 10. Risks and Assumptions

- **Live verification performed 2026-09-29** via a throwaway Playwright/Node script against the real page (no MCP browser tool was available in-session, so the repo's own `@playwright/test` dependency was used directly; the script was deleted after use, per the disposable-script convention — it's not part of the committed test suite). This resolved every item that was previously `<UNCONFIRMED>` in the first draft of this plan; see the inline "Verified live" notes in Section 6.
- **Finding FF01 (confirmed):** all four social icons (`<a href="#" target="_blank" class="ion ion-social-*">`) have no real destination at all — `href="#"` simply resolves back to whatever page the footer is on. This is why all four "redirect to the IoT Dashboard page" per the original requirement: it's an artifact of a placeholder `href`, not four icons deliberately pointed at the same URL. This is very likely unintended/unfinished markup (real GitHub/Facebook/Twitter/LinkedIn profile links were probably intended) and should be raised with product/dev — test cases assert the current behavior (FTR-P05) so a real fix is caught as a change, not silently ignored, matching the pattern the header plan uses for its Finding HF01.
- **Finding FF02 (confirmed):** none of the six footer links (both attribution links and all four social icons) has a `rel` attribute — all open `target="_blank"` with no `rel="noopener"`, a real reverse-tabnabbing exposure. Raised in FTR-N03 as a P2 defect to fix, not merely to test around.
- **Finding FF03 (confirmed):** the four social icon links have no accessible name whatsoever (no `aria-label`, no text content — the glyph is a bare icon-font class). Screen reader users get an unlabeled link with no way to distinguish GitHub from LinkedIn. Raised in FTR-E03 as a P1 accessibility defect.
- **Resolved:** the footer is confirmed to be a global layout component, present with identical markup on at least two pages (`/pages/iot-dashboard`, `/pages/dashboard`) — same pattern as the header. Section 1/2 updated accordingly.
- **Resolved:** the Bondar Academy link's actual `href` is `https://www.bondaracademy.com` (with `www.`), not `https://bondaracademy.com/` as originally described — likely the same effective destination, but test the literal live value (FTR-P03), not the originally supplied one.
- **Residual gap:** FTR-E05 (cross-browser) was only exercised on Chromium this pass; Firefox/WebKit not independently confirmed. FTR-N01 (ctrl/middle-click) and the hover check for the Facebook/Twitter/LinkedIn icons (only GitHub's hover color was directly measured) are inferred from shared markup/CSS rather than individually measured — low risk, but flagged rather than silently assumed.
