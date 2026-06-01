-- Backfill owner_id for existing blog_posts with a chosen admin UUID
-- Replace '00000000-0000-0000-0000-000000000000' with your admin user's UUID

BEGIN;

UPDATE blog_posts
SET owner_id = '00000000-0000-0000-0000-000000000000'
WHERE owner_id IS NULL;

COMMIT;

-- IMPORTANT: Replace the UUID above with the actual admin user UUID from your auth.users table
-- Example (psql):
-- \set ADMIN_UUID 'a1b2c3d4-...'
-- UPDATE blog_posts SET owner_id = :'ADMIN_UUID' WHERE owner_id IS NULL;
