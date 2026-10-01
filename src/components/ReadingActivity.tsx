import { useMemo, useState } from 'react'
import type { ActivityEntry } from '../types'

const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function localDateKey(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.slice(0, 10)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function ReadingActivity({ activity }: { activity: ActivityEntry[] }) {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(() => localDateKey(new Date().toISOString()))
  const counts = useMemo(() => {
    const next = new Map<string, number>()
    activity.filter((entry) => entry.kind === 'reading').forEach((entry) => {
      const day = entry.localDate ?? localDateKey(entry.date)
      next.set(day, (next.get(day) ?? 0) + 1)
    })
    return next
  }, [activity])
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const leading = (month.getDay() + 6) % 7
  const selectedCount = counts.get(selectedDate) ?? 0
  const selectedLabel = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(new Date(`${selectedDate}T12:00:00`))

  function moveMonth(offset: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  }

  return (
    <section className="progress-section activity-section" aria-labelledby="activity-title">
      <div className="section-title"><h2 id="activity-title">Reading activity</h2><span>Completed readings</span></div>
      <div className="calendar-toolbar">
        <button type="button" aria-label="Previous month" onClick={() => moveMonth(-1)}>←</button>
        <strong>{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(month)}</strong>
        <button type="button" aria-label="Next month" onClick={() => moveMonth(1)}>→</button>
      </div>
      <div className="activity-calendar" aria-label={`Reading activity for ${monthKey(month)}`}>
        {weekdays.map((day) => <span className="calendar-weekday" key={day}>{day}</span>)}
        {Array.from({ length: leading }, (_, index) => <span key={`empty-${index}`} />)}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1
          const key = `${monthKey(month)}-${String(day).padStart(2, '0')}`
          const count = counts.get(key) ?? 0
          const intensity = count >= 3 ? 3 : count
          return <button type="button" className={`calendar-day activity-${intensity}${selectedDate === key ? ' selected' : ''}`} key={key} onClick={() => setSelectedDate(key)} aria-label={`${key}: ${count} ${count === 1 ? 'reading' : 'readings'}`}><span>{day}</span>{count > 0 && <strong>{count}</strong>}</button>
        })}
      </div>
      <p className="activity-detail" aria-live="polite">{selectedLabel} — {selectedCount} {selectedCount === 1 ? 'reading' : 'readings'}</p>
      <div className="activity-legend" aria-label="Activity scale"><span><i className="activity-0" />0</span><span><i className="activity-1" />1</span><span><i className="activity-2" />2</span><span><i className="activity-3" />3+</span></div>
    </section>
  )
}
