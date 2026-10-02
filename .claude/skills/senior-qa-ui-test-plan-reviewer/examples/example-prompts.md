# Example Prompts

The skill is invoked automatically when a request matches its description — you don't need to name it explicitly, but you can ("use the senior-qa-ui-test-plan-reviewer skill to...") if you want to force it.

## A normal review

> "Here's our UI test plan for the checkout flow (attached/pasted). Review it — tell me what's solid, what's weak, and what's missing, before I hand it to the team."

> "Review docs/test-plans/iot-dashboard-test-plan.md. I want to know if the assertions are actually strong enough to catch real bugs, not just whether the sections look complete."

## A requirements-gap review

> "Here's our existing UI test plan for the account settings page, and here are the acceptance criteria (AC-1 through AC-9) from the ticket. Check the plan against these — which acceptance criteria have no test coverage, and which test cases don't map to anything in the criteria?"

> "I have a test plan and a Figma export of the new dialog. Does the plan actually cover every state shown in the designs (loading, empty, error), or did it only cover the happy path?"

## Requesting the fully revised plan

> "Review this test plan against the attached requirements, and just give me the fully revised version directly — I don't need to approve the findings first, I trust your judgment on this one."

> "Based on the findings you gave me last time, go ahead and produce the revised plan now. Keep TC-C08 and TC-C09 as-is, I disagree they're redundant — but apply everything else."

## Narrow, single-area ask

> "Just look at the login form section of this plan — are the negative and boundary cases good enough? Don't touch the rest."

## Large document, phased review

> "This test plan is 400 lines across 12 sections. Review it section by section, but keep one running findings list so nothing from section 2 gets lost by the time we're at section 10."

## What to expect

- If you don't supply requirements/acceptance criteria alongside the plan, the skill will say so and run a structural/quality-only review (Phases 1, 3, 4) rather than silently skipping the traceability check (Phase 2) without telling you.
- It will not rewrite the whole plan "for cleanliness" — every proposed change traces to a specific, named finding.
- It preserves existing test case IDs and structure; new/modified cases are marked, not blended in invisibly.
- It will not hand you the fully revised plan until you've seen the findings, unless you explicitly ask for the revised draft right away.
- It will not invent a browser/viewport matrix, an accessibility requirement, or an expected UI behavior that wasn't in what you supplied — those come back as open questions, not guesses.
- It stays out of API/backend/database/infrastructure/performance/security review, even if the plan mentions them — it'll note the dependency where it affects UI behavior and move on.
