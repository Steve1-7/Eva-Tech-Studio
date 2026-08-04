# Deployment Checklist

## Build & Runtime
- [ ] Run `npm run build` successfully in production mode
- [ ] Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in deployment environment
- [ ] Confirm `APP_URL` / canonical host is configured consistently
- [ ] Confirm no missing environment variables for AI endpoints

## SEO & Pages
- [ ] Verify sitemap routes are accessible: `/api/sitemap`, `/api/sitemap/sitemap-pages.xml`, `/api/sitemap/sitemap-images.xml`, `/api/sitemap/sitemap-videos.xml`
- [ ] Check `robots.txt` content and site indexability
- [ ] Confirm dynamic OG image endpoint works for key pages
- [ ] Validate blog routes and tags are accessible

## Client Portal
- [ ] Verify `/client-portal` page loads with completed auth flow
- [ ] Confirm `/auth/callback` redirects correctly after magic link
- [ ] Confirm the portal login and dashboard preview render client-side only

## Monitoring & Logging
- [ ] Ensure runtime logs are available for AI route errors
- [ ] Confirm Supabase production errors are monitored
- [ ] Add Sentry or similar if needed for runtime exception capture

## Final QA
- [ ] Responsiveness checked on desktop/mobile/tablet
- [ ] Accessibility checks for form labels and contrast
- [ ] Broken links scan across key pages
- [ ] Homepage AI, trust, and portal blocks reviewed
- [ ] Performance check on image loading and font usage
