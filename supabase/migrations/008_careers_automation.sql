ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS source_url text,
  ADD COLUMN IF NOT EXISTS deadline date,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS risk_status text NOT NULL DEFAULT 'clear',
  ADD COLUMN IF NOT EXISTS source_type text NOT NULL DEFAULT 'admin',
  ADD COLUMN IF NOT EXISTS content_hash text;

UPDATE public.jobs
SET slug = 'job-' || id::text
WHERE slug IS NULL;

ALTER TABLE public.jobs
  ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_jobs_slug ON public.jobs(slug);
CREATE INDEX IF NOT EXISTS idx_jobs_published_created
  ON public.jobs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline
  ON public.jobs(deadline)
  WHERE deadline IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_content_hash
  ON public.jobs(content_hash)
  WHERE content_hash IS NOT NULL;

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS careers_public_read_published ON public.jobs;
CREATE POLICY careers_public_read_published
  ON public.jobs
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'published'
    AND (deadline IS NULL OR deadline >= current_date)
  );

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.job_submissions (
  id bigserial PRIMARY KEY,
  source_type text NOT NULL CHECK (source_type IN ('whatsapp', 'admin')),
  provider_event_id text,
  sender_id text,
  raw_content text NOT NULL,
  extracted_fields jsonb NOT NULL DEFAULT '{}'::jsonb,
  validation_errors jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'received'
    CHECK (status IN ('received', 'review', 'published', 'rejected', 'failed')),
  job_id bigint REFERENCES public.jobs(id) ON DELETE SET NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_job_submissions_provider_event
  ON public.job_submissions(source_type, provider_event_id)
  WHERE provider_event_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_job_submissions_status_received
  ON public.job_submissions(status, received_at DESC);

CREATE TABLE IF NOT EXISTS public.automation_events (
  id bigserial PRIMARY KEY,
  event_type text NOT NULL CHECK (event_type IN ('submission_received', 'job_published')),
  idempotency_key text NOT NULL UNIQUE,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'done', 'failed', 'dead')),
  attempts integer NOT NULL DEFAULT 0,
  available_at timestamptz NOT NULL DEFAULT now(),
  locked_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_automation_events_ready
  ON public.automation_events(status, available_at, created_at);

CREATE TABLE IF NOT EXISTS public.subscribers (
  id bigserial PRIMARY KEY,
  phone_number text NOT NULL UNIQUE,
  consent_status text NOT NULL CHECK (consent_status IN ('active', 'unsubscribed')),
  consented_at timestamptz NOT NULL,
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.distribution_logs (
  id bigserial PRIMARY KEY,
  event_id bigint NOT NULL REFERENCES public.automation_events(id) ON DELETE CASCADE,
  job_id bigint NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  subscriber_id bigint REFERENCES public.subscribers(id) ON DELETE SET NULL,
  destination text NOT NULL,
  provider_message_id text,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'delivered', 'read', 'failed')),
  attempt_count integer NOT NULL DEFAULT 0,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, subscriber_id)
);

CREATE INDEX IF NOT EXISTS idx_distribution_logs_provider_message
  ON public.distribution_logs(provider_message_id)
  WHERE provider_message_id IS NOT NULL;

ALTER TABLE public.job_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distribution_logs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.claim_automation_events(p_limit integer DEFAULT 10)
RETURNS SETOF public.automation_events
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.automation_events
  SET status = 'dead',
      last_error = 'Worker lease expired after maximum attempts.',
      locked_at = NULL
  WHERE status = 'processing'
    AND locked_at < now() - interval '5 minutes'
    AND attempts >= 8;

  RETURN QUERY
  WITH ready AS (
    SELECT id
    FROM public.automation_events
    WHERE (
      (status IN ('pending', 'failed') AND available_at <= now())
      OR (status = 'processing' AND locked_at < now() - interval '5 minutes')
    )
      AND attempts < 8
    ORDER BY created_at
    FOR UPDATE SKIP LOCKED
    LIMIT LEAST(GREATEST(p_limit, 1), 50)
  )
  UPDATE public.automation_events AS event
  SET status = 'processing',
      attempts = event.attempts + 1,
      locked_at = now(),
      last_error = NULL
  FROM ready
  WHERE event.id = ready.id
  RETURNING event.*;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_published_job(p_job jsonb)
RETURNS public.jobs
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  created_job public.jobs;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended(
    lower(btrim(p_job->>'company')) || '|' || lower(btrim(p_job->>'title')),
    0
  ));
  IF NULLIF(p_job->>'apply_url', '') IS NOT NULL THEN
    PERFORM pg_advisory_xact_lock(hashtextextended(
      'apply|' || lower(rtrim(p_job->>'apply_url', '/')),
      0
    ));
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.jobs
    WHERE status = 'published'
      AND (deadline IS NULL OR deadline >= current_date)
      AND (
        (lower(btrim(company)) = lower(btrim(p_job->>'company'))
          AND lower(btrim(title)) = lower(btrim(p_job->>'title')))
        OR (NULLIF(p_job->>'content_hash', '') IS NOT NULL
          AND content_hash = p_job->>'content_hash')
        OR (NULLIF(p_job->>'apply_url', '') IS NOT NULL
          AND lower(rtrim(apply_url, '/')) = lower(rtrim(p_job->>'apply_url', '/')))
      )
  ) THEN
    RAISE EXCEPTION 'Potential duplicate job listing';
  END IF;

  INSERT INTO public.jobs (
    title, company, location, job_type, salary, description, apply_url,
    remote, featured, category, slug, source_url, deadline, status,
    verification_status, risk_status, source_type, content_hash
  )
  VALUES (
    p_job->>'title',
    p_job->>'company',
    NULLIF(p_job->>'location', ''),
    NULLIF(p_job->>'job_type', ''),
    NULLIF(p_job->>'salary', ''),
    NULLIF(p_job->>'description', ''),
    NULLIF(p_job->>'apply_url', ''),
    COALESCE((p_job->>'remote')::boolean, false),
    COALESCE((p_job->>'featured')::boolean, false),
    NULLIF(p_job->>'category', ''),
    p_job->>'slug',
    NULLIF(p_job->>'source_url', ''),
    NULLIF(p_job->>'deadline', '')::date,
    'published',
    COALESCE(NULLIF(p_job->>'verification_status', ''), 'unverified'),
    COALESCE(NULLIF(p_job->>'risk_status', ''), 'clear'),
    COALESCE(NULLIF(p_job->>'source_type', ''), 'admin'),
    NULLIF(p_job->>'content_hash', '')
  )
  RETURNING * INTO created_job;

  INSERT INTO public.automation_events (event_type, idempotency_key, payload)
  VALUES (
    'job_published',
    'job-published:' || created_job.id::text,
    jsonb_build_object('job_id', created_job.id)
  )
  ON CONFLICT (idempotency_key) DO NOTHING;

  RETURN created_job;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_published_job(
  p_job_id bigint,
  p_job jsonb
)
RETURNS public.jobs
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_job public.jobs;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended(
    lower(btrim(p_job->>'company')) || '|' || lower(btrim(p_job->>'title')),
    0
  ));
  IF NULLIF(p_job->>'apply_url', '') IS NOT NULL THEN
    PERFORM pg_advisory_xact_lock(hashtextextended(
      'apply|' || lower(rtrim(p_job->>'apply_url', '/')),
      0
    ));
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.jobs
    WHERE id <> p_job_id
      AND status = 'published'
      AND (deadline IS NULL OR deadline >= current_date)
      AND (
        (lower(btrim(company)) = lower(btrim(p_job->>'company'))
          AND lower(btrim(title)) = lower(btrim(p_job->>'title')))
        OR (NULLIF(p_job->>'content_hash', '') IS NOT NULL
          AND content_hash = p_job->>'content_hash')
        OR (NULLIF(p_job->>'apply_url', '') IS NOT NULL
          AND lower(rtrim(apply_url, '/')) = lower(rtrim(p_job->>'apply_url', '/')))
      )
  ) THEN
    RAISE EXCEPTION 'Potential duplicate job listing';
  END IF;

  UPDATE public.jobs
  SET title = p_job->>'title',
      company = p_job->>'company',
      location = NULLIF(p_job->>'location', ''),
      job_type = NULLIF(p_job->>'job_type', ''),
      salary = NULLIF(p_job->>'salary', ''),
      description = NULLIF(p_job->>'description', ''),
      apply_url = NULLIF(p_job->>'apply_url', ''),
      remote = COALESCE((p_job->>'remote')::boolean, false),
      featured = COALESCE((p_job->>'featured')::boolean, false),
      category = NULLIF(p_job->>'category', ''),
      source_url = NULLIF(p_job->>'source_url', ''),
      deadline = NULLIF(p_job->>'deadline', '')::date,
      content_hash = NULLIF(p_job->>'content_hash', ''),
      updated_at = now()
  WHERE id = p_job_id
  RETURNING * INTO updated_job;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Job was not found';
  END IF;

  RETURN updated_job;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_whatsapp_submission(
  p_provider_event_id text,
  p_sender_id text,
  p_raw_content text
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  submission_id bigint;
BEGIN
  INSERT INTO public.job_submissions (
    source_type, provider_event_id, sender_id, raw_content
  )
  VALUES ('whatsapp', p_provider_event_id, p_sender_id, p_raw_content)
  ON CONFLICT (source_type, provider_event_id)
    WHERE provider_event_id IS NOT NULL
    DO NOTHING
  RETURNING id INTO submission_id;

  IF submission_id IS NULL THEN
    SELECT id INTO submission_id
    FROM public.job_submissions
    WHERE source_type = 'whatsapp'
      AND provider_event_id = p_provider_event_id;
  END IF;

  INSERT INTO public.automation_events (event_type, idempotency_key, payload)
  VALUES (
    'submission_received',
    'submission:' || p_provider_event_id,
    jsonb_build_object('submission_id', submission_id)
  )
  ON CONFLICT (idempotency_key) DO NOTHING;

  RETURN submission_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.approve_job_submission(
  p_submission_id bigint,
  p_job jsonb,
  p_validation_errors jsonb DEFAULT '[]'::jsonb
)
RETURNS public.jobs
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  submission public.job_submissions;
  created_job public.jobs;
BEGIN
  SELECT * INTO submission
  FROM public.job_submissions
  WHERE id = p_submission_id
  FOR UPDATE;

  IF NOT FOUND OR submission.status <> 'review' THEN
    RAISE EXCEPTION 'Submission is not available for approval';
  END IF;

  IF jsonb_array_length(COALESCE(p_validation_errors, '[]'::jsonb)) > 0 THEN
    RAISE EXCEPTION 'Submission has validation errors and cannot be approved';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(
    lower(btrim(p_job->>'company')) || '|' || lower(btrim(p_job->>'title')),
    0
  ));
  IF NULLIF(p_job->>'apply_url', '') IS NOT NULL THEN
    PERFORM pg_advisory_xact_lock(hashtextextended(
      'apply|' || lower(rtrim(p_job->>'apply_url', '/')),
      0
    ));
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.jobs
    WHERE status = 'published'
      AND (deadline IS NULL OR deadline >= current_date)
      AND (
        (lower(btrim(company)) = lower(btrim(p_job->>'company'))
          AND lower(btrim(title)) = lower(btrim(p_job->>'title')))
        OR (NULLIF(p_job->>'content_hash', '') IS NOT NULL
          AND content_hash = p_job->>'content_hash')
        OR (NULLIF(p_job->>'apply_url', '') IS NOT NULL
          AND lower(rtrim(apply_url, '/')) = lower(rtrim(p_job->>'apply_url', '/')))
      )
  ) THEN
    RAISE EXCEPTION 'Potential duplicate job listing';
  END IF;

  INSERT INTO public.jobs (
    title, company, location, job_type, salary, description, apply_url,
    remote, featured, category, slug, source_url, deadline, status,
    verification_status, risk_status, source_type, content_hash
  )
  VALUES (
    p_job->>'title',
    p_job->>'company',
    NULLIF(p_job->>'location', ''),
    NULLIF(p_job->>'job_type', ''),
    NULLIF(p_job->>'salary', ''),
    NULLIF(p_job->>'description', ''),
    NULLIF(p_job->>'apply_url', ''),
    COALESCE((p_job->>'remote')::boolean, false),
    false,
    NULLIF(p_job->>'category', ''),
    p_job->>'slug',
    NULLIF(p_job->>'source_url', ''),
    NULLIF(p_job->>'deadline', '')::date,
    'published',
    'unverified',
    'clear',
    'whatsapp',
    NULLIF(p_job->>'content_hash', '')
  )
  RETURNING * INTO created_job;

  UPDATE public.job_submissions
  SET status = 'published',
      job_id = created_job.id,
      extracted_fields = COALESCE(p_job->'extracted_fields', extracted_fields),
      validation_errors = '[]'::jsonb,
      processed_at = now()
  WHERE id = p_submission_id;

  INSERT INTO public.automation_events (event_type, idempotency_key, payload)
  VALUES (
    'job_published',
    'job-published:' || created_job.id::text,
    jsonb_build_object('job_id', created_job.id)
  )
  ON CONFLICT (idempotency_key) DO NOTHING;

  RETURN created_job;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_automation_events(integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_published_job(jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_published_job(bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_whatsapp_submission(text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.approve_job_submission(bigint, jsonb, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_automation_events(integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.create_published_job(jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_published_job(bigint, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.record_whatsapp_submission(text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.approve_job_submission(bigint, jsonb, jsonb) TO service_role;
