import type { Metadata } from 'next'
import './globals.css'
import { Cormorant_Garamond, DM_Sans, Syne } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GoogleAnalytics from '@/components/site/GoogleAnalytics'
import ScrollRevealObserver from '@/components/site/ScrollRevealObserver'
import FloatingContactActions from '@/components/site/FloatingContactActions'
import MarketSuggestionBanner from '@/components/site/MarketSuggestionBanner'
import { JsonLd } from '@/components/site/JsonLd'
import { canonicalUrl } from '@/lib/metadata'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-dm',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-syne',
})

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Eva Tech Studio',
  url: canonicalUrl('/'),
  logo: canonicalUrl('/logo5.webp'),
  email: 'info@eva-tech-studio.com',
  sameAs: [
    'https://www.linkedin.com/company/eva-tech-studio',
    'https://www.tiktok.com/@evatechstudio',
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.eva-tech-studio.com'),
  title: {
    default: 'Eva Tech Studio | Senior Engineering for Digital Products',
    template: '%s | Eva Tech Studio',
  },
  description: 'A senior, boutique engineering studio building websites, apps, custom software, chatbots, and automation for teams worldwide.',
  openGraph: {
    title: 'Eva Tech Studio | Senior Engineering for Digital Products',
    description: 'Websites, apps, and software designed and built by a senior engineering studio in Johannesburg, serving clients globally.',
    type: 'website',
    url: 'https://www.eva-tech-studio.com',
    siteName: 'Eva Tech Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eva Tech Studio | Senior Engineering for Digital Products',
    description: 'Websites, apps, and software designed and built by a senior engineering studio in Johannesburg.',
  },
  verification: {
    google: 'jBzyTiwinkB8xrmVTBumdvCYjXIciqwlEmKZXwt3UrI',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${syne.variable}`}>
      <body>
        <a className="ets-skip-link" href="#main-content">Skip to content</a>
        <JsonLd data={organizationSchema} />
        <GoogleAnalytics />
        <ScrollRevealObserver />
        <Navbar />
        <MarketSuggestionBanner />
        <main id="main-content">{children}</main>
        <Footer />
        <FloatingContactActions />
      </body>
    </html>
  )
}
