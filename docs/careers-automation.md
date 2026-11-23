# Careers publishing and WhatsApp automation

## Architecture

This feature extends the existing Supabase-backed careers system. PostgreSQL stores jobs, WhatsApp submissions, consent records, delivery logs, and a durable outbox. Server-side Postgres functions atomically create a published job and its distribution event, and claim queued work with `FOR UPDATE SKIP LOCKED`.

WhatsApp messages are not auto-published. The deterministic parser only recognizes explicitly labelled fields, records validation problems, and places the submission in the authenticated admin inbox. An editor must correct and approve it. Approved jobs are published on `/careers/[slug]`; only then is a distribution event queued.

## Setup

1. Apply `supabase/migrations/008_careers_automation.sql` to the existing Supabase project.
2. Configure `SUPABASE_SERVICE_ROLE_KEY` only in server environments. Do not expose it to browser code.
3. Configure the Meta WhatsApp Business Platform webhook at `/api/webhooks/whatsapp`. Set the webhook verification token and Meta app secret in the server environment. The endpoint validates `X-Hub-Signature-256`, deduplicates provider message IDs, persists messages, and returns promptly.
4. Configure an approved WhatsApp message template with six body variables in this order: job title, company, location, employment type, application deadline, and public Eva-Tech-Studio job URL. Set the template name, language, phone-number ID, access token, and Graph API version in the environment.
5. Set `AUTOMATION_WORKER_SECRET`, then schedule a POST to `/api/automation/process` with `Authorization: Bearer <secret>` at a regular interval. Each request claims one event and processes a small subscriber batch to stay within serverless request limits.
6. Leave `WHATSAPP_SEND_ENABLED=false` until all credentials, webhook callbacks, and the approved template are configured and a specifically opted-in test recipient is ready. Opt in by messaging `START`; send `STOP` or `UNSUBSCRIBE` to opt out. Provider acceptance is recorded as `accepted`; only delivery callbacks update it to `delivered` or `read`.

The default outbound path is individual messaging to opted-in subscribers using an approved template. It does not scrape WhatsApp Web or send ordinary free-form broadcasts. Meta also documents a separately eligible Groups API for Official Business Accounts, with small group limits; this implementation does not assume group access. Check the current [Meta Groups API eligibility and limits](https://developers.facebook.com/documentation/business-messaging/whatsapp/groups) before enabling any group-specific integration.

Suggested approved template body (matching the six parameters):

```text
EVA-TECH-STUDIO | NEW JOB OPPORTUNITY
Position: {{1}}
Company: {{2}}
Location: {{3}}
Employment Type: {{4}}
Closing Date: {{5}}
View full requirements and apply: {{6}}
```

## Administration

- Manage manual listings at `/admin/jobs`.
- Review, correct, publish, or reject WhatsApp submissions at `/admin/job-submissions`.
- Public job pages omit expired roles and include social metadata and JobPosting structured data only when core listing details are available.
- WhatsApp messages retain the source record and are not described as employer-verified by default.
- Administrator access still follows the existing `AUTHORIZED_EMAIL` allowlist; separate administrator/editor/support roles are not yet implemented.

## Operations and limitations

- The worker retries transient event failures with exponential delay. A failed WhatsApp event does not unpublish its job.
- A network failure after a provider accepts a send but before the response is recorded is inherently ambiguous; delivery callbacks and distribution logs must be checked before any manual resend to avoid duplicate messages.
- No real WhatsApp messages are sent by tests. Sending requires the explicit `WHATSAPP_SEND_ENABLED=true` setting.
- The provider requires eligible business assets, valid credentials, approved templates, recipient consent, and policy-compliant messaging. The code does not claim the integration is live until these are provisioned.
