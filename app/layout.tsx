import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PremiumCursor from '@/components/PremiumCursor'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'
import GrainOverlay from '@/components/GrainOverlay'
import AIChatbot from '@/components/AIChatbot'
import SoundDesign from '@/components/SoundDesign'
import PageTransition from '@/components/PageTransition'

export const metadata: Metadata = {
  title: 'Eve-Tech-Studio — Growth-Driven Digital Agency',
  description: 'We architect digital ecosystems that compound your growth — from performance marketing to scalable tech infrastructure.',
  openGraph: { title:'Eve-Tech-Studio', description:'Stop leaving revenue on the table. Build your growth engine.', type:'website' },
  icons: { 
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <SmoothScrollProvider>
          <PremiumCursor />
          <GrainOverlay />
          <SoundDesign />
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
