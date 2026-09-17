# ApplyWise data and results overhaul

## Build
- Replace the old TypeScript mock list with the attached 49-job JSON dataset while preserving every source field name.
- Update shared job state to restore saved statuses and added jobs from localStorage, and make status changes update all views immediately.
- Rebuild Results as a compact, grouped scan list with live summary counts, primary tabs, Opportunities sub-filters, and 0–10/null score displays.
- Add an interactive detail view: fixed right panel on desktop and an in-flow panel on smaller screens, with score bars, application link, status selector, rationale, networking links, and collapsible evidence/flags.
- Update Tracker to use the new statuses and data shape.
- Persist Profile form fields locally.
- Persist Add Job submissions locally and show a “Scoring coming soon” confirmation rather than navigating away.
- Keep the current typography, palette, spacing, pills, and airy editorial styling; use the screenshot only for information hierarchy.

## Validation
- Check all content pages for required page-specific metadata.
- Exercise every Results tab/filter, open a row, change its status, expand evidence, and confirm counts and localStorage update.
- Submit and reload Profile and Add Job to confirm their saved states persist.
- Verify desktop and mobile layouts with no overlaps or broken controls.

## Technical details
- The uploaded JSON will become `src/data/jobs.json`; TypeScript types and labels will adapt to that schema without renaming fields.
- Browser storage reads will happen after hydration to avoid server/client rendering mismatches.
- Networking links will URL-encode the company plus each requested alumni search phrase.
