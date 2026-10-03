# WINCOME Hair Development and Operations Setup

This repository is only for the WINCOME Hair Accessories site:

- GitHub: `541418372wl-glitch/wincomehair`
- Production: `https://wincomehair.com`
- Vercel: team `wincomeapparel`, project `wincomehair`
- Default branch: `main`

Read `AGENTS.md`, `PROJECT_HANDOFF.md`, and GitHub Issue #14 before starting work. Do not use files, credentials, content, or deployment settings from another site.

## Inquiry configuration

New inquiries use Formspark + Cloudflare Turnstile. The owner has approved their Gmail address as this site's notification recipient. Preparation checks on 2026-10-03 confirmed automatic spam filtering on, native challenge provider `None`, threading off, and an initial 250-submission balance. The owner authorized the site-specific verification widget, Production variables, firewall publication, merge/deployment, and one synthetic acceptance inquiry. The widget and all three Production variables have been configured, and the firewall rule below has been published and read back as active. No purchase is authorized or required for this test. Check Issue #14 for the actual deployment, cutover, archive, and inbox evidence; configuration alone does not establish those results.

The browser continues to POST to `/api/notify-inquiry`. The server validates the request and a Turnstile token, then forwards the inquiry to the Formspark form dedicated to WINCOME Hair. Formspark provides the submission archive and configured email notifications. The form accepts no attachments; visitors send reference files by email or WhatsApp.

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

The build performs client and SSR builds, prerenders every public route, and runs asset, metadata, GEO/AI discovery, article-trust, repository-governance, and internal-link checks. Rendering errors fail the build. Article listings and SEO use a virtual summary module generated from the original content; full article bodies load with the article page. A bundle gate prevents those bodies from returning to the initial client graph.

`npm test` uses fake inquiry providers for acceptance, rejection, timeouts, Turnstile validation, and preview isolation, alongside analytics consent lifecycle, contact-form DOM, SEO navigation, and SSR checks. It does not submit real inquiries. JSDOM checks behavior, not visual layout; use a browser preview for visual review.

Provider calls have bounded timeouts within the function's configured duration. An uncertain Formspark response is not automatically retried. The browser preserves the form and locks resubmission on the current page when the result is unknown; the owner must reconcile the request reference before asking for another submission.

To inspect the production build locally:

```bash
npm run preview
```

## Environment variables

`.env.example` documents names and placeholders. Local behavioral tests use mocked values and providers. Never copy production form IDs, keys, or tokens into local/preview tests or commit real values.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `FORMSPARK_FORM_ID` | Server only | The form in the WINCOME Hair workspace; the server constructs its Formspark endpoint |
| `TURNSTILE_SECRET_KEY` | Server only | Validates tokens with Cloudflare Siteverify |
| `VITE_TURNSTILE_SITE_KEY` | Browser, supplied at build time | Renders the production Turnstile widget; this site key is public |

The form ID and secret key must never have a `VITE_` prefix. Vite exposes `VITE_*` values to browser code. A change to `VITE_TURNSTILE_SITE_KEY` requires a new build; adding an environment variable to an existing deployment does not rebuild its browser bundle.

Vercel supplies `VERCEL_URL`, `VERCEL_ENV`, and `NODE_ENV`. Non-production Vercel environments reject inquiry submissions before contacting Cloudflare or Formspark. The browser widget is restricted to the exact production hosts `wincomehair.com` and `www.wincomehair.com`; localhost and Vercel deployment URLs do not load the production widget. Manage production values only in the verified Vercel project, without pasting values into chat, Issues, pull requests, or documentation.

The new inquiry handler does not require `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `NOTIFY_EMAIL`, or `NOTIFY_FROM`. Their existing production values are a historical/rollback concern, not an instruction to delete them or change another service's settings.

## Data and storage boundaries

- Public source and assets: this GitHub repository.
- Production pages and public static assets: Vercel project `wincomehair`.
- New inquiries after the approved rollout: the Formspark workspace and form dedicated to WINCOME Hair, with recipient settings verified separately.
- New inquiry notifications after rollout: Formspark; an accepted submission does not confirm archive storage or inbox delivery.
- Historical inquiries: Supabase project `wincomehair` / `bwozmphfjsorupvnucvk`, table `public.inquiries`. Keep the existing records and rate-limit schema in place. This migration does not read, export, move, or delete them.
- Historical Resend uses and credentials: preserved. The new inquiry handler stops sending new inquiries through Resend; this does not authorize modifying unrelated historical uses.
- Local private working data: the current Codex project container `.private/`, outside the Git repository.

Never place customer records, analytics exports, credentials, certificates, or backend screenshots in this public repository.

The new API does not call Supabase INSERTs or `consume_inquiry_rate_limits`. The old distributed email/IP/content quotas are removed from this intake path. Honeypot, fill-time, URL-count, and field validation remain, followed by server-side Turnstile and Formspark automatic filtering. No in-memory `Map` replaces the distributed quotas. On 2026-10-03, the verified project's Vercel firewall rule was published and read back as active: method `POST` AND exact path `/api/notify-inquiry`, fixed window, 10 requests per IP per 60 seconds, default HTTP 429. Counts are per region; see the operations runbook.

## Database changes

Historical Supabase migrations remain in `supabase/migrations/`. This inquiry migration requires no database migration and does not remove tables, RPCs, or records. A rollback to the old handler requires a healthy, verified Supabase project and usable original environment settings; restoring old code alone cannot restore an unavailable provider. Database writes, migrations, RLS changes, and environment-variable changes require explicit approval.

## Git and release workflow

1. Verify the repository, remote, latest `origin/main`, Vercel project, and production domain.
2. Read Issue #14 completely and check for duplicate work.
3. Create an `agent/<wincomehair-task>` branch from the latest `origin/main`.
4. Review the full diff and run the build and test commands.
5. Open a pull request with base `main`.
6. Do not merge, deploy, submit indexing, change configuration, or contact external platforms without explicit approval.

Direct scripts that write GitHub contents to `main` are prohibited. Production normally updates only after an approved pull request is merged and the verified Vercel Git integration completes.

`npm run submit:indexnow` changes external state. Use `--dry-run` for validation and do not submit without explicit approval and Issue #14 deduplication.

## Inquiry operations and measurement

See [INQUIRY_OPERATIONS.md](INQUIRY_OPERATIONS.md) for the accepted/unknown response contract, Turnstile ownership, deployment order, recipient and archive/email acceptance checks, balance monitoring, rollback, and measurement definitions. GA4 `generate_lead` requires visitor consent and a confirmed provider acceptance, using `lead_status=accepted` and `measurement_version=3`. It does not confirm a stored or qualified inquiry. Keep older `saved` version 2 events separate; WhatsApp clicks continue to measure contact intent with version 2.
