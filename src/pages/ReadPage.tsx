import { useMemo, useState } from 'react'
import { readings } from '../data/readings'
import type { Reading, ReadingResult } from '../types'
import { ReadingCard } from '../components/ReadingCard'

export function ReadPage({ results, onOpen }: { results: ReadingResult[]; onOpen: (reading: Reading) => void }) {
  const [level, setLevel] = useState('All')
  const [topic, setTopic] = useState('All')
  const [status, setStatus] = useState('All')
  const resultMap = useMemo(() => new Map(results.map((result) => [result.readingId, result])), [results])
  const filtered = readings.filter((reading) => (level === 'All' || reading.level === level) && (topic === 'All' || reading.topic === topic) && (status === 'All' || (status === 'Completed') === resultMap.has(reading.id)))
  return (
    <main className="library-page page-enter">
      <header className="page-heading"><div className="eyebrow">Reading library</div><h1>Choose your next text.</h1><p>Nothing is locked. Move up, revisit an easier level, or follow your curiosity.</p></header>
      <section className="filters" aria-label="Reading filters">
        <label>Level<select value={level} onChange={(event) => setLevel(event.target.value)}><option>All</option>{['A2.1', 'A2.2', 'A2.3', 'A2.4'].map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Topic<select value={topic} onChange={(event) => setTopic(event.target.value)}><option>All</option>{[...new Set(readings.map((item) => item.topic))].map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Completed</option><option>Not completed</option></select></label>
      </section>
      <div className="library-count">{filtered.length} {filtered.length === 1 ? 'reading' : 'readings'}</div>
      <section className="reading-grid">{filtered.map((reading) => <ReadingCard key={reading.id} reading={reading} result={resultMap.get(reading.id)} onOpen={() => onOpen(reading)} />)}</section>
      {!filtered.length && <div className="empty-state"><h2>No readings match.</h2><p>Try changing one of the filters.</p></div>}
    </main>
  )
}
