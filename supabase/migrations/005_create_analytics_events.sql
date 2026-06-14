-- Analytics events table for tracking AI feature usage and leads
create table if not exists public.analytics_events (
  id bigserial primary key,
  event_type text not null,
  properties jsonb,
  ip text,
  user_agent text,
  created_at timestamptz default now()
);

create index if not exists idx_analytics_events_created_at on public.analytics_events(created_at desc);
