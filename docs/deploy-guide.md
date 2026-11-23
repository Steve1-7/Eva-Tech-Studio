# Eva Tech Studio deployment guide

## 1. Before deployment

- Confirm the custom domain `www.eva-tech-studio.com` is attached to the Vercel project. Redirect the apex domain to `www` so it matches the canonical URL.
- Confirm the current `pricing_plans` rows in Supabase. The public pricing page uses those rows when available and uses the configured defaults otherwise.
- Review the published project descriptions and replace the pending uptime, load-time, and retention metrics when verified data is available. Client testimonials remain unpublished until approved.
- Confirm that `contact@eva-tech-studio.com` is an approved sender in Resend.

## 2. Configure Vercel

Import the repository into Vercel and use the detected Next.js settings. The project uses Next.js 14 and npm.

Set these Production environment variables:

| Variable | Value / purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://www.eva-tech-studio.com` |
| `NEXT_PUBLIC_APP_URL` | `https://www.eva-tech-studio.com` |
| `RESEND_API_KEY` | Server-side Resend API key |
| `CONTACT_TO_EMAIL` | `info@eva-tech-studio.com` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional GA4 ID in `G-...` format |

Add the same values to Preview if you want working contact submissions and analytics on preview deployments. Keep private keys server-only; never add a `NEXT_PUBLIC_` prefix to them.

The existing application also uses Supabase and other optional integrations. Copy only the environment variables for features you intend to run from `.env.example`, and configure their existing credentials and migrations as documented by those features. Do not enable WhatsApp sending until its separate consent, template, webhook, and credential requirements are satisfied.

## 3. Verify pricing

The public pricing UI applies a 40% reduction (`old price × 0.60`, rounded to the nearest R50) to the current monthly and one-time rates.

Configured fallback monthly tiers:

| Tier | Was | Now |
| --- | ---: | ---: |
| Starter | R5,000 | R3,000 |
| Business | R10,000 | R6,000 |
| Custom | R17,500 | R10,500 |

The same three monthly tiers are shown for each of the seven engineering services and for monthly maintenance, as confirmed for this redesign. The configured one-time prices are Website Build R5,000 → R3,000, Brand Identity R6,000 → R3,600, Shopify Store R7,500 → R4,500, CRM Setup R4,250 → R2,550, and SEO Audit R2,250 → R1,350.

If Supabase pricing rows differ from these configured defaults, the live Supabase rates take precedence. Check the pricing page after deployment and ensure the production rate card is the intended one.

## 4. Contact delivery and spam controls

The project brief form sends through `/api/contact` to `CONTACT_TO_EMAIL`. The endpoint validates required fields, uses a hidden honeypot, and applies a basic in-memory per-IP request limit. The limit is per running server instance; for stronger shared limits across serverless instances, add a shared rate-limit service or Vercel Firewall rules.

After deployment:

1. Verify the sender domain and `contact@eva-tech-studio.com` in Resend.
2. Submit a test brief and confirm delivery to `info@eva-tech-studio.com`.
3. Confirm that invalid required fields are rejected and a provider failure is not displayed as a successful send.
4. Confirm the honeypot is not visible or keyboard-focusable.

## 5. Build and deploy

Run locally before pushing:

```powershell
npm ci
npm run test -- --run
npm run build
```

Push the branch and inspect its Vercel Preview deployment. After review, promote or merge to the production branch. Vercel builds and deploys automatically.

## 6. Post-deployment checks

- Open `/`, `/services`, all seven service pages, `/case-studies`, `/pricing`, `/blog`, `/faq`, `/tools`, and `/contact` on desktop and mobile.
- Test the mobile navigation, theme toggle, accordions, brief-builder copy action, chatbot demo, and simulated trading dashboard.
- Confirm the demos are visibly identified as scripted/sample experiences and do not imply live trading or guaranteed results.
- Check `/sitemap.xml` and `/robots.txt`, then validate structured data and canonical URLs in Google Search Console.
- Test keyboard navigation, visible focus, contrast in both themes, and reduced-motion behavior.
- Run Lighthouse on the production URL and review Core Web Vitals. A score of 90+ is a target, not a deployment guarantee; verify it against the deployed assets and analytics.
- Confirm the site displays “pending” for metrics that have not yet been verified; do not replace these with estimates presented as actual results.
