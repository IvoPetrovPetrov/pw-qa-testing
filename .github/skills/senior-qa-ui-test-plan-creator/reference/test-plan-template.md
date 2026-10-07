# UI Test Plan Template

Default structure for Phase 8 (Deliver the plan). If the user already has an existing test plan or template, follow that structure instead and only borrow sections from here that are genuinely missing and valuable. Delete any section below that doesn't apply rather than leaving it as an empty placeholder — an unused section header is worse than no section.

Text in `<...>` is a placeholder to replace. Text in `<!-- -->` is authoring guidance for whoever (or whatever) fills in this template — remove those comments from the delivered plan.

---

# `<Application/Feature>` UI Test Plan

**Prepared by:** `<name>`
**Date:** `<date>`
**Source documentation:** `<list every document, ticket, design file, or transcript actually supplied — this is the traceability anchor for Section 3>`

## 1. Executive Summary

<!-- 3-6 sentences: what this plan covers, overall risk posture, and the headline gaps or assumptions. Write this last, once the rest of the plan exists — don't let it drift from the actual content. -->

## 2. Scope and Objectives

**Objective:** `<what this plan verifies and why, in one or two sentences>`

### In scope
- `<pages/components/journeys, derived only from supplied material>`

### Out of scope
- `<explicitly excluded areas, and why — e.g. "payment processing backend: covered by API test suite, not this plan">`

## 3. Source Requirements and Traceability

<!-- Map each requirement/acceptance-criterion/user-story back to its source, and forward to the test case IDs that cover it. This table is what lets a reviewer answer "is requirement X actually tested?" without reading every case. -->

| Requirement / AC ID | Source | Summary | Covered by (Test Case IDs) |
|---|---|---|---|
| `<REQ-1>` | `<doc name, section>` | `<one line>` | `<IDs>` |

## 4. Assumptions, Dependencies, and Open Questions

<!-- Keep these three categories separate — do not blend a confirmed fact, a guess, and a blocking question into one bullet list. -->

**Assumptions** (labeled explicitly; test cases built on these must say so):
- `<assumption, and why it was necessary>`

**Dependencies** (on out-of-scope areas, only where they affect UI behavior):
- `<e.g. "assumes the API returns a documented error shape; only the UI's handling of that error is tested here">`

**Open questions** (block or limit coverage until answered):
- `<question> — needed because `<what can't be verified without it>``

<!-- Optional — use only when URL exploration (reference/url-exploration.md) produced meaningful unknowns that affect coverage. Do not force this table into every plan; the plain "Open questions" bullets above are sufficient when nothing came from exploration. -->

**Clarifications required from exploration** (optional):

| UI Element / Functionality | Observed | What's Unclear | Why Clarification Is Required | Test Coverage Affected |
|---|---|---|---|---|
| `<element>` | `<what exploration showed>` | `<the specific unknown>` | `<why it can't be resolved from available sources>` | `<which planned/candidate cases this blocks or limits>` |

## 5. UI Coverage Matrix

<!-- One row per page/component/journey. This is the "did we cover everything" view; Section 6 has the actual test cases. -->

| Page / Component / Journey | Positive | Negative | Boundary | Accessibility | Automation Candidate | Notes |
|---|---|---|---|---|---|---|
| `<name>` | `<IDs or "yes/no">` | `<IDs>` | `<IDs>` | `<IDs or "not specified">` | `<yes/no/partial>` | `<gap or caveat>` |

## 6. Detailed Test Cases

<!-- Use reference/test-case-template.md for the field set. Group logically (by page, feature, or journey) rather than as one flat list. -->

### `<Page/Feature/Journey name>`

`<test cases here, using the test-case-template.md fields>`

## 7. Risk-Based Prioritization

<!-- Priority definitions live in SKILL.md. Justify each P0/P1 from documented user impact — don't assign a priority just because a scenario exists. -->

| Priority | Test Case IDs | Rationale |
|---|---|---|
| P0 | `<IDs>` | `<why these are critical>` |
| P1 | `<IDs>` | |
| P2 | `<IDs>` | |
| P3 | `<IDs>` | |

## 8. Manual vs. Automation Recommendations

| Test Case ID | Recommendation | Rationale |
|---|---|---|
| `<ID>` | `<manual / automate now / automate later / exploratory only>` | `<stability, value, maintenance cost>` |

## 9. Smoke and Regression Grouping

**Smoke set** (must pass before any further testing): `<IDs>`
**Regression set** (run each cycle): `<IDs>`
**Exploratory-only** (not suited to a fixed script): `<IDs, with why>`

## 10. Coverage Validation and Residual Gaps

<!-- The Phase 7 checkpoint, written down rather than just performed silently. -->

- Requirements with no covering test case: `<list, or "none">`
- Assumptions still unresolved at delivery time: `<list, or "none">`
- Known residual gaps and why they weren't closed: `<list, or "none">`
