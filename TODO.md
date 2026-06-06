# Project TODO

Last reviewed: 2026-06-06

This file is the source of truth for unfinished engineering work. Update it during every implementation task.

## Active

### KC-002: Replace browser-only form storage with a real submission service

- Status: Ready
- Priority: P0
- Area: Forms / Backend
- Next action: Define the booking and contact API contract, then connect both forms to a server endpoint.
- Acceptance criteria: Submissions persist outside the visitor's browser; failures are shown honestly; successful submissions can be accessed by academy staff; automated tests cover success and failure paths.
- Notes: The current success message is misleading because data exists only in localStorage.

### KC-003: Establish a backend implementation baseline

- Status: Ready
- Priority: P1
- Area: Backend / Infrastructure
- Next action: Confirm the phase-one scope in `backend_architecture_plan.md`, scaffold the selected backend, and document local startup and configuration.
- Acceptance criteria: A health endpoint runs locally; configuration comes from environment variables; dependencies are pinned; backend checks run with one documented command.

### KC-004: Improve navigation accessibility

- Status: Ready
- Priority: P1
- Area: Frontend / Accessibility
- Next action: Replace mobile-menu toggle divs with buttons and synchronize `aria-expanded` with menu state on every page.
- Acceptance criteria: The menu is operable by keyboard, has an accessible name, exposes open/closed state, and closes predictably with Escape.

### KC-005: Associate form labels with controls

- Status: Ready
- Priority: P2
- Area: Frontend / Accessibility
- Next action: Add stable input IDs and matching label `for` attributes to booking and contact forms.
- Acceptance criteria: Every visible form label programmatically identifies exactly one control and browser validation remains functional.

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
- Next action: Add unique meta descriptions and appropriate social sharing metadata to each public page.
- Acceptance criteria: Every page has a unique title and description, and shared links expose intentional title, description, and image data.

### KC-009: Deploy and verify the Supabase authentication system

- Status: Blocked
- Priority: P0
- Area: Authentication / Deployment
- Next action: Create the Supabase cloud project, run `supabase/migrations/001_auth_system.sql`, configure `js/supabase-config.js`, set Auth redirect URLs, enable Google OAuth if required, and bootstrap the first administrator.
- Acceptance criteria: Registration confirmation, login, logout, password reset, profile update, Google login, ordinary-user RLS denial, administrator user listing, and administrator role updates all pass against the deployed project.
- Blocked by: Supabase project URL, publishable key, email/OAuth provider configuration, and an owner email address are not yet available in the workspace.

### KC-010: Harden authentication for production launch

- Status: Ready
- Priority: P1
- Area: Authentication / Operations
- Next action: Configure custom SMTP, CAPTCHA or equivalent abuse protection, rate-limit monitoring, backup retention, and a restore drill.
- Acceptance criteria: Production email uses the academy domain; automated sign-up abuse is limited; alerting exists for unusual authentication activity; a documented restore test succeeds.

## Recently Completed

### KC-011: Align website branding and styling with PDF flyer guidelines

- Completed: 2026-06-06
- Result: Processed and vectorized the corporate logo to remove the bottom text band, updated the design tokens to set light mode as default with brand orange accents and dark charcoal text, and deployed theme-aware SVG logos across all 8 site pages.

### KC-001: Establish architecture and TODO governance

- Completed: 2026-06-06
- Result: Added the project-local `project-architecture-keeper` skill, documented current and planned architecture, and created a structured backlog with stable task IDs.

### KC-008: Select and implement the authentication platform

- Completed: 2026-06-06
- Result: Selected Supabase and implemented email registration/login, Google OAuth initiation, password recovery, profile management, administrator role management, PostgreSQL schema, and RLS policies.
