# Test Case Template

Field set for Phase 5. Omit a field only when it genuinely adds nothing for a given case (e.g. no dependencies) — don't omit "Expected Results" or "Steps", those two are load-bearing.

```
Test Case ID:            <e.g. LOGIN-P03 — pick a stable, human-scannable prefix per feature/page>
Title:                   <action-oriented, specific — "Submit login with valid credentials", not "Test login">
Priority:                <P0 | P1 | P2 | P3, with rationale if not obvious from the journey>
Page / Component:        <where this lives>
Test Type:               <positive | negative | boundary | accessibility | responsive | visual | ...>
Preconditions:           <required state before Step 1 — logged out, cart empty, feature flag on, etc.>
Test Data:               <exact values used, or "any valid <X>" if the value genuinely doesn't matter>
Steps:
  1. <reproducible, specific action>
  2. ...
Expected Results / Assertions:
  - <one observable, verifiable outcome per line — see reference/quality-standards.md's assertion bar>
Requirement Reference:   <REQ/AC ID from Section 3 of the plan, or "none supplied — flagged as assumption">
Manual / Automation:     <manual | automate now | automate later | exploratory only, with a one-line reason>
Dependencies / Notes:    <e.g. "assumes REQ-4's error copy; unconfirmed" — omit if none>
```

## Notes on filling this in

- **Steps** must be reproducible by someone who wasn't in the room when the case was written — no "test the form," but the literal sequence of inputs and actions.
- **Expected Results** is not one vague sentence; list each distinct, checkable outcome (state change, message, value, focus, navigation) as its own line. If a case has only one expected result and it's specific, that's fine — the point is precision, not line count.
- If a case's correct expected result is genuinely unknown from the supplied material, write the case with the result marked `<UNCONFIRMED — needs: ...>` rather than guessing a plausible-sounding one. Surface these in Section 4/10 of the plan.
- A negative or boundary case still needs a positive statement of what *should* happen (an error message, a disabled state, a rejection) — "should not crash" alone is not a sufficient expected result.
