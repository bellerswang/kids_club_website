# Supabase Setup

## 1. Create the project

Create a Supabase project in the region nearest most users.

## 2. Install the database schema

Open the Supabase SQL Editor and run:

`supabase/migrations/001_auth_system.sql`

The migration creates user profiles, roles, automatic profile creation, Row Level Security, and the administrator role-update function.

## 3. Configure the website

In Supabase, open **Project Settings > API** and copy:

- Project URL
- Publishable key (or legacy anon key)

Place them in `js/supabase-config.js`. The publishable/anon key is intended for browser use. Never place a `service_role` or secret key in this repository.

Serve the website over HTTP instead of opening HTML files directly:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000/auth.html`.

## 4. Configure Auth URLs

In **Authentication > URL Configuration**:

- Set Site URL to the deployed website URL.
- Add `http://localhost:8000/dashboard.html` as a local redirect URL.
- Add the deployed `dashboard.html` URL as a production redirect URL.

Email/password auth works without Google configuration. To enable Google login, enable the Google provider and add the OAuth client credentials requested by Supabase.

## 5. Create the first administrator

Register the owner account through `auth.html`, confirm its email, then run this once in the SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'owner@example.com';
```

All later role changes can be performed from `dashboard.html` by an administrator.

## Security Notes

- New public registrations always receive the `parent` role.
- Browser clients cannot update the `role` column directly.
- Administrator role changes go through `set_user_role`, which checks the caller server-side.
- RLS limits ordinary users to their own profile.
- Production should use custom SMTP, CAPTCHA/rate limiting, backups, monitoring, and a paid plan before storing operational student data.
