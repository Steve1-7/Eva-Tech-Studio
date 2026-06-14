-- Create jobs table for careers listings
create table if not exists public.jobs (
  id bigserial primary key,
  title text not null,
  company text not null,
  location text,
  job_type text,
  salary text,
  description text,
  apply_url text,
  remote boolean default false,
  featured boolean default false,
  category text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  owner_id uuid
);

create index if not exists idx_jobs_created_at on public.jobs(created_at desc);
