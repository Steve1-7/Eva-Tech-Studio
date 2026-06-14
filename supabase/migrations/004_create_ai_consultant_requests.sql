-- Table to store AI Project Consultant requests and responses for learning
create table if not exists public.ai_consultant_requests (
  id bigserial primary key,
  business_name text,
  industry text,
  website text,
  project_goals text,
  target_audience text,
  competitors text,
  required_features text,
  budget_range text,
  submitted_at timestamptz default now(),
  ai_response jsonb,
  owner_id uuid
);

create index if not exists idx_ai_consultant_submitted_at on public.ai_consultant_requests(submitted_at desc);
