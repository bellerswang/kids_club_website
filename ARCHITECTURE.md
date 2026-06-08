# Project Architecture

Last reviewed: 2026-06-08

## Current Architecture

### System Shape

The project is a static, bilingual multi-page website for Sunbridge. English is the default language and visitors can switch to Chinese in the browser. It runs without a build step or package manager. The public content is intentionally limited to claims supported by the current Sunbridge brochure. A Supabase authentication and profile-management integration remains in the repository but is hidden from the public site and inactive.

### Frontend

- Public entry pages: `index.html`, `about.html`, `guitar.html`, `badminton.html`, `programming.html`, `holiday-camp.html`, and `contact.html`.
- `academics.html` is a no-index compatibility redirect to `guitar.html`.
- `auth.html` and `dashboard.html` are no-index redirects to the homepage while login is hidden.
- Shared styling:
  - `css/variables.css` defines design tokens and theme values.
  - `css/style.css` defines the current global layout, reusable components, page presentation, and responsive states.
  - `css/components.css` and `css/pages.css` remain legacy stylesheets and are not loaded by the current public pages.
- Shared browser behavior:
  - `js/main.js` owns the English/Chinese content dictionary, language preference, responsive navigation, and scroll reveals.
  - `js/form.js` is retained legacy code and is not loaded by the current public pages.
  - `js/supabase-client.js` creates the browser Supabase client from `js/supabase-config.js`.
  - `js/auth.js` and `js/dashboard.js` implement authentication and account-management flows.
- Static media lives in `images/`.

### Data Flow

All public pages and assets are served as static files. There are no public booking or contact forms; visitors use the brochure-provided phone, email, or website details. The selected language is stored in the visitor's browser under the `sunbridge-language` localStorage key.

If reactivated and configured later, Supabase Auth owns sessions and credentials. The `public.profiles` PostgreSQL table stores non-secret profile fields and application roles. Row Level Security limits ordinary users to their own profile; role changes go through the administrator-only `set_user_role` database function.

### Operational Boundaries

- Supabase remains the selected managed backend for a future login launch; the repository contains the implementation and migration but no cloud project credentials.
- No login link, account UI, public form, production persistence, or administrator notification is active.
- Deployment configuration is not currently stored in the repository.
- Quality checks are manual; JavaScript can be syntax-checked with `node --check`, and architecture documentation has a repository validation script.

### Brand And Location

- The sole public brand name is `Sunbridge`, with no Chinese name or `Academy` suffix.
- The current brochure is the source of truth for public programme descriptions and contact claims.
- Public pages state only that classes and camps take place at local partner schools, with exact venues supplied at booking confirmation.
- The public contact email is `info@sunbridgeacademy.co.uk`; the brochure phone number remains a placeholder pending a real number.
- Historical Chinese branding, unsupported locations, and unverified programme claims must not be reintroduced.

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
| 2026-06-07 | Use `Sunbridge` as the sole public name, with no Chinese name or `Academy` suffix, and Barnet, London as the public location. | Superseded by 2026-06-08 brochure-source decision | The current brochure does not name Barnet and says venues are local partner schools confirmed at booking. |
| 2026-06-08 | Treat the current Sunbridge brochure as the source of truth for public website claims, default to English with a Chinese switch, and hide login until it is explicitly relaunched. | Active | Keeps the website concise, verifiable, and aligned with current customer-facing material while preserving dormant authentication work. |

## Architecture Change Log

| Date | Change | Related work |
| --- | --- | --- |
| 2026-06-06 | Established the architecture baseline and separated current static behavior from the proposed backend platform. | KC-001 |
| 2026-06-06 | Documented Firebase Authentication plus Firestore as an MVP option pending a final platform decision. | KC-008 |
| 2026-06-06 | Added managed PostgreSQL options and narrowed the shortlist to Supabase or Neon. | KC-008 |
| 2026-06-06 | Implemented the Supabase login, registration, password recovery, profile dashboard, role administration, and RLS migration. | KC-008 |
| 2026-06-06 | Vectorized the corporate logo (removing bottom tagline), aligned the global stylesheets to use the warm orange theme, set light mode as default, and integrated SVG logos. | KC-011 |
| 2026-06-07 | Finalized the sole brand name as Sunbridge and migrated all public Beijing campus addresses to Barnet, London. | KC-012 |
| 2026-06-08 | Rebuilt the public site around the current brochure, added English/Chinese switching with English default, added Guitar and Holiday Camp pages, and hid all login surfaces. | KC-013 |
