# Functional Inventory Format

Optional, user-supplied authoritative context — usable with or without a URL. When supplied, treat it as ground truth per the source-of-truth hierarchy in `SKILL.md`: it outranks anything observed during URL exploration and AI/model inference, but not an explicit requirement/acceptance criterion.

## Format

Free-form structure, organized by page/area:

```
Page: <name>

Navigation:
- <control> → <destination/behavior>

<Page/section name>:
- <control> → <behavior>
- <control> → currently not implemented
```

## Example

```
Page: Dashboard

Navigation:
- Dashboard → landing page
- Users → Users page
- Reports → Reports page
- Settings → Settings page

Dashboard:
- Refresh → refreshes dashboard data
- Date filter → filters data by date
- User filter → filters data by user
- Export → currently not implemented
- KPI cards → display aggregated values
```

## Optional: Known limitations / intentionally unimplemented functionality

Use this section to explicitly list buttons, links, pages, or flows that exist in the UI but are not currently implemented — so exploration doesn't misclassify them as unclear or, worse, as a potential defect.

```
Known limitations / intentionally unimplemented:
- Export button (Dashboard) → present in UI, backend not built yet
- Bulk delete (Users page) → deferred to next release
- "Forgot password" link → placeholder, not wired up in this environment
```

Anything listed here is treated as classification category 3 (Known limitation / intentionally unimplemented — see `url-exploration.md`) directly; exploration does not need to re-derive or question it, and it must not be turned into a failing test case.

## How this is used

- Read alongside any URL exploration or supplied documents, before classifying observed behavior.
- Where it conflicts with something observed during exploration, the inventory wins for *expected* behavior; the conflict itself is still worth noting (the live UI may be out of date, or the inventory may be stale) — flag it rather than silently resolving it.
- Where it conflicts with an explicit requirement/acceptance criterion, the requirement wins and the conflict is reported as an open question.
