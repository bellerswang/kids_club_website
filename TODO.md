# Project TODO

Last reviewed: 2026-06-08

This file is the source of truth for unfinished engineering work. Update it during every implementation task.

## Active

### KC-003: Establish a backend implementation baseline

- Status: Ready
- Priority: P1
- Area: Backend / Infrastructure
- Next action: Confirm the phase-one scope in `backend_architecture_plan.md`, scaffold the selected backend, and document local startup and configuration.
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

### KC-014: Replace brochure contact placeholders

- Status: Blocked
- Priority: P0
- Area: Content / Launch
- Next action: Replace `07XXX XXXXXX` with the confirmed public phone number and verify that the brochure email and website domain are live.
- Acceptance criteria: Every public page shows a working phone number; phone, email, and website links are tested; no placeholder contact data remains.
- Blocked by: A confirmed public phone number has not been provided.

## Recently Completed

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
