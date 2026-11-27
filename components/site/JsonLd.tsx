import { canonicalUrl } from '@/lib/metadata'

type JsonLdProps = { data: Record<string, unknown> }

export function JsonLd({ data }: JsonLdProps) {
  const serialized = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialized }} />
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; path: string }>
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: canonicalUrl(item.path),
        })),
      }}
    />
  )
}
