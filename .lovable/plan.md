

# Fix: Assign Admin Role to Your Account

## Problem
The CRM backend code is complete and functional. The only missing piece is that your user account has no role in the `user_roles` table, so every CRM request is blocked by the authorization check.

## Solution (1 step)
Insert the admin role for your existing user account:

```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('1e7d07bb-477e-4acd-8c55-882eaee6dad1', 'admin');
```

After this, log out and back in at `/admin/login` — the CRM dashboard will show your appointments and contacts.

## What's Already Built
| Feature | Server Function | Status |
|---------|----------------|--------|
| Book appointment | `submitAppointment` | Working |
| View appointments (admin) | `getAppointments` | Working (needs role) |
| Update appointment (admin) | `updateAppointment` | Working (needs role) |
| Submit contact form | `submitContact` | Working |
| View contacts (admin) | `getContacts` | Working (needs role) |
| Update contact (admin) | `updateContact` | Working (needs role) |
| Dashboard stats | `getDashboardStats` | Working (needs role) |
| Auto-confirm trigger | DB trigger | Working |

