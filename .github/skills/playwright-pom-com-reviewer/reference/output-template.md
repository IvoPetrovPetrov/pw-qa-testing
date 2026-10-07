# Review output template

Use this exact structure for a review. Omit a section only if it's genuinely empty (e.g. no positive practices worth calling out is rare but possible for a very short file) — never omit "Validation."

```markdown
# POM/COM Code Review

**Target:** <file path(s) or component/page name(s) reviewed>

**Summary:** <2-4 sentences: what this class is responsible for, and the overall architectural verdict — sound / sound with fixable issues / needs rework, with the one-line reason why.>

**What is already good:**
- <specific, named practice worth retaining — tie to a line/pattern, not a generic compliment>

**Findings:**

| ID | Priority | Location | Finding | Recommendation |
| -- | -------- | -------- | ------- | -------------- |
| F1 | P1/P2/P3 | `file.ts:12-18` | <the defect or gap and its concrete impact> | <the specific fix> |

**Suggested improvements:**
- <for the highest-value findings only — a short code snippet showing the fix, not a full-file rewrite unless the user asked for the actual refactor>

**Refactoring recommendation:**
- <state plainly: necessary / beneficial / unnecessary, and why>
- <name which findings, if any, require explicit user approval before any file is touched>

**Validation:**
- Checked: <what you actually read — sibling page/component objects, tests, project instructions>
- Not checked: <what you didn't have access to — running app, DOM, test-id conventions doc, full test suite>
- Open questions: <anything you couldn't verify and are flagging rather than asserting>
```

## Notes on filling it in

- **Location** should be as precise as the input allows — `file.ts:12-18` for a real file with line numbers, a component/method name if only a snippet was pasted.
- **Finding** states the defect and *why it matters* (impact), not just what's different from a preferred style. "Locator uses nth-child(3), which breaks if the list reorders or a row is inserted above it" is a finding; "I'd have written this differently" is not.
- **Recommendation** should be concrete enough to act on without further clarification — name the specific locator/method/pattern to use, not "improve this."
- Keep the findings table sorted by priority (P1s first) so the highest-impact items aren't buried.
- If a finding legitimately needs information you don't have (e.g. "is this test-id stable, or auto-generated per build?"), put it under Open Questions instead of guessing an answer and stating it as fact.
