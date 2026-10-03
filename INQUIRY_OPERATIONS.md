# Inquiry intake and measurement

This runbook applies only to WINCOME Hair, repository `541418372wl-glitch/wincomehair`, Vercel project `wincomehair`, and the Formspark workspace/form dedicated to this site. Supabase project `bwozmphfjsorupvnucvk` remains the historical inquiry store. Read AGENTS.md before production work.

Release configuration, 2026-10-03: the owner has approved their Gmail address, used for their Formspark account, as this site's notification recipient, and explicitly authorized the verification widget, Production variables, firewall publication, merge/deployment, and one synthetic acceptance inquiry. Preparation confirmed automatic spam filtering on, native challenge provider `None`, threading off, and an initial 250-submission balance. The dedicated Managed widget has the two intended production hostnames and no pre-clearance; the three variables are Production-only, with the form ID and validation secret marked sensitive. The firewall rule below has been published and read back as active. No purchase is authorized or required for the test. Actual deployment/cutover, archive visibility, and owner inbox confirmation must be recorded separately in Issue #14. Local validation uses mocks and does not establish real archive storage or inbox delivery.

## Intake path and provider ownership

The browser keeps the same `POST /api/notify-inquiry` route and JSON envelope: `{ record, turnstileToken }`. `turnstileToken` is a top-level value, not a field in the inquiry record. The existing business fields remain `name`, `company`, `email`, `phone`, `product_type`, `quantity`, `material`, `logo_placement`, `target_market`, `timeline`, `dimensions`, and `message`, plus the existing `form_fill_time_ms` validation value. The website honeypot remains an anti-spam control. No attachment upload is introduced; visitors send files by email or WhatsApp.

The server applies honeypot, fill-time, URL-count, and field validation before provider work. It then calls Cloudflare Siteverify, requires `success: true`, accepts only `wincomehair.com` or `www.wincomehair.com` as the returned hostname, and requires action `inquiry`. A validated request is forwarded by the server to its configured Formspark form. The browser does not receive a Formspark endpoint or post directly to Formspark.

Turnstile tokens last five minutes and can be verified once. The site server owns this verification. Configure Formspark's native challenge provider as `None`, keeping its automatic spam filter enabled. Do not enable native Turnstile or give Formspark the secret: verifying the same token twice would fail. The server does not forward the token to Formspark. Refresh the widget for a later permitted attempt; never reuse a consumed or expired token. See [Cloudflare server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) and [Formspark spam protection](https://documentation.formspark.io/setup/spam-protection.html).

The new handler does not write to Supabase, call `consume_inquiry_rate_limits`, or send new inquiry notifications through Resend. Retain the historical database and existing Resend uses. Logs carry request references and operational results, not raw IP addresses, email addresses, names, messages, token values, or provider credentials.

## Response contract and failure handling

The success contract is:

```json
{ "ok": true, "accepted": true, "submissionStatus": "accepted", "requestId": "<request-reference>" }
```

- Formspark HTTP 200 means its endpoint accepted the request. It does not prove that the submission was archived, that a notification was sent, or that email reached an inbox. Formspark can silently filter/discard a submission. The website must not return or display `saved: true`, `notified: true`, or a delivery guarantee from that acknowledgement. [Formspark AJAX submissions](https://documentation.formspark.io/examples/ajax.html) and [spam handling](https://documentation.formspark.io/setup/spam-protection.html) explain the provider behavior.
- A validation or challenge rejection before forwarding is a failed attempt. Every Formspark failure is conservatively `submissionStatus: "unknown"`, with `ok: false` and `accepted: false`: this includes non-2xx responses, non-JSON or error responses, timeouts, and lost responses. The provider may already have processed it. No automatic provider retry occurs.
- The browser has a bounded request wait, preserves entered fields after failure, and blocks a repeat submit on the current page when the result is unknown. It directs the visitor to WhatsApp and includes the request reference when available. After checking with WINCOME, the visitor can explicitly unlock a resend and complete a fresh challenge. This acknowledgement, page refreshes, and other devices can bypass the page-memory lock; there is no durable idempotency guarantee.
- Every API response carries a random `requestId`, also returned in `X-Request-ID` and included with the provider submission for reconciliation. It is a troubleshooting reference, not a Formspark submission ID or an idempotency key. Do not send it to GA4 or put customer content in logs.
- When authorized to reconcile an uncertain live request, use the reference in the correct Formspark form's archive and Spam view, and correlate operational logs without exposing customer data. Do not resend or invite a repeat merely because an email is missing. A missing archive match is not a reliable proof that an in-flight or filtered submission was never processed.
- Notification and storage checks are separate owner acceptance steps. There is no local notification queue, automatic resend, or independently verified delivery receipt in this migration.
- Non-production Vercel environments reject requests before Cloudflare or Formspark calls. The production Turnstile widget does not load on localhost or Vercel deployment URLs. Tests replace providers and widget behavior with mocks; do not use a real form ID, production secret, or real token in tests.

## Abuse protection and edge rate limit

Honeypot, fill-time, URL-count, and field checks remain, followed by server-side Turnstile and Formspark's automatic filtering. The old Supabase email/IP/content quotas are removed; these controls do not reproduce those distributed quotas. An in-memory `Map` would not provide a shared limit across Vercel function instances and is not used as a substitute.

A Formspark form ID routes submissions; it is not an authentication credential. Keeping it server-side avoids exposing it in this site's bundle but does not secure the provider endpoint if its address becomes known. Direct submissions to that address bypass this site's Turnstile verification. Keep the provider's automatic filtering and quota checks; do not claim that hiding the ID prevents all abuse.

The verified Vercel plan is Hobby. Its documented allowance includes one WAF rate-limit rule per project and 1,000,000 allowed requests. On 2026-10-03, the unused rule slot was checked and the following rule was published in this project's firewall:

| Property | Verified configuration |
| --- | --- |
| Match | Method `POST` AND exact path `/api/notify-inquiry` |
| Strategy and counting key | Fixed window, source IP |
| Window and limit | 10 requests per 60 seconds |
| Limit response | Default HTTP 429 |
| Current state | Published; the active firewall configuration was read back with this rule active and valid, and both matching conditions in the same AND group |

Vercel counts per region, so this is not a global ten-request guarantee. Shared IPs can also group unrelated visitors. Before enabling it, verify the exact project, unused rule capacity, current pricing/allowance, condition support and rule order, and ordinary visitor behavior. Saving a draft is not activation; `Publish` changes production and needs explicit authorization. Do not replace an existing rule or start paid usage without approval. [Vercel WAF rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).

## Measurement definitions

| Metric | Evidence and meaning | Limits |
| --- | --- | --- |
| New archived inquiries | Entries actually visible in the correct Formspark form after rollout, using its verified timestamps and filters | API acceptance alone does not establish this count; review spam and duplicates separately |
| Historical stored inquiries | Existing rows in Supabase `bwozmphfjsorupvnucvk` / `public.inquiries` before cutover | Kept in place; this migration does not read/export/delete them or combine them with new records |
| Qualified inquiries | Staff-confirmed, relevant customer requests after deduplication | Cannot be inferred from a GA4 event or a database row alone |
| New `generate_lead` | Production-domain visitor consent + confirmed Formspark acknowledgement; `lead_status=accepted`, `measurement_version=3` | Acceptance is not archive storage, inbox delivery, or qualification; consent refusal, blocked scripts, closed pages, and unknown responses cause undercounting |
| Earlier `generate_lead` | Former confirmed-save event; `lead_status=saved`, `measurement_version=2` | A different evidence threshold; keep it separate and do not relabel/backfill it as version 3 |
| `whatsapp_click` | Outbound click, `interaction_type=outbound_click`, `measurement_version=2` | Does not confirm that a WhatsApp message was sent or a conversation began |
| `product_inquiry` | Product-level contact intent | May overlap with WhatsApp clicks; never add these events together as unique inquiries |
| New notification delivery | Owner verification of Formspark notification settings and receipt for a separately authorized acceptance test | The inquiry API does not confirm delivery; not another inquiry |

Only `wincomehair.com` and `www.wincomehair.com` load this production GA4 tag. Localhost and all Vercel deployment URLs are excluded even after consent. Accepted lead callbacks are deduplicated in page memory by request reference; the reference is never sent to GA4 or persisted in browser storage. This does not deduplicate separate provider submissions or users across browsers. Failed, rejected, and unknown outcomes do not emit `generate_lead`.

Report Formspark archive counts, GA4 accepted-lead events, historical saved-lead events, and WhatsApp intent separately. Do not call the sum of GA4 key events “real inquiries.” Compare event counts with event counts and sessions with sessions; do not sum users across source rows.

For GEO/AI reviews, compare the same completed calendar-date labels and disclose each source timezone: GA4 reporting uses Asia/Shanghai, while GSC reports use Pacific Time. Verify Formspark's timestamp basis before rolling it up into Asia/Shanghai dates. These daily boundaries differ, so do not join them as an exact session-by-session funnel. Keep source/medium and channel group distinct, and disclose consent and internal-traffic exclusions. GA4 attribution does not identify every archived inquiry. Record the actual approved cutover time for version 3 in Issue #14 and retain the separate version 2 period.

## Provider setup, cost, and deployment order

Complete the local build, mocked tests, and full draft review before requesting the approvals required by AGENTS.md. Follow this order after the corresponding actions are explicitly authorized:

1. Verify the repository, exact Vercel project, production domain, owner account, and provider targets. Select a dedicated WINCOME Hair workspace and form. Do not connect another site's form, recipients, keys, or quota. Record only safe configuration status in Issue #14.
2. Use the prepared WINCOME Hair workspace/form and the already approved owner Gmail recipient. Confirm notification enablement and archive access for release; automatic spam filtering on, native challenge provider `None`, and threading off have already been checked. A real email acceptance test remains a separate action. [Formspark email settings](https://documentation.formspark.io/dashboard/email-notification-settings.html).
3. Recheck the prepared workspace's balance before release; preparation found 250 free submissions, so a purchase is not required for the separately authorized acceptance test. A new account's initial workspace starts with 250 free submissions. Additional workspaces created by that account start at zero, so they cannot be assumed to have the same test allowance. Upgrades and balances are per workspace. [Additional workspaces](https://documentation.formspark.io/dashboard/additional-workspaces.html).
4. If paid capacity is needed, prepare a separate purchase review. On 2026-10-03 the public pricing page advertises a promotional one-time USD 25 upgrade with 50,000 submissions, against USD 50. Recheck the offer, workspace, final checkout price, currency/tax, and included capacity before obtaining payment authorization. This draft performs no checkout or purchase and assumes no renewal price. [Formspark pricing](https://formspark.io/pricing/).
5. Create a site-specific Turnstile widget and authorize only the intended production hostnames. The widget uses action `inquiry`; the server validates both hostname and action. Configure `FORMSPARK_FORM_ID` and `TURNSTILE_SECRET_KEY` server-side, and `VITE_TURNSTILE_SITE_KEY` for the production build in the verified Vercel project. Obtain approval for provider and environment changes; never export or document real values.
6. Review/publish the proposed Vercel rule separately if its slot and conditions are verified and publication is approved. Record whether it is actually active. Local configuration and application tests cannot establish firewall activation.
7. Review the final code, privacy disclosure, CSP, response contract, and tests. Obtain merge/deployment approval, then verify the resulting main SHA, Vercel Production readiness, canonical domain, built public site key, and non-sensitive API outcomes. New code requires the three new variables; do not deploy it while those are unset. Preview continues to reject provider calls and cannot serve as real provider acceptance evidence.
8. With separate permission for a real submission and its specific recipient, send one clearly identified synthetic acceptance inquiry without customer details or attachments. Check the API acknowledgement, the matching reference in the Formspark archive/Spam view, notification receipt in the approved inbox, and consented GA4 version 3 behavior as distinct results. Mark/exclude it in reconciliation. Do not delete, resend, or add further tests without authorization.
9. Record the cutover time and release evidence. Check immediate acceptance/archive/notification health. After 24–48 hours of processed GA4 data, reconcile measurement semantics; compare completed 14-day and 28-day windows for later GEO decisions. Low volume warrants descriptive counts, not causal uplift claims.

Historical Supabase records and rate-limit schemas remain at `bwozmphfjsorupvnucvk`. This task does not read, export, delete, migrate, resume, or keep that project alive. Do not remove old provider environment settings merely because the new handler stops using them; assess any other uses separately. Historical Resend activity is outside the new inquiry path.

## Balance checks and provider continuity

Plan a weekly read-only check of this site's Formspark remaining balance and service status. Notify the owner when the balance falls below 50 submissions, becomes unavailable/exhausted, or a meaningful provider failure requires action. This document defines the schedule and threshold; it does not create an automation, send notifications, top up, or authorize payment. Keep any future monitoring limited to balance/status metadata, without reading customer inquiries.

Purchased balances are per workspace and do not expire, but that is not a promise that the service runs forever or stays uninterrupted. Formspark's terms disclaim uninterrupted availability. Maintain a migration/rollback plan rather than claiming it is more reliable than another provider from its current green status. [Formspark terms](https://formspark.io/legal/terms-of-service/) and [status](https://status.formspark.io/).

## Rollback and uncertain submission recovery

Rollback is an approved deployment/configuration action. Before restoring the previous Supabase/Resend handler, verify that the exact historical Supabase project is healthy and that the original schema/RPC and required environment settings remain usable; verify Resend configuration as needed. If the project is paused or unavailable, obtain separate approval for any recovery. Reverting code alone does not restore the old service.

If neither intake provider is verified healthy, use the site's existing WhatsApp contact option while preparing an approved repair. A WhatsApp click is only intent and cannot guarantee that a message was sent or received. Do not advertise a working form or guaranteed fallback without verification. Never automatically switch and replay uncertain submissions into another provider: reconcile the request first to avoid duplicates.

For a missing notification after cutover, an authorized owner checks the correct Formspark archive/Spam view and notification settings before deciding on any resend. Archive visibility, provider acceptance, and inbox receipt are different observations. This branch does not create an automatic resend mechanism or recover historical Supabase data.

## Validation

Run `npm test` and `npm run build` on the completed branch. Mock coverage must exercise validation/challenge rejection, hostname/action mismatch, expired/duplicate tokens, accepted/failed/unknown provider results, no automatic retry, preview rejection before provider calls, preserved fields and the unknown-result submit lock, consent, lead callback deduplication, version 3 accepted leads, and unchanged version 2 WhatsApp intent. Retain repository, SEO, content-trust, and route checks. Do not use production form IDs/tokens or real submissions in this suite.

Passing local checks establishes branch behavior with fake providers. It does not establish production configuration, firewall activation, Formspark archive storage, real inbox delivery, or restored Supabase health. Record actual check results with the draft review, not in advance.

Additional references: [Vercel system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables), [Cloudflare Turnstile testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).
