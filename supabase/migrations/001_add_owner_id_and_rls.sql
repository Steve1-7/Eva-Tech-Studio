-- Migration: Add owner_id to blog_posts, enable RLS, and create ownership policies
-- Run this file against your Postgres/Supabase database (via psql or Supabase SQL editor).

BEGIN;

-- Add owner_id column (nullable for now)
ALTER TABLE IF EXISTS blog_posts ADD COLUMN IF NOT EXISTS owner_id UUID;

-- Index for owner lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_owner_id ON blog_posts(owner_id);

-- IMPORTANT: Backfill strategy
-- 1) If you have a mapping from existing `author` names to user UUIDs, run an UPDATE mapping those values.
-- 2) If you want to mark all existing posts as "admin-owned", choose an admin UUID (e.g. the admin user in your auth system) and run:
--    UPDATE blog_posts SET owner_id = '00000000-0000-0000-0000-000000000000' WHERE owner_id IS NULL;
--    (Replace the UUID above with a real admin user UUID.)
-- 3) If unsure, leave owner_id NULL and backfill later from your application admin UI.

-- Enable Row Level Security on blog_posts to enforce per-tenant access
ALTER TABLE IF EXISTS blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public SELECT only for published posts or when owner matches auth.uid()
CREATE POLICY IF NOT EXISTS public_select_published ON blog_posts
  FOR SELECT
  USING (published = true OR owner_id = auth.uid());

-- Policy: Allow clients to INSERT posts only where owner_id equals auth.uid()
CREATE POLICY IF NOT EXISTS client_insert_own ON blog_posts
  FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Policy: Allow owners to UPDATE their own posts
CREATE POLICY IF NOT EXISTS owner_update ON blog_posts
  FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Policy: Allow owners to DELETE their own posts
CREATE POLICY IF NOT EXISTS owner_delete ON blog_posts
  FOR DELETE
  USING (owner_id = auth.uid());

-- Note: Admins and server-side processes that need global access should use the Supabase
-- service_role key (server-only). Service role queries bypass RLS.

COMMIT;
