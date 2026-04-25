# CRM Admin UI — Full Code Bundle

I'll generate a single Markdown file with the **complete, unmodified source** of every admin UI file from this project — ready to copy-paste into your other Lovable project.

## What you'll get (`/mnt/documents/crm-ui-code.md`)

Each file is included verbatim, exactly as it currently runs here:

1. **`src/routes/admin.tsx`** — sidebar layout, mute toggle, realtime toast notifications, ping sound (base64 WAV inline)
2. **`src/routes/admin.login.tsx`** — login + signup tabs with shadcn `Tabs`
3. **`src/routes/admin.index.tsx`** — dashboard with 6 stat cards + recharts area chart + upcoming list
4. **`src/routes/admin.appointments.tsx`** — search, status filters, list, slide-in drawer with status buttons + staff notes + WhatsApp tab
5. **`src/routes/admin.contacts.tsx`** — same pattern for contact submissions
6. **`src/components/admin/WhatsAppThread.tsx`** — full WhatsApp-style chat UI (green header, bubble groups by date, ✓/✓✓ status icons, composer, realtime subscription)

Plus a top section listing:
- Required shadcn components to install (`button`, `input`, `textarea`, `badge`, `tabs`, `chart`, `sonner`)
- npm dependencies (`sonner`, `recharts`, `lucide-react`, `@tanstack/react-router`, `@tanstack/react-start`)
- Backend function signatures the UI expects (`getAppointments`, `updateAppointment`, `getContacts`, `updateContact`, `getDashboardStats`, `getWhatsAppThread`, `sendWhatsAppMessage`) — so you know what to wire up on the new project

## Delivered as

A `<lov-artifact>` you can download directly. No app changes — this is a one-off file generation task using `code--exec`.

## Note

This is **UI only** — no DB schema, no Meta WhatsApp setup, no server function bodies. The components reference `@/lib/*.functions` and `@/integrations/supabase/client` which you'll need to provide on the target project (those were covered in earlier prompts).