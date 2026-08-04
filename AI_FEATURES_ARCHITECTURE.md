# AI Features Architecture

## Overview
The AI sub-system is designed around three main user-facing tools:
- `/ai-audit` — AI-powered site and marketing audit generation
- `/ai-quote` — AI-generated pricing and scope proposals
- `/ai-consultant` — structured project consulting guidance

## Frontend
- `app/ai/page.tsx` — AI hub landing page
- `app/ai-audit/page.tsx` — audit tool page and form UI
- `app/ai-quote/page.tsx` — quote generator page and form UI
- `app/ai-consultant/page.tsx` — project consultant page and form UI
- `components/AIAuditWidget.tsx`, `AIQuoteGenerator.tsx`, `AIProjectConsultant.tsx` — core UI components for request and result flows

## API routes
- `app/api/ai-audit/route.ts` — audit generation endpoint
- `app/api/ai-quote/route.ts` — quote generation endpoint
- `app/api/ai-project-consultant/route.ts` — consultant recommendation endpoint

## Shared AI helpers
- `lib/ai-config.ts` — Gemini helper, retry/fallback logic, prompt construction
- `lib/api.ts` — fetch wrapper for internal API calls

## Auth and persistence
- `lib/supabase.ts` — Supabase client and stubbed build-safe behavior
- `app/api/ai-project-consultant/route.ts` persists structured consultant requests to Supabase where available

## Architecture notes
1. Client-side pages call internal API routes with `fetch` / `apiFetch`.
2. API routes use a shared AI config and can fall back safely when Gemini is unavailable.
3. Sensitive keys and production-only behavior are handled via environment variables.
4. The AI tools are isolated from the main site content and can be extended with new endpoints without changing page layout.

## Recommended next work
- Add user-specific project history and audit report saving to Supabase.
- Add usage tracking for AI tools and request insights.
- Add server-side validation for AI input payloads.
- Add rate limiting per user/session for AI endpoints.
