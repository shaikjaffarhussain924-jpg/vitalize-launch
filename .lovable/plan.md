

# Plan: Full In-App CRM with Database-Backed Bookings

## What You Get

A complete appointment management system stored in Lovable Cloud (Supabase), with an admin panel to manage leads, appointments, and patients — no third-party form services needed.

---

## Phase 1: Database Setup

Create these tables via migrations:

1. **`appointments`** — stores every booking request
   - `id`, `created_at`, `name`, `phone`, `email`, `service`, `doctor`, `preferred_date`, `preferred_time`, `message`, `source`, `status` (enum: `pending`, `confirmed`, `completed`, `cancelled`), `staff_notes`

2. **`contact_submissions`** — stores contact form entries
   - `id`, `created_at`, `name`, `email`, `phone`, `message`, `status` (enum: `new`, `replied`, `closed`)

3. **`user_roles`** — admin access control (per security best practices)
   - `id`, `user_id` (FK to auth.users), `role` (enum: `admin`, `staff`)

4. **RLS policies**: Public can insert appointments/contacts. Only admin/staff can read/update. Security-definer `has_role()` function to avoid recursive RLS.

## Phase 2: Replace Web3Forms with Direct DB Inserts

- **Booking page** (`book-appointment.tsx`): On submit, insert into `appointments` table via a server function instead of calling Web3Forms.
- **Contact page** (`contact.tsx`): Same — insert into `contact_submissions`.
- Keep WhatsApp redirect after submission as a confirmation channel.

## Phase 3: Admin Dashboard (New Pages)

Create a protected admin area at `/admin`:

1. **`/admin`** — Overview dashboard with counts (pending bookings, new contacts today, total patients)
2. **`/admin/appointments`** — Table of all appointments with:
   - Filter by status (pending/confirmed/completed/cancelled)
   - Click to view details, change status, add staff notes
   - Search by name/phone
3. **`/admin/contacts`** — Table of contact form submissions with status management
4. **`/admin/login`** — Simple email/password login for staff

## Phase 4: Auth & Security

- Enable Supabase Auth (email/password) for admin/staff login
- Pathless layout route `_admin.tsx` with `beforeLoad` guard checking `has_role()`
- Admin pages are fully server-protected — no client-side role checks

---

## Technical Details

**Files to create:**
- Migration files for `appointments`, `contact_submissions`, `user_roles` tables + RLS + `has_role()` function
- `src/routes/admin.tsx` (layout with sidebar + Outlet)
- `src/routes/admin.index.tsx` (dashboard)
- `src/routes/admin.appointments.tsx` (appointments list)
- `src/routes/admin.contacts.tsx` (contacts list)
- `src/routes/admin.login.tsx` (login page)
- `src/routes/_admin.tsx` (auth guard layout)
- Server functions for CRUD operations on appointments/contacts

**Files to modify:**
- `src/routes/book-appointment.tsx` — replace `submitToWeb3Forms` with server function insert
- `src/routes/contact.tsx` — same
- `src/lib/forms.ts` — can be simplified or removed

**Dependencies:** None new — Supabase client, TanStack Query, and existing UI components cover everything.

**No changes to:** Header, footer, desktop layout, or any existing public-facing pages (only the form submission backend changes).

