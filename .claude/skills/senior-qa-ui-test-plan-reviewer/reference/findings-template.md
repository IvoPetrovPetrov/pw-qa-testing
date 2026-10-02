# Findings Template

Field set and table schemas for Phase 5 (findings) and the output sections that present them.

## Finding ID scheme

Use a stable, human-scannable prefix, e.g. `RVW-001`, `RVW-002`, incrementing across the whole review — don't restart numbering per section. If the review spans multiple sittings on the same plan, continue the sequence rather than reusing IDs.

## Per-finding field set

Every finding in the Detailed Review Findings table (output section 3) needs all of these, even if some are folded into the table's "Rationale" or "Recommended action" columns for brevity:

```
Finding ID:              <e.g. RVW-014>
Original section/ID:     <the plan's own section heading or test case ID this finding is about>
Classification:          <KEEP | ADD | UPDATE | REMOVE | INVESTIGATE>
Priority:                <P0 | P1 | P2 | P3 — or the plan's own scheme; see the note below>
Specific issue:           <what is actually wrong or missing — concrete, not "coverage could be better">
User impact / risk:      <what a real user or the team is exposed to if this stays as-is>
Recommended action:       <the specific fix — not "add more tests">
Proposed test case:       <full case using the plan's own field format, if ADD or a substantial UPDATE — omit for KEEP/REMOVE>
Assumptions/dependencies: <e.g. "assumes the error copy in REQ-4 is current" — omit if none>
```

## Detailed Review Findings table (output section 3)

| Finding ID | Original section / Test ID | Classification | Priority | Finding | Rationale | Recommended action |
|---|---|---|---|---|---|---|

Keep this table to the findings that actually carry a recommendation — a long list of KEEPs with nothing to say adds noise; if an area is broadly fine, say so once in prose (output section 2) rather than one KEEP row per case.

## On priority schemes

Use the plan's own priority scheme if it already defines one in its document (e.g. High/Med/Low, Critical/Major/Minor) — don't force P0–P3 onto a plan that has a working scheme of its own. If you do need to translate (e.g. the user specifically asked for P0–P3 findings against a High/Med/Low plan), state the mapping once, plainly, before the findings table:

```
Priority mapping used in this review: Critical → P0, High → P1, Medium → P2, Low → P3.
```

Never silently mix both schemes in the same table without that stated mapping — it makes the table unreadable.

## UI Coverage Gap Matrix (output section 4)

One row per the 13 areas from `reference/review-checklist.md` that are actually applicable to this plan — omit an area entirely if it's not applicable, with a one-line note why, rather than including an empty row.

| UI Area | Existing Coverage | Gap | Proposed Change | Priority |
|---|---|---|---|---|
| `<e.g. Forms and validation>` | `<what the plan already covers, by ID>` | `<what's missing, or "none">` | `<ADD/UPDATE and what>` | `<priority, or "n/a" if no gap>` |

## Final Review Checklist (output section 10)

A short, concrete checklist the user can run through to approve (or reject) the revised plan — not a restatement of the whole review. Tailor the items to what actually mattered in this review; this is the shape to follow:

```
- [ ] Every P0/P1 finding has been addressed or explicitly deferred with a stated reason
- [ ] Every requirement/AC has at least one covering test case (or the gap is logged as an open question)
- [ ] No test case was silently modified or removed outside the changelog
- [ ] New/updated assertions meet the assertion-quality bar (observable, specific, tied to documented behavior)
- [ ] Smoke and regression groupings still make sense given any added/removed cases
- [ ] Remaining open questions and assumptions are stated, not buried
```
