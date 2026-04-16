
The user wants notifications when new bookings come in. The CRM already has realtime subscriptions wired up on admin pages (per memory + prior turns). The natural addition: **toast notifications** via sonner that fire when a new appointment (or contact) is inserted, so admin staff get an instant visual + audible alert without watching the table.

## Plan: Real-time Booking Notifications

### What
When a new appointment or contact submission arrives, show a sonner toast on admin pages with the customer name + service, plus an optional sound ping.

### Where
- `src/routes/admin.tsx` (layout) — best place: subscribes once, fires toasts on ALL admin sub-pages (dashboard, appointments, contacts) instead of duplicating in each.
- Confirms `<Toaster />` is mounted in `__root.tsx` (sonner). If not, add it.

### How
1. In `src/routes/admin.tsx`, add a `useEffect` that:
   - Subscribes to `postgres_changes` on `appointments` (event: INSERT) → `toast.success("New appointment from {name}", { description: "{service} • {date} {time}" })`
   - Subscribes to `postgres_changes` on `contact_submissions` (event: INSERT) → `toast.info("New contact from {name}", { description: message preview })`
   - Plays a short notification sound (small inline base64 ping or `new Audio()` from a public asset) — optional, controlled by a mute toggle in localStorage.
   - Cleans up both channels on unmount.
2. Add a small bell icon + mute toggle in the admin header so staff can silence sound (toasts still appear).
3. Toasts include a CTA action button "View" that navigates to `/admin/appointments` or `/admin/contacts`.

### Files
- `src/routes/admin.tsx` — add subscription effect + mute toggle
- `src/routes/__root.tsx` — verify sonner `<Toaster richColors position="top-right" />` is present (add if missing)

### Notes
- No DB/RLS changes — realtime already enabled per prior turn.
- No new dependencies (sonner already installed).
- Existing realtime subs on individual pages stay (they refresh data); this layer only adds the toast UX.
