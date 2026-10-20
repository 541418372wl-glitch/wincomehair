# Inquiry consent snapshot

Each original Formspark submission includes three fixed metadata fields:

| Field | Meaning |
| --- | --- |
| `analytics_consent_at_submit` | Browser-reported choice when submitting: `granted`, `denied`, `unset`, or `unknown` |
| `diagnostic_version` | Metadata format version `1` |
| `measurement_version` | Existing inquiry measurement contract `3` |

`unset` means no stored choice was found. Invalid or inaccessible storage is
`unknown`, unless a valid choice is available in memory for this page.
Old clients, missing metadata, invalid values and unsupported format versions
are also `unknown`. Unknown is not the same as a refusal.
The server allowlists the state and supplies fixed version values; arbitrary
diagnostic properties never reach Formspark. These fields are client-reported
evidence, not an independently verified consent audit trail.

Metadata travels with the existing inquiry, using the same endpoint, security
verification, provider request, recipient and request reference. It does not
create another submission. There is no follow-up diagnostic endpoint, signing
key, additional database, logging service or new rate-limit rule. Provider
quotas and existing hosting terms continue to apply.

## Reading a future inquiry

1. Use the Formspark record and confirmed notifications as the business evidence.
   Metadata can also appear in the provider's notification email; actual rendering
   will be checked on a future natural inquiry, not by sending a test.
2. Read `analytics_consent_at_submit`. Under the existing consent gate, denied or
   absent consent prevents GA measurement. A choice can change while the inquiry
   is in flight; this snapshot does not establish the state at every later step.
3. If it says `granted` but GA4 has no corresponding aggregate increase, client
   acknowledgement, tag blocking, network loss and reporting delay remain possible.
   This simplified feature cannot distinguish them or prove Google ingestion.
4. For old records without metadata, mark the state unknown. Never backfill a
   guessed state or replay a historical lead.

The private request reference stays out of GA4. Analytics remains optional:
this metadata does not grant consent, load Google tags or emit extra GA events.
It captures only submission-time choice; it does not add tag callbacks, timers,
retries, or a post-submit tracking request.

## Retention and verification

The metadata follows the inquiry record's retention policy. This feature does
not provide 30-day log storage or automatic deletion. The existing privacy page
describes inquiry retention and manual review.

`npm test` covers API allowlisting, old clients, invalid states, unchanged
acceptance/failure responses, consent reads with unavailable storage, and
browser flows with changing consent. All provider and browser requests are
mocked; tests have no fallback to real inquiries or Google collection.
`npm run build` checks client/SSR and existing content/route gates.

This is local preparation. Production deployment still requires approval.
