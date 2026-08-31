# WINCOME Hair Development and Operations Setup

This repository is only for the WINCOME Hair Accessories site:

- GitHub: `541418372wl-glitch/wincomehair`
- Production: `https://wincomehair.com`
- Vercel: team `wincomeapparel`, project `wincomehair`
- Default branch: `main`

Read `AGENTS.md`, `PROJECT_HANDOFF.md`, and GitHub Issue #14 before starting work. Do not use files, credentials, content, or deployment settings from another site.

## Package manager

npm is the only supported package manager. `package-lock.json` is the authoritative lockfile. Do not add Bun, pnpm, or Yarn lockfiles unless a separately approved migration replaces npm everywhere.

Use a current Node.js LTS release with npm, then install exactly from the lockfile:

```bash
npm ci
```

## Local development

```bash
npm run dev
```

Before opening a pull request, run:

```bash
npm run build
npm test
```

The build performs client and SSR builds, prerenders every public route, and runs asset, metadata, GEO/AI discovery, article-trust, and repository-governance checks.

To inspect the production build locally:

```bash
npm run preview
```

## Environment variables

Copy `.env.example` to `.env.local` only when local server testing requires it. Never commit real values.

The inquiry API uses these server-only variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NOTIFY_EMAIL`
- optional `NOTIFY_FROM`

The current browser bundle does not require a Supabase anonymous key. `SUPABASE_SERVICE_ROLE_KEY` must never be renamed with a `VITE_` prefix because Vite exposes `VITE_*` variables to browser code.

Vercel supplies `VERCEL_URL` and `NODE_ENV`. Production values must be managed only in the verified Vercel project; do not copy values from another project or paste them into chat, Issues, pull requests, or documentation.

## Data and storage boundaries

- Public source and assets: this GitHub repository.
- Production pages and public static assets: Vercel project `wincomehair`.
- Customer inquiries: Supabase project `wincomehair`, table `public.inquiries`.
- Distributed rate-limit hashes: Supabase `private.inquiry_rate_limits`.
- Inquiry email notifications: Resend.
- Local private working data: the current Codex project container `.private/`, outside the Git repository.

Never place customer records, analytics exports, credentials, certificates, or backend screenshots in this public repository.

## Database changes

Supabase migrations live in `supabase/migrations/`. Review the live project identity and current migration list before preparing a new migration. Database writes, migrations, RLS changes, and environment-variable changes require explicit approval.

## Git and release workflow

1. Verify the repository, remote, latest `origin/main`, Vercel project, and production domain.
2. Read Issue #14 completely and check for duplicate work.
3. Create an `agent/<wincomehair-task>` branch from the latest `origin/main`.
4. Review the full diff and run the build and test commands.
5. Open a pull request with base `main`.
6. Do not merge, deploy, submit indexing, change configuration, or contact external platforms without explicit approval.

Direct scripts that write GitHub contents to `main` are prohibited. Production normally updates only after an approved pull request is merged and the verified Vercel Git integration completes.

`npm run submit:indexnow` changes external state. Use `--dry-run` for validation and do not submit without explicit approval and Issue #14 deduplication.
