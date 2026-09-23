import { readings, countWords } from '../data/readings'
import type { Level, ReadingResult, VocabularyEntry } from '../types'
import { LEVELS } from '../utils/progression'

export function ProgressPage({ level, results, vocabulary }: { level: Level; results: ReadingResult[]; vocabulary: VocabularyEntry[] }) {
  const byLevel = LEVELS.map((item) => {
    const scores = results.filter((result) => result.level === item).map((result) => result.percentage)
    return { level: item, score: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0, count: scores.length }
  })
  const activeDays = new Set(results.map((result) => result.date.slice(0, 10))).size
  const wordsRead = results.reduce((sum, result) => sum + (result.wordCount || countWords(readings.find((item) => item.id === result.readingId)?.text ?? '')), 0)
  const known = vocabulary.filter((item) => !item.isPhrase && item.status === 'known').length
  const learning = vocabulary.filter((item) => !item.isPhrase && item.status !== 'known').length
  const phrases = vocabulary.filter((item) => item.isPhrase).length
  return (
    <main className="progress-page page-enter">
      <header className="page-heading"><div className="eyebrow">Your progress</div><h1>Small steps, clearly seen.</h1><p>Your data stays on this device and grows with every reading.</p></header>
      <section className="level-hero"><span>Current comfortable level</span><strong>{level}</strong><p>{results.length ? 'Recommended from your recent comprehension results.' : 'Complete your first reading to begin measuring progress.'}</p></section>
      <section className="progress-section"><div className="section-title"><h2>Comprehension by level</h2><span>Average score</span></div><div className="level-bars">{byLevel.map((item) => <div className="level-bar" key={item.level}><span>{item.level}</span><div><i style={{ width: `${item.score}%` }} /></div><strong>{item.count ? `${item.score}%` : '—'}</strong></div>)}</div></section>
      <section className="stat-grid"><article><span>Readings</span><strong>{results.length}</strong><small>completed</small></article><article><span>Words read</span><strong>{wordsRead.toLocaleString()}</strong><small>across all texts</small></article><article><span>Sessions</span><strong>{results.length}</strong><small>reading sessions</small></article><article><span>Active days</span><strong>{activeDays}</strong><small>days with a result</small></article></section>
      <section className="progress-section"><div className="section-title"><h2>Vocabulary</h2></div><div className="vocab-summary"><div><strong>{known}</strong><span>Known</span></div><div><strong>{learning}</strong><span>Learning</span></div><div><strong>{phrases}</strong><span>Saved phrases</span></div></div></section>
    </main>
  )
}
