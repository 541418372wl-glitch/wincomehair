# Inquiry intake and measurement

This runbook applies only to WINCOME Hair, repository `541418372wl-glitch/wincomehair`, Vercel project `wincomehair`, and Supabase project `bwozmphfjsorupvnucvk`. Read AGENTS.md before production work.

## Response contract and failure handling

- A successful database INSERT acknowledgement is required for `ok: true, saved: true`. Anti-spam rejections, validation failures, rate limits, and unavailable providers return `saved: false`.
- `saved: false` means storage is **not confirmed**. If a write times out or loses its response, `saveStatus: unknown` identifies uncertainty: the row might already exist. Never automatically retry a database write.
- The browser waits at most 35 seconds (the server has a 30-second duration and each provider call an 8-second timeout), preserves the entered form after failure, and gives uncertain submissions a WhatsApp escalation message. A manual resubmission can still create a duplicate; durable submission idempotency remains a separate database change.
- Every API response carries a random `requestId`, also used in server logs and the notification email. It is a troubleshooting reference, not a persisted inquiry ID or a GA4 user identifier.
- Once storage is confirmed, notification failure must not turn the form into a failed submission. `notificationStatus` is `accepted`, `failed`, `skipped`, or `unknown`. The backward-compatible `notified: true` only means Resend accepted a message and returned its ID; it does not prove inbox delivery.
- Vercel deployments whose `VERCEL_ENV` is not `production` reject submissions before contacting any provider. Local behavioral tests use fake providers only. Never copy production credentials into a local or preview test.

## Measurement definitions

| Metric | Evidence and meaning | Limits |
| --- | --- | --- |
| Stored inquiries | Rows in the verified Supabase inquiry table, counted using the verified creation timestamp | Includes any spam/duplicates that passed validation; business qualification requires separate review |
| Qualified inquiries | Staff-confirmed, relevant customer requests after deduplication | Cannot be inferred from a GA4 event or a database row alone |
| `generate_lead` | Production-domain visitor consent + confirmed API save; `lead_status=saved`, `measurement_version=2` | Consent refusal, blocked scripts, closed pages, and lost responses can cause undercounting |
| `whatsapp_click` | Outbound click, `interaction_type=outbound_click`, `measurement_version=2` | Does not confirm that a WhatsApp message was sent or a conversation began |
| `product_inquiry` | Product-level contact intent | May overlap with WhatsApp clicks; never add these events together as unique inquiries |
| Notification acceptance | `inquiry.email.accepted` plus Resend message ID | Delivery/bounces require Resend delivery evidence; not a new inquiry |

Only `wincomehair.com` and `www.wincomehair.com` load this production GA4 tag. Localhost and all Vercel deployment URLs are excluded even after consent. Lead acknowledgements are deduplicated in page memory by request reference; the reference is never sent to GA4 or persisted in browser storage. This does not deduplicate separate database submissions or users across browsers.

Report database counts, GA4 saved-lead events, and WhatsApp intent separately. Do not call the sum of GA4 key events “real inquiries.” Compare event counts with event counts and sessions with sessions; do not sum users across source rows.

For GEO/AI reviews, compare the same completed calendar-date labels and disclose each source timezone: GA4 and inquiry rollups use Asia/Shanghai, while GSC reports use Pacific Time. These daily boundaries differ, so do not join them as an exact session-by-session funnel. Keep source/medium and channel group distinct, and disclose consent and internal-traffic exclusions. A source attribution in GA4 does not identify every inquiry in the database. Mark the actual deployment time of measurement version 2; do not backfill or retroactively relabel earlier data.

## Production recovery and release checklist

Complete the local build and mocked tests before requesting the approvals required by AGENTS.md. Production recovery, a merge/deployment, environment changes, GA4 administration, and a real test inquiry are separate actions.

1. Verify the exact Supabase project status. If paused, prepare **Resume project** on the existing project, without creating a new project, restoring a different backup, changing plans, or adding a keepalive job. Obtain explicit approval, resume, and wait for its services to become healthy.
2. Confirm the production environment's Supabase hostname belongs to the same project without printing/exporting any credential. Check existing table columns, RLS/grants, and the rate-limit RPC metadata read-only. Do not assume a previously paused service is healthy solely because the dashboard is available.
3. Review the draft PR, obtain merge authorization, and verify the resulting main SHA, Vercel Production readiness, canonical domain, and API logs. This patch requires no new database schema or environment variable.
4. If authorized, run one clearly identified test inquiry with an owner-approved destination. Verify the saved record once, provider acceptance and delivery separately, and consented GA4 behavior. Mark/exclude the test in reconciliation; do not delete it or resend it without approval.
5. For a live inquiry with notification failure, inspect the existing saved record and Resend outcome before any resend. There is no durable notification queue or automatic retry in this patch. Do not ask the visitor to repeat a confirmed saved inquiry.
6. Inspect GA4 internal-traffic rules and the Testing filter results. Activate exclusion only after confirming that it matches staff traffic and preserves ordinary visitors, with approval for the settings change. Activation does not repair historical data; broad IP rules can discard real users.
7. Check delivery/storage health immediately after release. Review measurement consistency after 24–48 hours of processed GA4 data; compare a complete 14-day window, then 28 days for GEO decisions. Low volume warrants descriptive counts, not causal uplift claims.

## Validation

`npm test` covers rejected/limited/failed and uncertain writes, notification outcomes, preview isolation, consent lifecycle, lead callback deduplication, and form step/failure behavior with mocked providers. `npm run build` retains all repository, SEO, content-trust, and route checks. These checks do not establish production database availability or real email delivery.

References: [Vercel system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables), [Supabase project pausing](https://supabase.com/docs/guides/platform/free-project-pausing).
