# Project Architecture

Last reviewed: 2026-06-07

## Current Architecture

### System Shape

The project is a static, multi-page Chinese website for a children's academy. It runs directly in the browser without a build step or package manager. A Supabase authentication and profile-management integration is implemented but remains inactive until project credentials and the database migration are deployed.

### Frontend

- Entry pages: `index.html`, `about.html`, `academics.html`, `badminton.html`, `programming.html`, and `contact.html`.
- Authentication pages:
  - `auth.html` provides email registration, email/password login, Google OAuth initiation, and password-reset requests.
  - `dashboard.html` provides authenticated profile management, password updates, logout, and administrator role management.
- Shared styling:
  - `css/variables.css` defines design tokens and theme values.
  - `css/style.css` defines global layout and site structure.
  - `css/components.css` defines reusable UI components.
  - `css/pages.css` defines page-specific presentation.
- Shared browser behavior:
  - `js/main.js` controls the responsive navigation, scroll reveals, and testimonial slider.
  - `js/form.js` controls form validation, toast messages, local prototype storage, and the programming-page simulator.
  - `js/supabase-client.js` creates the browser Supabase client from `js/supabase-config.js`.
  - `js/auth.js` and `js/dashboard.js` implement authentication and account-management flows.
- Static media lives in `images/`.

### Data Flow

All pages and assets are served as static files. Booking and contact forms do not send data to a server. Form submissions are intercepted by `js/form.js` and stored only in the visitor's browser under the `academy_bookings` localStorage key.

When configured, Supabase Auth owns sessions and credentials. The `public.profiles` PostgreSQL table stores non-secret profile fields and application roles. Row Level Security limits ordinary users to their own profile; role changes go through the administrator-only `set_user_role` database function.

### Operational Boundaries

- Supabase is the selected managed backend for authentication and profiles; the repository contains the migration but no cloud project credentials.
- No production persistence or administrator notification is implemented.
- Google Fonts are loaded from an external stylesheet.
- Deployment configuration is not currently stored in the repository.
- Quality checks are manual; JavaScript can be syntax-checked with `node --check`.

### Brand And Location

- The sole public brand name is `Sunbridge`, with no Chinese name or `Academy` suffix.
- The public location is `Barnet, London, United Kingdom`.
- The public support email is `support@sunbridgeacademy.com`.
- Historical Chinese branding and Beijing campus addresses must not be reintroduced in new pages or documentation.

## Planned Architecture

The proposed direction is a dynamic academy management platform backed by FastAPI and PostgreSQL. The detailed proposal, data model, authentication flow, course-credit transactions, media storage, and staged rollout are documented in `backend_architecture_plan.md`.

Planned components are not implemented and must not be represented as current behavior:

- FastAPI application and versioned API endpoints.
- PostgreSQL persistence for users, students, courses, credit logs, and growth reports.
- Secure authentication and role-based authorization.
- Server-backed booking and contact submission.
- Transactional course-credit deduction and audit logs.
- Object storage for student media.
- Asynchronous parent notifications.
- Teacher and parent dashboards.

### Supabase Deployment

The selected phase-one platform is Supabase:

- Supabase Auth manages passwords, sessions, confirmation emails, password reset, and Google OAuth.
- Managed PostgreSQL stores profiles and future relational academy data.
- RLS and restricted database functions enforce authorization.
- `supabase/migrations/001_auth_system.sql` is the source-controlled authentication schema.
- `SUPABASE_SETUP.md` documents deployment and first-admin bootstrapping.

Cloud project creation, credentials, SMTP/OAuth configuration, and production backup settings remain operational deployment work rather than implemented repository state.

## Architecture Decisions

| Date | Decision | Status | Rationale |
| --- | --- | --- | --- |
| 2026-06-06 | Keep the existing site dependency-free and static until backend implementation begins. | Active | This reflects the deployed code and avoids implying unavailable server capabilities. |
| 2026-06-06 | Use `ARCHITECTURE.md` as the concise source of truth and retain `backend_architecture_plan.md` as detailed future design. | Active | Separates implemented reality from longer-term planning. |
| 2026-06-06 | Track unfinished technical work with stable `KC-###` IDs in `TODO.md`. | Active | Makes follow-up work discoverable across sessions and contributors. |
| 2026-06-06 | Use Supabase Auth and managed PostgreSQL for the phase-one login and profile system. | Active | It supplies integrated identity, relational storage, and RLS while preserving PostgreSQL portability. |
| 2026-06-06 | Keep privileged role changes in the database through an administrator-only function. | Active | Browser UI checks alone are not an authorization boundary, and no service key may be exposed client-side. |
| 2026-06-06 | Align the default site style with corporate flyers, defaulting to a clean light theme with orange branding accents. | Active | Matches the physical flyer materials and unifies the brand color identity (orange/charcoal). |
| 2026-06-07 | Use `Sunbridge` as the sole public name, with no Chinese name or `Academy` suffix, and Barnet, London as the public location. | Active | Keeps brand, SEO, contact details, and future content consistent with the current identity and operating area. |

## Architecture Change Log

| Date | Change | Related work |
| --- | --- | --- |
| 2026-06-06 | Established the architecture baseline and separated current static behavior from the proposed backend platform. | KC-001 |
| 2026-06-06 | Documented Firebase Authentication plus Firestore as an MVP option pending a final platform decision. | KC-008 |
| 2026-06-06 | Added managed PostgreSQL options and narrowed the shortlist to Supabase or Neon. | KC-008 |
| 2026-06-06 | Implemented the Supabase login, registration, password recovery, profile dashboard, role administration, and RLS migration. | KC-008 |
| 2026-06-06 | Vectorized the corporate logo (removing bottom tagline), aligned the global stylesheets to use the warm orange theme, set light mode as default, and integrated SVG logos. | KC-011 |
| 2026-06-07 | Finalized the sole brand name as Sunbridge and migrated all public Beijing campus addresses to Barnet, London. | KC-012 |
