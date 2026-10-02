# Changelog Template

Format and logging rules for Phase 7 (revise the plan) / output section 8.

## Table format

| Original section / Test ID | Change type | Description | Reason | Priority |
|---|---|---|---|---|
| `<e.g. TC-C08, or "Section 5">` | `<Added \| Updated \| Removed>` | `<what actually changed, specifically>` | `<why — tie back to a Finding ID>` | `<the finding's priority>` |

## Logging rules

- **Log every ADD, UPDATE, and REMOVE from Phase 5** that made it into the revised plan — a change with no changelog entry is the thing Phase 7's "never silently modify or delete" rule exists to prevent.
- **Don't log KEEPs.** They didn't change; they don't belong in a changelog.
- **Tie every entry back to a Finding ID** (in the Reason column, e.g. "Weak assertion — see RVW-014") so the changelog and the findings register stay traceable to each other.
- **A REMOVE entry needs a real reason**, not just "redundant" — name the case it overlaps with and why removing it doesn't lose verification (e.g. "duplicates TC-C04's toggle-independence check at the same layer").
- **Mark new/modified cases in the revised document itself** (e.g. `TC-C11 [NEW]`, `TC-A07 [UPDATED]`) in addition to the changelog table — a reader skimming the plan shouldn't have to cross-reference the changelog just to know what's new.
- If a change was requested by the user directly rather than derived from a finding, the Reason column can say so plainly (e.g. "User-requested consolidation") instead of forcing a Finding ID that doesn't exist.
