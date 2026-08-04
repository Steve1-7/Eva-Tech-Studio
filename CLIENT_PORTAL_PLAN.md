# Client Portal Architecture & Launch Plan

## Overview
The client portal is built as a secure, client-only experience for project status, marketing analytics, blog management, and support.

## Current implementation
- `app/client-portal/page.tsx`: client portal landing page with a preview and login wrapper.
- `components/ClientPortal/PortalWrapper.tsx`: client-side auth state loader.
- `components/ClientPortal/LoginForm.tsx`: Supabase magic-link login form.
- `app/auth/callback/page.tsx`: magic-link callback handler.
- `components/ClientPortal/Dashboard.tsx`: preview dashboard with metrics, campaign cards, and blog post management UI.

## Launch scope
### Phase 1: Under development / early access
- Secure login via Supabase magic link
- Dashboard preview content for active clients
- Contact link / request access CTA from portal pages
- Client metrics and campaign insights stubbed in UI

### Phase 2: Production-ready portal
- Enforce full auth for `/client-portal`
- Real client-specific data from Supabase by authenticated user
- Add role-based access if needed (client, manager, admin)
- Add live support form / message center
- Add true blog post editor or private update workflow
- Add reporting export (PDF / CSV)

## Auth plan
1. Use Supabase auth magic link for client access.
2. Store session in Supabase client.
3. Protect API routes with `lib/auth.ts` and `lib/rbac.ts`.
4. Render portal pages client-side with `PortalWrapper`.

## Recommended next steps
- Add server-side session validation for `/client-portal` page render.
- Add a centralized `client_portal_users` table to link client metadata.
- Add dedicated protected APIs for metrics, blog drafts, and support tickets.
- Add a `request access` form on the homepage portal preview.
