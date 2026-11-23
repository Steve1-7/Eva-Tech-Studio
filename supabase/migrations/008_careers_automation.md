# Careers automation migration

Run `008_careers_automation.sql` in the Supabase SQL editor or with the project's normal migration process. Existing job rows are retained, marked published, and assigned stable legacy slugs.

The application uses Supabase/Postgres as its durable store, matching the existing repository; it does not introduce MongoDB. The migration creates a service-role-only submissions inbox and outbox, consent records, delivery logs, and atomic event-claiming and job-publishing functions.
