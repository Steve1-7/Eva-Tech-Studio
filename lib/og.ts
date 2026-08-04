export function ogUrl(title = '', subtitle = '') {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://eva-tech-studio.com'
  const params = new URLSearchParams({ title: title.slice(0, 120), subtitle: subtitle.slice(0, 200) })
  return `${base.replace(/\/$/, '')}/api/og?${params.toString()}`
}
