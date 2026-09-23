import type { View } from '../types'

const items: { id: View; label: string; icon: string }[] = [
  { id: 'today', label: 'Today', icon: '◉' },
  { id: 'read', label: 'Read', icon: '▤' },
  { id: 'words', label: 'Words', icon: 'Aa' },
  { id: 'progress', label: 'Progress', icon: '↗' },
]

export function Navigation({ current, onChange }: { current: View; onChange: (view: View) => void }) {
  return (
    <nav className="navigation" aria-label="Main navigation">
      {items.map((item) => <button key={item.id} className={current === item.id ? 'active' : ''} onClick={() => onChange(item.id)} aria-current={current === item.id ? 'page' : undefined}><span>{item.icon}</span>{item.label}</button>)}
    </nav>
  )
}
