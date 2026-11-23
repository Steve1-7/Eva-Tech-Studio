import type { Metadata } from 'next'
import './globals.css'
import { Cormorant_Garamond, DM_Sans, Syne } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GoogleAnalytics from '@/components/site/GoogleAnalytics'
import ScrollRevealObserver from '@/components/site/ScrollRevealObserver'

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
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Eva Tech Studio',
      url: 'https://www.eva-tech-studio.com',
      email: 'info@eva-tech-studio.com',
      telephone: '+27676283210',
      sameAs: [
        'https://www.linkedin.com/company/eva-tech-studio',
        'https://www.tiktok.com/@evatechstudio',
      ],
    },
    {
      '@type': 'LocalBusiness',
      name: 'Eva Tech Studio',
      url: 'https://www.eva-tech-studio.com',
      email: 'info@eva-tech-studio.com',
      telephone: '+27676283210',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Johannesburg',
        addressCountry: 'ZA',
      },
      areaServed: 'Worldwide',
      openingHours: 'Mo-Fr 08:00-18:00',
    },
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <GoogleAnalytics />
        <ScrollRevealObserver />
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
