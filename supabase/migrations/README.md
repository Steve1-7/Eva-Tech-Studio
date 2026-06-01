Migration: Add `owner_id` to `blog_posts` and enable RLS

What this migration does:
- Adds a nullable `owner_id UUID` column to `blog_posts`.
- Creates an index on `owner_id`.
- Enables Row-Level Security on `blog_posts` and creates example policies
  that allow:
  - Public SELECT only for published posts or the post owner.
  - Clients to INSERT posts only where `owner_id = auth.uid()`.
  - Owners to UPDATE/DELETE their own posts.

How to run:
- Option A: Supabase SQL editor
  - Open your Supabase project dashboard → SQL Editor → New query
  - Paste the contents of `001_add_owner_id_and_rls.sql` and run it.

- Option B: psql (local or remote)
  - Ensure `PGHOST`/`PGPORT`/`PGUSER`/`PGPASSWORD`/`PGDATABASE` are set, then:

```powershell
psql "postgresql://user:pass@host:port/database" -f supabase/migrations/001_add_owner_id_and_rls.sql
```

Backfill guidance:
- If you have an existing users table mapping author names to UUIDs, run an UPDATE
  to set `owner_id` accordingly.
- To mark all existing posts as admin-owned (not recommended unless intentional),
  update `owner_id` to a chosen admin UUID.

Caveats:
- RLS will restrict access for anon/unauthenticated queries. Use the Supabase
  service_role key in server environments for admin-level operations.
- After backfilling, consider setting `owner_id` NOT NULL if every post should
  have an owner.
