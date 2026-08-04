import type { Metadata } from 'next'
import './globals.css'
import dynamic from 'next/dynamic'
import { Cormorant_Garamond, DM_Sans, Syne } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'
import GrainOverlay from '@/components/GrainOverlay'
import PageTransition from '@/components/PageTransition'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-dm',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-syne',
})

const PremiumCursor = dynamic(() => import('@/components/PremiumCursor'), { ssr: false })
const AIChatbot = dynamic(() => import('@/components/AIChatbot'), { ssr: false })
// const SoundDesign = dynamic(() => import('@/components/SoundDesign'), { ssr: false })

export const metadata: Metadata = {
  title: 'Eva-Tech-Studio — Growth-Driven Digital Agency',
  description: 'We architect digital ecosystems that compound your growth — from performance marketing to scalable tech infrastructure.',
  openGraph: { title:'Eva-Tech-Studio', description:'Stop leaving revenue on the table. Build your growth engine.', type:'website' },
  verification: {
    google: "jBzyTiwinkB8xrmVTBumdvCYjXIciqwlEmKZXwt3UrI",
  },
  icons: { 
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${syne.variable}`}>
      <head>
        <link rel="preconnect" href="https://elfsightcdn.com" />
        <link rel="dns-prefetch" href="https://static.elfsight.com" />
      </head>
      <body className="antialiased">
        <SmoothScrollProvider>
          <PremiumCursor />
          <GrainOverlay />
          {/* <SoundDesign /> */}
          <Navbar />
          <PageTransition>
            <main>{children}</main>
          </PageTransition>
          <Footer />
          <AIChatbot />
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
