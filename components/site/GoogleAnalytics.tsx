import Script from 'next/script'

export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  if (!measurementId) return null
  if (!/^G-[A-Z0-9]+$/.test(measurementId)) {
    console.error('[ANALYTICS] NEXT_PUBLIC_GA_MEASUREMENT_ID must be a valid GA4 measurement ID.')
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${measurementId}');`}
      </Script>
    </>
  )
}
