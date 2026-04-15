

# Enable Real-Time CRM Updates

## Problem
Currently, the CRM admin pages (dashboard, appointments, contacts) only load data once on mount. When a new booking or contact submission arrives, staff must manually refresh the page.

## Solution
Enable Supabase Realtime on both tables and add client-side subscriptions in the three admin pages so they auto-refresh when data changes.

## Steps

### 1. Database Migration — Enable Realtime
Add both tables to the `supabase_realtime` publication:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_submissions;
```

### 2. Admin Appointments Page (`src/routes/admin.appointments.tsx`)
Add a Supabase realtime subscription inside the existing `useEffect` that listens for `INSERT`, `UPDATE`, and `DELETE` events on `appointments`. On any change, call the existing `loadAppointments()` function to refresh the list. Clean up subscription on unmount.

### 3. Admin Contacts Page (`src/routes/admin.contacts.tsx`)
Same pattern — subscribe to `contact_submissions` changes and call `loadContacts()` on any event.

### 4. Admin Dashboard (`src/routes/admin.index.tsx`)
Subscribe to both `appointments` and `contact_submissions`. On any change, re-fetch dashboard stats via `getDashboardStats()`.

## Technical Detail
Each subscription uses `supabase.channel('channel-name').on('postgres_changes', { event: '*', schema: 'public', table: 'table_name' }, callback).subscribe()` and is cleaned up with `supabase.removeChannel(channel)` in the useEffect return.

No new dependencies or RLS changes needed — realtime respects existing RLS policies, and the admin client already authenticates before fetching.

