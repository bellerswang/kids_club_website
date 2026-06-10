# Sunbridge Website

Public bilingual website and future platform repository for Sunbridge.

## Repository Status

- Root HTML files are the current production and rollback baseline.
- `apps/web` is the content-driven Astro migration for Cloudflare Preview.
- English uses root routes; Chinese uses dedicated `/zh/` routes.
- Login, booking, and dashboard features are not currently public.

## Structure

```text
apps/web/                 Astro static site migration
docs/                     Architecture, content, and release standards
supabase/                 Future Supabase database migrations
archive/                  Inactive prototypes, tools, and historical code
index.html + *.html       Current production rollback baseline
css/ + js/ + images/      Current production rollback assets
```

## Local Development

```powershell
cd apps/web
npm install
npm run dev
```

Checks and production build:

```powershell
cd apps/web
npm run check
npm run build
```

Serve the current production baseline:

```powershell
python -m http.server 8000
```

## Documentation

- [Current architecture](ARCHITECTURE.md)
- [Architecture overview](docs/ARCHITECTURE_OVERVIEW.md)
- [Target architecture](docs/TARGET_ARCHITECTURE.md)
- [Update workflow](docs/UPDATE_SOP.md)
- [Release checklist](docs/RELEASE_CHECKLIST.md)
- [Content rules](docs/CONTENT_RULES.md)
- [Engineering backlog](TODO.md)

## Migration Guard

Do not remove the root production baseline or change the Cloudflare Production build settings until all Astro pages, bilingual content, old URL redirects, and Preview checks pass.
