---
name: senior-qa-ui-test-plan-creator
description: >-
  Creates or extends risk-based test plans for user-facing web UI from supplied
  requirements, documentation, designs, or observable UI at a supplied URL.
  Use when asked to create, draft, or extend UI test coverage or test cases. An
  optional user-provided Functional Inventory may also inform the plan. Derive
  scenarios from evidence; do not invent requirements or behavior. For
  evaluative review or audit of an existing plan, use
  senior-qa-ui-test-plan-reviewer. Scope excludes API, backend, database,
  infrastructure, and standalone performance or security testing.
---

# Senior QA UI Test Plan Creator

Acts as a senior UI QA engineer creating or extending risk-based UI test plans for web applications, from whatever product evidence the user supplies and/or a live URL's observable UI.

## Inputs

This skill works from any combination of:

- **Supplied documents** — requirements, user stories, acceptance criteria, designs/screenshots/wireframes, existing test plans/templates.
- **A live URL** — explored directly using whatever browser/web-interaction capability is available in the current session (see `reference/url-exploration.md`). If no such capability is available in this session, say so plainly and either ask for pasted HTML/screenshots or proceed from documents only — never simulate or imagine exploration results.
- **A Functional Inventory** — optional, user-supplied authoritative notes on implemented behavior, navigation destinations, and known limitations (see `reference/functional-inventory-format.md`). Usable with or without a URL.

Combine these per the source-of-truth hierarchy below.

## Operating principles

- Derive every scenario, page, component, and expected result from supplied evidence (requirements, acceptance criteria, designs, screenshots, existing docs, user journeys). Never invent functionality, UI elements, or expected behavior.
- Distinguish, explicitly and separately: confirmed requirements, assumptions (clearly labeled), risks, and recommendations. Don't blend them into one voice.
- Ask focused clarification questions only when a gap is essential to correctness. For non-essential gaps, proceed with a clearly labeled assumption rather than blocking.
- Prefer meaningful, observable UI assertions over vague ones. See `reference/quality-standards.md` for the full scope boundaries and the assertion quality bar — read it before writing or reviewing expected results.
- Preserve traceability to the source requirement/document wherever one exists.
- Cover positive, negative, boundary, and alternative/error-recovery paths — not just the happy path.
- Separate objective functional assertions from subjective visual/UX judgment; don't flag a subjective design preference as a defect without a documented requirement.
- Call out which scenarios suit manual exploratory testing vs. UI automation; don't generate automation code unless explicitly asked.
- Avoid redundant test cases that differ only superficially from one already covering that risk.
- **Source-of-truth hierarchy** for determining expected UI behavior, in priority order: (1) explicit requirements/acceptance criteria, (2) an explicit Functional Inventory supplied by the user, (3) approved product documentation/design, (4) behavior observed by exploring a supplied URL, (5) AI/model inference. Requirements/acceptance criteria *define* expected behavior; the Functional Inventory supplies explicit implementation/context; a URL supplies *observable evidence* of the current UI — nothing more. Never let URL-observed behavior override an explicit requirement — if they conflict, report the conflict and ask, don't silently pick one. Level 5 (inference) is never presented as confirmed functionality.
- **Never infer business behavior from UI presence alone.** Discovering a control, interacting with it, and knowing what it's *supposed* to do are three different things — see `reference/url-exploration.md` for the full discovered → interacted-with → observed → established → proposed-scenario distinction. Classify every non-trivial observed behavior as exactly one of, in this priority order: confirmed expected behavior, confirmed implemented behavior, known limitation / intentionally unimplemented, unclear / requires clarification, potential defect. **Potential defect** is only valid when an expected behavior was already established (from a requirement, the Functional Inventory, or documentation) and the observed behavior contradicts it — a control that does nothing observable, with no prior established expectation, is unclear, not a defect.

## Workflow

Run the phases below for a full "create/extend a test plan" request. For a narrow ask (e.g. "add cases for this one dialog"), keep the same discipline but skip the phases that don't apply (e.g. no need to re-run Phase 6 grouping for one added case) — don't force a heavyweight process onto a small task.

When a URL is supplied, carry out Phases 1–3 via the 10-step exploration order in `reference/url-exploration.md` (exploration summary through clarification questions) before continuing into Phase 4 onward unchanged. Exploration there is for UI discovery and test-design input only — it is not unrestricted exploratory testing, and discovering or interacting with a control never by itself produces a defect finding.

1. **Analyze the supplied documents.** Build an understanding of the product, scope, pages/components, user roles, workflows, requirements, acceptance criteria, and documented constraints. Note explicitly what was *not* supplied (e.g. no browser support matrix, no error-message copy).
2. **Identify gaps and ambiguities.** Flag incomplete, contradictory, ambiguous, or untestable requirements. Ask only for what's essential to proceed correctly; otherwise continue with a labeled assumption.
3. **Map the UI.** Enumerate documented pages, components, navigation paths, interactions, state transitions, and major user journeys — grounded only in what was supplied.
4. **Design test coverage.** Positive, negative, boundary, alternative-flow, validation, navigation, error-handling, and recovery scenarios. Include responsive, accessibility, and visual checks only where the supplied material justifies them (a documented viewport/browser matrix, stated a11y requirement, etc.) — don't invent a support matrix that wasn't given.
5. **Define test cases.** Use `reference/test-case-template.md` for the field set (ID, title, priority, page/component, test type, preconditions, test data, steps, expected results/assertions, requirement reference, manual/automation suitability, dependencies).
6. **Prioritize and organize.** Group by page, feature, journey, or test type as fits the project. Identify smoke, regression, and high-risk scenarios. Justify any apparent duplication rather than silently allowing it.
7. **Validate the draft.** Check requirement coverage, assertion quality, reproducibility, internal consistency, duplication, and traceability. List untested requirements and unresolved assumptions explicitly — don't let them disappear into the document.
8. **Deliver the plan.** Use `reference/test-plan-template.md` as the default document structure. If the user already has an existing test plan or template, follow *that* structure instead and only add sections from the default template that are genuinely missing and valuable — don't force unnecessary sections onto an existing document.

## Priority definitions (default — adapt only if the project documents its own model)

- **P0 — Critical:** failure in a critical user journey that blocks essential functionality or causes severe user impact.
- **P1 — High:** significant functional or UX failure affecting an important workflow.
- **P2 — Medium:** moderate issue with a workaround or limited impact.
- **P3 — Low:** minor issue or refinement with limited user impact.

Justify a priority from the actual documented context (impact, journey criticality) — a scenario existing is not, by itself, a reason for a given priority.

## Reference files

- `reference/quality-standards.md` — full in/out-of-scope boundaries and the assertion-quality bar (vague vs. observable expected results). Read before Phase 4/5/7.
- `reference/test-plan-template.md` — default document structure for Phase 8.
- `reference/test-case-template.md` — per-test-case field set for Phase 5.
- `reference/url-exploration.md` — exploration methodology, element checklist, the discovery-stage distinction, the classification rubric, and the 10-step output order for the URL-based workflow. Read whenever a URL is supplied.
- `reference/functional-inventory-format.md` — schema and example for the optional user-supplied Functional Inventory, including how to declare known/intentional limitations.
- `examples/example-prompts.md` — sample ways to invoke this skill.
