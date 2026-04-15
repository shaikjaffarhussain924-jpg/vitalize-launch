

# Plan: Enable Admin User Creation

## Problem
The `/admin/login` page only has a login form — there's no way to create the first admin account. We need a way to register a user and assign them the admin role.

## Approach

**Option A (Recommended — simplest):** I create the admin user directly in the database using the auth tools, then insert the admin role. You just tell me what email and password you want.

**Option B:** Add a signup form to the login page so you can register, then I assign the role afterward.

## Steps (Option A)

1. You provide the email and password you want for your admin account
2. I create the user via the backend auth system
3. I insert a row into `user_roles` linking that user to the `admin` role
4. You log in at `/admin/login` and access the dashboard

## Steps (Option B)

1. Add a signup tab/toggle to `src/routes/admin.login.tsx` with email + password registration
2. After you sign up, I insert the admin role for your user ID
3. Future staff accounts can be created the same way, with you assigning roles from the admin panel later

No other files change. The rest of the CRM is already built and waiting.

