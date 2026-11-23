'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    let savedTheme: string | null = null
    try {
      savedTheme = window.localStorage.getItem('ets-theme')
    } catch (error) {
      console.warn('[THEME] Could not read the saved theme preference.', error)
    }
    const nextDark = savedTheme === 'dark'
      || (savedTheme === null && document.documentElement.classList.contains('dark-theme'))
    document.documentElement.classList.toggle('dark-theme', nextDark)
    setDark(nextDark)
    const syncTheme = (event: Event) => {
      if (!(event instanceof CustomEvent)) return
      const isDark = event.detail === true
      document.documentElement.classList.toggle('dark-theme', isDark)
      setDark(isDark)
    }
    const syncStorage = (event: StorageEvent) => {
      if (event.key !== 'ets-theme') return
      const isDark = event.newValue === 'dark'
      document.documentElement.classList.toggle('dark-theme', isDark)
      setDark(isDark)
    }
    window.addEventListener('ets-theme-change', syncTheme)
    window.addEventListener('storage', syncStorage)
    return () => {
      window.removeEventListener('ets-theme-change', syncTheme)
      window.removeEventListener('storage', syncStorage)
    }
  }, [])

  function toggleTheme() {
    const nextDark = !dark
    document.documentElement.classList.toggle('dark-theme', nextDark)
    try {
      window.localStorage.setItem('ets-theme', nextDark ? 'dark' : 'light')
    } catch (error) {
      console.warn('[THEME] Could not persist the theme preference.', error)
    }
    window.dispatchEvent(new CustomEvent('ets-theme-change', { detail: nextDark }))
    setDark(nextDark)
  }

  return (
    <button
      type="button"
      className="ets-theme-toggle"
      onClick={toggleTheme}
      aria-pressed={dark}
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
    >
      <span aria-hidden="true">{dark ? '☀' : '◐'}</span>
      <span className="hidden lg:inline">{dark ? 'Light' : 'Dark'}</span>
    </button>
  )
}
