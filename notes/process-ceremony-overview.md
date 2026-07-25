# Process Ceremony Overview

**Date captured:** 2026-07-24  
**Status:** Working process note for planning team  
**Graphic:** [`assets/process-ceremony-overview-ltr.png`](../assets/process-ceremony-overview-ltr.png) · [`assets/process-ceremony-overview.svg`](../assets/process-ceremony-overview.svg)

---

## Prerequisite

After **announcements** are made and the **recruitment strategy** has begun.

## Ceremony flow

1. **Applications** — Prospective recipients submit applications via **Typeform**.
2. **Sponsor meetings** — The board assigns a **Sponsor** (a person from the board) to:
   - Meet with the applicant
   - Ask questions and understand the request
   - Develop a support plan and supporting docs
   - Prepare the case for board presentation
3. **Present to board** — Sponsor presents the applicant and support plan to the board.
4. **Board path** — One of:
   - **Declines with notes** — Board declines and records notes (feedback / rationale)
   - **Reviews with Elders** — Board takes the case to the Elders for review
5. **Final decision** — Decision is finalized (following Elder review when that path is taken)

```mermaid
flowchart TD
  pre[Announcements and recruitment begun]
  apps[Applications]
  sponsor[Sponsor meetings]
  present[Present to board]
  decline[Board declines with notes]
  elders[Reviews with Elders]
  final[Final decision]

  pre --> apps --> sponsor --> present
  present --> decline
  present --> elders --> final
```

## Sponsor role (board member)

- Assigned by the board to a specific applicant
- Owns discovery: questions, understanding need and path (trade / family craft / college)
- Produces support plan and docs ready for board
- Presents to the board

## Open questions

- After a decline with notes: is the applicant/sponsor expected to revise and re-enter, or is that a terminal outcome for the cycle?
- Does every approval path require Elder review, or only when the board escalates?
- Timing: how the committee “X week” review from the initial proposal maps onto Sponsor meetings vs. board / Elder stages
