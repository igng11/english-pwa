import type { Reading, ReadingResult } from '../types'

export function ReadingCard({ reading, result, onOpen }: { reading: Reading; result?: ReadingResult; onOpen: () => void }) {
  return (
    <article className="reading-card" onClick={onOpen} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onOpen() }}>
      <div className="card-meta"><span className="level-pill">{reading.level}</span><span>{reading.topic}</span></div>
      <h3>{reading.title}</h3>
      <div className="card-footer"><span>{reading.estimatedMinutes} min read</span><span className={result ? 'complete' : ''}>{result ? `${result.percentage}% comprehension` : 'Not completed'}</span></div>
    </article>
  )
}
