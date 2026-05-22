'use client'

import { ElfsightWidget } from 'react-elfsight-widget'

const WIDGET_ID = '152a6634-438f-4d16-ba16-b37a5e4faf1b'

export default function GoogleReviews() {
  return (
    <div className="google-reviews-widget w-full min-h-[360px]">
      <ElfsightWidget
        widgetId={WIDGET_ID}
        lazy="in-viewport"
        className="w-full"
      />
    </div>
  )
}
