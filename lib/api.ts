export function apiUrl(path: string) {
  if (typeof window === 'undefined') {
    return `${process.env.API_BASE || ''}${path}`
  }
  return `${process.env.NEXT_PUBLIC_API_BASE || ''}${path}`
}

export function apiFetch(path: string, init?: RequestInit) {
  const finalInit: RequestInit = Object.assign({ credentials: 'include' }, init || {})
  return fetch(apiUrl(path), finalInit)
}

export default apiFetch
