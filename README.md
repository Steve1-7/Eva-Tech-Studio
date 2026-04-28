# Peace of Pie — Digital Agency Website

A full Next.js 14 website for Peace of Pie, a growth-driven digital agency.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Fonts**: Cormorant Garamond, DM Sans, Syne (via next/font/google)
- **Language**: TypeScript
- **Animations**: CSS keyframes + Tailwind utilities

## Project Structure

```
peaceofpie/
├── app/
│   ├── layout.tsx          # Root layout (fonts, Navbar, Footer)
│   ├── globals.css         # Global styles + custom utilities
│   ├── page.tsx            # Home page
│   ├── services/
│   │   └── page.tsx        # Services page
│   ├── about/
│   │   └── page.tsx        # About Us page
│   ├── work/
│   │   └── page.tsx        # Case Studies page
│   ├── pricing/
│   │   └── page.tsx        # Pricing page
│   └── contact/
│       ├── page.tsx        # Contact page (re-export)
│       └── ContactForm.tsx # Contact form (client component)
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
Edit `tailwind.config.ts` to change the brand palette:
- `cream` — page background
- `navy` — dark sections + text
- `sage` — primary accent (green)
- `gold` — CTA accent

### Content
All page content lives directly in each `app/*/page.tsx` file as data arrays at the top — easy to update without touching layout code.

### Fonts
Fonts are loaded via `next/font/google` in `app/layout.tsx`. Swap them out there.

### Contact Form
The contact form in `app/contact/ContactForm.tsx` currently shows a success state on submit.
Hook it up to your preferred backend:
- **Resend** for email
- **Formspree** for a no-backend solution
- **Supabase** for storing submissions

## Pages

| Route | Page |
|-------|------|
| `/` | Home (hero, services preview, process, testimonials, CTA) |
| `/services` | Full services breakdown |
| `/about` | Mission, values, team |
| `/work` | Case studies / portfolio |
| `/pricing` | Pricing plans + one-time projects |
| `/contact` | Contact form + booking CTA |
