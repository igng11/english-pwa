import { useEffect, useState } from 'react'

export function AppHeader() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && matchMedia('(prefers-color-scheme: dark)').matches))
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])
  return (
    <header className="app-header">
      <div className="brand" aria-label="Steadily home"><span className="brand-mark">S</span><span>Steadily</span></div>
      <button className="icon-button" onClick={() => setDark((value) => !value)} aria-label={dark ? 'Use light mode' : 'Use dark mode'} title={dark ? 'Use light mode' : 'Use dark mode'}>
        {dark ? '☀' : '☾'}
      </button>
    </header>
  )
}
