# Eva Tech Studio

A Next.js 14 website for Eva Tech Studio, a senior boutique engineering studio based in Johannesburg and serving clients globally.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Fonts**: Cormorant Garamond, DM Sans, Syne (via next/font/google)
- **Language**: TypeScript
- **Animations**: CSS motion, intersection-based reveals, and Tailwind utilities

## Project Structure

```
eva-tech-studio/
├── app/
│   ├── layout.tsx          # Metadata, structured data, navigation, footer
│   ├── globals.css         # Editorial palette, responsive styles, dark mode
│   ├── page.tsx            # Homepage and studio sections
│   ├── services/           # Service index and detail pages
│   ├── case-studies/       # Public project portfolio
│   ├── blog/               # Jargon Buster articles
│   ├── faq/                # FAQ page and structured data
│   ├── tools/              # Free project-brief builder
│   ├── pricing/            # Launch offer pricing
│   └── contact/            # Project brief form
├── components/site/        # Theme, demos, pricing, and interactive UI
├── lib/siteContent.ts      # Service, project, FAQ, and stack content
├── lib/blogContent.ts      # Jargon Buster article content
├── app/sitemap.ts          # XML sitemap
├── app/robots.ts           # Crawler rules
├── components/
│   ├── Navbar.tsx          # Sticky, scroll-aware nav with mobile drawer
│   ├── Footer.tsx          # Consistent footer across all pages
│   ├── Button.tsx          # Multi-variant button component
│   └── SectionLabel.tsx    # Reusable section label with line
├── tailwind.config.ts      # Custom colors, fonts, animations
├── next.config.js
├── tsconfig.json
└── package.json
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production

```bash
npm run build
npm start
```

## Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deploys.

## Customisation

### Colors
The editorial site palette and dark-mode variables live in `app/globals.css` under the `--ets-*` tokens. Legacy Tailwind palette values remain available to existing admin and utility screens.

### Content
Service, project, FAQ, and technology-stack content lives in `lib/siteContent.ts`. Jargon Buster articles live in `lib/blogContent.ts`. Page-specific copy remains alongside each route.

### Fonts
Fonts are loaded via `next/font/google` in `app/layout.tsx`. Swap them out there.

### Contact Form
Project briefs are validated and sent through `app/api/contact/route.ts` using Resend. The API uses a honeypot and per-IP request limit; configure `RESEND_API_KEY` and `CONTACT_TO_EMAIL` in the deployment environment. Email delivery failures are reported rather than shown as successful submissions.

See [the Vercel deployment guide](./docs/deploy-guide.md) for environment variables, launch checks, and contact-form setup.

## Pages

| Route | Page |
|-------|------|
| `/` | Home (hero, services preview, process, testimonials, CTA) |
| `/services` | Full services breakdown |
| `/about` | Studio approach |
| `/work` | Redirect to case studies |
| `/case-studies` | Public project portfolio |
| `/pricing` | Service tiers and one-time items |
| `/contact` | Project brief form |
| `/faq` | FAQ accordion |
| `/tools` | Free project brief builder |
| `/blog` | Jargon Buster articles |
