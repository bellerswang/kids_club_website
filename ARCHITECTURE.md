# Project Architecture

Last reviewed: 2026-06-15

## Current Architecture

### System Shape

The repository has two deliberately separate frontend tracks. The root static HTML site is the deployed production baseline and rollback source. `apps/web` is the local Astro migration application; it generates the replacement bilingual site but is not yet the production Cloudflare build. The earlier Supabase browser-authentication prototype is archived and inactive, while its database migration remains available for future backend work.

### Frontend

- Public entry pages: `index.html`, `about.html`, `guitar.html`, `badminton.html`, `programming.html`, `holiday-camp.html`, and `contact.html`.
- `academics.html` is a no-index compatibility redirect to `guitar.html`.
- `auth.html` and `dashboard.html` are no-index redirects to the homepage while login is hidden.
- Shared styling:
  - `css/variables.css` defines design tokens and theme values.
  - `css/style.css` defines the current global layout, reusable components, page presentation, and responsive states.
- Shared browser behavior:
  - `js/main.js` owns the English/Chinese content dictionary, language preference, responsive navigation, and scroll reveals.
- Static media lives in `images/`.
- `apps/web` contains the Astro migration, shared layouts and bilingual page components, centralized site data, English root routes, Chinese `/zh/` routes, and Cloudflare-compatible headers and redirects.
- The Astro public information architecture is Home, About, Programmes, Holiday Camp, and Contact. `HomePage.astro`, `ProgrammesPage.astro`, and `CampPage.astro` present four brochure-supported offers: Holiday Camp, Badminton, Guitar, and AI Skills.
- Previous Guitar, Badminton, and AI Skills detail routes are retired from the Astro build and redirect to the combined Programmes page.
- Authorized activity photos are optimized as WebP files in `apps/web/public/images/` and referenced only from the Astro site.

### Data Flow

All public pages and assets are served as static files. There are no public booking or contact forms; visitors use the confirmed phone number and email address. The selected language is represented by the English root routes or Chinese `/zh/` routes.

If reactivated and configured later, Supabase Auth owns sessions and credentials. The `public.profiles` PostgreSQL table stores non-secret profile fields and application roles. Row Level Security limits ordinary users to their own profile; role changes go through the administrator-only `set_user_role` database function.

### Operational Boundaries

- The public site is deployed through GitHub and Cloudflare Pages. The operational standard is documented in `docs/UPDATE_SOP.md`.
- `main` is the production branch; non-production branches are used for review and Preview deployments.
- Supabase remains the selected managed backend for a future login launch; the repository contains the migration and an archived prototype but no cloud project credentials.
- No login link, account UI, public form, production persistence, or administrator notification is active.
- The production Cloudflare project still serves the root static site. Switching its build root to `apps/web` is a separate release task.
- The Astro migration is checked with `npm run check` and built with `npm run build` from `apps/web`.
- Root `package.json` and `wrangler.jsonc` adapt the monorepo for Cloudflare Workers Git builds: the root build installs and builds `apps/web`, then Wrangler publishes `apps/web/dist` as static assets.
- `docs/RELEASE_CHECKLIST.md` defines release verification, and `docs/CONTENT_RULES.md` defines public content boundaries.

### Brand And Location

- The sole public brand name is `Sunbridge Academy`, with no Chinese name.
- The current brochure is the source of truth for public programme descriptions and contact claims.
- Public pages do not claim a fixed venue; current locations are confirmed when a visitor enquires.
- The public contact details are `07476 197319` and `info@sunbridgeacademy.uk`. The unresolved website URL is not exposed by the Astro site.
- Holiday Camp is presented as the main school-break offer. Brochure-confirmed activities and the sample day schedule may be published when clearly framed as examples rather than guaranteed fixed daily delivery.
- Historical Chinese branding, unsupported locations, and unverified programme claims must not be reintroduced.

## Planned Architecture

The frontend portion of the target architecture is implemented locally in `apps/web`. It remains preview-only until visual parity, URL compatibility, content review, and Cloudflare Preview verification are complete. The `/api/v1` boundary and dynamic backend remain future work. Details are in `docs/TARGET_ARCHITECTURE.md`.

The archived `docs/archive/LEGACY_BACKEND_ARCHITECTURE.md` remains supporting exploration for complex academy-management features. Its custom authentication and infrastructure assumptions are not authoritative where they conflict with the selected Supabase architecture or `docs/TARGET_ARCHITECTURE.md`.

Remaining planned components must not be represented as current behavior:

- Production Cloudflare Pages build output from `apps/web/dist`.
- Versioned `/api/v1` frontend boundary.
- Cloudflare Functions limited to lightweight `/api/*` routes.
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
- `docs/archive/SUPABASE_AUTH_PROTOTYPE_SETUP.md` preserves prototype deployment notes.

Cloud project creation, credentials, SMTP/OAuth configuration, and production backup settings remain operational deployment work rather than implemented repository state.

## Architecture Decisions

| Date | Decision | Status | Rationale |
| --- | --- | --- | --- |
| 2026-06-06 | Keep the existing site dependency-free and static until backend implementation begins. | Active | This reflects the deployed code and avoids implying unavailable server capabilities. |
| 2026-06-06 | Use `ARCHITECTURE.md` as the concise source of truth and retain `backend_architecture_plan.md` as detailed future design. | Superseded by 2026-06-08 target architecture decision | The early backend draft is now archived; `docs/TARGET_ARCHITECTURE.md` is the proposed target design. |
| 2026-06-06 | Track unfinished technical work with stable `KC-###` IDs in `TODO.md`. | Active | Makes follow-up work discoverable across sessions and contributors. |
| 2026-06-06 | Use Supabase Auth and managed PostgreSQL for the phase-one login and profile system. | Active | It supplies integrated identity, relational storage, and RLS while preserving PostgreSQL portability. |
| 2026-06-06 | Keep privileged role changes in the database through an administrator-only function. | Active | Browser UI checks alone are not an authorization boundary, and no service key may be exposed client-side. |
| 2026-06-06 | Align the default site style with corporate flyers, defaulting to a clean light theme with orange branding accents. | Active | Matches the physical flyer materials and unifies the brand color identity (orange/charcoal). |
| 2026-06-07 | Use `Sunbridge` as the sole public name, with no Chinese name or `Academy` suffix, and Barnet, London as the public location. | Superseded by 2026-06-15 Sunbridge Academy content decision | The business owner later confirmed `Sunbridge Academy` as the public brand; the site still does not publish Barnet or other unsupported fixed addresses. |
| 2026-06-08 | Treat the current Sunbridge brochure as the source of truth for public website claims, default to English with a Chinese switch, and hide login until it is explicitly relaunched. | Superseded by 2026-06-15 Sunbridge Academy content decision | The source-of-truth principle remains active, but the confirmed public brand and programme focus changed. |
| 2026-06-08 | Use feature branches, pull requests, Cloudflare Preview deployments, production verification, and Git-synchronized rollback as the standard release workflow. | Active | The website is live, so every update needs a reviewable path, a pre-production check, and a recovery procedure that keeps Git and production aligned. |
| 2026-06-08 | Adopt a content-driven Astro static site as the target frontend architecture, with bilingual URL routes and a backend-neutral `/api/v1` boundary. | In progress | The local static-generation frontend is implemented; production migration remains gated by preview and release verification. |
| 2026-06-10 | Organize public activities as five broad programme directions and keep Holiday Camp details enquiry-only. | Superseded by 2026-06-15 Sunbridge Academy content decision | The business owner confirmed Holiday Camp, Badminton, Guitar, and AI Skills as public offers and approved publishing brochure-confirmed Holiday Camp sample content. |
| 2026-06-10 | Deploy the Astro output through Cloudflare Workers static assets from the repository root. | Active | The connected Cloudflare project uses Workers Git integration, so it needs a root build command and Wrangler asset-directory configuration. |
| 2026-06-15 | Use `Sunbridge Academy` as the public brand and focus the Astro site on Holiday Camp, Badminton, Guitar, and AI Skills, with Holiday Camp as the main detailed offer. | Active | The business owner confirmed the brand, programme set, authorized images, and brochure-backed Holiday Camp details for public use. |

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
| 2026-06-08 | Adopted the production update SOP, release checklist, content rules, and architecture-keeper enforcement for future website changes. | KC-015 |
| 2026-06-08 | Stabilized the shared mobile navigation panel and increased the responsive header logo size. | KC-017 |
| 2026-06-08 | Defined the target content, frontend, API, backend, and Cloudflare architecture with a phased migration path. | KC-020 |
| 2026-06-08 | Added the local Astro migration app, separated active code from archived prototypes, and reduced root documentation to project entry points. | KC-021 |
| 2026-06-10 | Replaced standalone Guitar, Badminton, and AI Skills pages with one bilingual Programmes page, reduced Holiday Camp to a service statement, removed unconfirmed contact claims, and added legacy redirects. | KC-022 |
| 2026-06-10 | Replaced the contact placeholders with the confirmed public phone number and email across the Astro Contact page and footer. | KC-014 |
| 2026-06-10 | Added root npm and Wrangler configuration so Cloudflare Workers Git builds generate and publish `apps/web/dist`. | KC-023 |
| 2026-06-15 | Refreshed the local Astro site around the confirmed Sunbridge Academy brand, four brochure-backed programme offers, authorized WebP activity photos, and an expanded Holiday Camp page with sample activities and timetable. | KC-018 |
