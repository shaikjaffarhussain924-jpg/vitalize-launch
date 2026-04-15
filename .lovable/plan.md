

# Plan: Create Admin Account & Assign Role

## Steps

1. **Enable auto-confirm** for email signups temporarily (so you don't need to verify email)
2. **You sign up** at `/admin/login` using the "Sign Up" tab with your credentials:
   - Email: `shaikjaffarhussain924@gmail.com`
   - Password: `poison909090`
3. **Assign admin role** — after signup, I'll look up your user ID and insert an `admin` role into the `user_roles` table
4. **Disable auto-confirm** after setup (optional, for security)

## Technical Details

- Use `cloud--configure_auth` to enable auto-confirm temporarily
- After you sign up, query `auth.users` to get your user ID
- Insert into `user_roles` via the insert tool: `INSERT INTO user_roles (user_id, role) VALUES ('<your-id>', 'admin')`

