# Project TODO

Last reviewed: 2026-06-10

This file is the source of truth for unfinished engineering work. Update it during every implementation task.

## Active

### KC-003: Establish a backend implementation baseline

- Status: Ready
- Priority: P1
- Area: Backend / Infrastructure
- Next action: Confirm the phase-one scope in `docs/TARGET_ARCHITECTURE.md`, scaffold the selected backend behind `/api/v1`, and document local startup and configuration.
- Acceptance criteria: A health endpoint runs locally; configuration comes from environment variables; dependencies are pinned; backend checks run with one documented command.

### KC-006: Add repeatable static-site quality checks

- Status: Ready
- Priority: P2
- Area: Tooling / Quality
- Next action: Add a lightweight command that checks JavaScript syntax, missing local assets, duplicate IDs, and basic HTML validity.
- Acceptance criteria: Contributors can run one documented command locally and receive a nonzero exit code for detected failures.

### KC-007: Add page metadata and sharing defaults

- Status: Ready
- Priority: P3
- Area: Frontend / SEO
- Next action: Add Open Graph and social sharing metadata, including an intentional sharing image, to each public page.
- Acceptance criteria: Shared links expose an intentional title, description, and image in common social preview validators.
- Notes: Unique bilingual page titles and meta descriptions are implemented.

### KC-009: Deploy and verify the Supabase authentication system

- Status: Blocked
- Priority: P0
- Area: Authentication / Deployment
- Next action: Create the Supabase cloud project, run `supabase/migrations/001_auth_system.sql`, configure `js/supabase-config.js`, set Auth redirect URLs, enable Google OAuth if required, and bootstrap the first administrator.
- Acceptance criteria: Registration confirmation, login, logout, password reset, profile update, Google login, ordinary-user RLS denial, administrator user listing, and administrator role updates all pass against the deployed project.
- Blocked by: Supabase project URL, publishable key, email/OAuth provider configuration, and an owner email address are not yet available in the workspace.
- Notes: Login and dashboard routes currently redirect to the homepage and must remain hidden until this deployment task is completed and the owner explicitly approves launch.

### KC-010: Harden authentication for production launch

- Status: Ready
- Priority: P1
- Area: Authentication / Operations
- Next action: Configure custom SMTP, CAPTCHA or equivalent abuse protection, rate-limit monitoring, backup retention, and a restore drill.
- Acceptance criteria: Production email uses the academy domain; automated sign-up abuse is limited; alerting exists for unusual authentication activity; a documented restore test succeeds.

### KC-016: Enforce the production branch workflow

- Status: Ready
- Priority: P1
- Area: GitHub / Deployment
- Next action: Protect `main`, require pull requests before merging, disable force pushes and branch deletion, confirm Cloudflare Production branch is `main`, and confirm Preview branches are enabled.
- Acceptance criteria: A direct push to `main` is rejected; a feature branch produces a Cloudflare Preview; only a reviewed PR can merge; merging triggers a successful production deployment.

### KC-018: Migrate the public site to the content-driven target architecture

- Status: In progress
- Priority: P1
- Area: Frontend / Content / Cloudflare
- Next action: Review the generated pages for visual and content parity, test old URL redirects, then deploy `apps/web` only as a Cloudflare Preview.
- Acceptance criteria: The Preview builds from `apps/web` into `dist`; Home, About and one programme render in English and under `/zh/`; shared site data updates all generated pages; existing production remains unchanged; old URL compatibility is documented.
- Notes: Follow the phased migration in `docs/TARGET_ARCHITECTURE.md`. Do not switch the production build root until all current public pages, redirects and release checks pass.

## Recently Completed

### KC-014: Replace brochure contact placeholders

- Completed: 2026-06-10
- Result: Set the confirmed public phone number to `07476 197319` and email to `info@sunbridgeacademy.uk` in shared Astro site data, the Contact page and footer; retained no public website link because a production domain has not been confirmed.
- Verification: Phone uses the international `tel:+447476197319` target, email uses `mailto:info@sunbridgeacademy.uk`, and no old email or phone placeholder remains in the Astro source.

### KC-022: Restructure public content around the new Holiday Camp brochure

- Completed: 2026-06-10
- Result: Rebuilt the Astro site around five bilingual programme directions; replaced standalone Guitar, Badminton, and AI Skills pages with a combined Programmes page; reduced Holiday Camp to an availability statement and enquiry CTA; removed unconfirmed phone, website, venue, age, group-size, schedule, and activity claims; and redirected old programme URLs.
- Verification: Astro check and build passed; English and Chinese Home, Programmes, Holiday Camp, and Contact routes returned 200 at desktop and 390px; no horizontal overflow or browser console errors were detected.

### KC-021: Organize the local repository for the target architecture

- Completed: 2026-06-08
- Result: Added the isolated Astro migration app, consolidated active documentation, archived stale frontend and authentication prototypes without deleting history, and kept the deployed root static site intact as the production rollback baseline.

### KC-019: Archive the stale backend architecture draft

- Completed: 2026-06-08
- Result: Moved the early backend design into `docs/archive`, marked its custom authentication and infrastructure assumptions as non-authoritative, and made the target architecture document the future-design source of truth.

### KC-020: Design the Cloudflare-compatible target architecture

- Completed: 2026-06-08
- Result: Defined a content-driven Astro frontend, schema-validated bilingual content, shared components, Cloudflare Pages build structure, an `/api/v1` boundary, staged Supabase/Functions/FastAPI adoption, and a production-safe migration plan.

### KC-017: Stabilize the mobile navigation and header logo

- Completed: 2026-06-08
- Result: Made the mobile navigation an opaque, isolated full-height panel with reliable visibility states and stronger separation from page content; enlarged the header logo and aligned its responsive sizing with the navigation bar.

### KC-015: Adopt the website release standard

- Completed: 2026-06-08
- Result: Added the production update SOP, release checklist and content rules; corrected the AI Skills page path; required scoped staging instead of `git add .`; documented Preview privacy and post-rollback Git reconciliation; and integrated the standards into the project architecture-keeper skill.

### KC-013: Rebuild public content from the Sunbridge brochure

- Completed: 2026-06-08
- Result: Rebuilt the public pages around brochure-supported Guitar, Badminton, AI Skills, and Holiday Camp content; added an English-default Chinese language switch; removed unsupported claims and locations; added dedicated Guitar and Holiday Camp pages; and hid all login and dashboard surfaces.

### KC-005: Remove obsolete public form-label work

- Completed: 2026-06-08
- Result: Removed the public booking and contact forms from the brochure-scoped site, so there are no current public form controls requiring label association.

### KC-004: Improve navigation accessibility

- Completed: 2026-06-08
- Result: Replaced public mobile navigation toggles with buttons, synchronized `aria-expanded`, supported Escape-to-close, and provided accessible menu labels.

### KC-002: Remove browser-only form submissions

- Completed: 2026-06-08
- Result: Removed the mock public forms and stopped loading the localStorage submission code; contact now uses only the brochure-provided communication channels.

### KC-012: Migrate the public brand and location

- Completed: 2026-06-07
- Result: Removed the former Chinese name and the `Academy` suffix, standardized the sole public brand as `Sunbridge`, changed all public campus addresses and campus labels to Barnet, London, and updated SEO text, accessibility labels, copyright text, and architecture documentation.

### KC-011: Align website branding and styling with PDF flyer guidelines

- Completed: 2026-06-06
- Result: Processed and vectorized the corporate logo to remove the bottom text band, updated the design tokens to set light mode as default with brand orange accents and dark charcoal text, and deployed theme-aware SVG logos across all 8 site pages.

### KC-001: Establish architecture and TODO governance

- Completed: 2026-06-06
- Result: Added the project-local `project-architecture-keeper` skill, documented current and planned architecture, and created a structured backlog with stable task IDs.

### KC-008: Select and implement the authentication platform

- Completed: 2026-06-06
- Result: Selected Supabase and implemented email registration/login, Google OAuth initiation, password recovery, profile management, administrator role management, PostgreSQL schema, and RLS policies.
