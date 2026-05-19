export function apiUrl(path: string) {
  if (typeof window === 'undefined') {
    return `${process.env.API_BASE || ''}${path}`
  }
  return `${process.env.NEXT_PUBLIC_API_BASE || ''}${path}`
}

export function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), init)
}

export default apiFetch
