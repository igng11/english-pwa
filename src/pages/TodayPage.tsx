import type { Level, Reading, ReadingResult } from '../types'
import { countWords } from '../data/readings'

export function TodayPage({ reading, level, result, onOpen }: { reading: Reading; level: Level; result?: ReadingResult; onOpen: () => void }) {
  return (
    <main className="today-page page-enter">
      <section className="today-heading"><div><div className="eyebrow">Today’s reading</div><h1>A quiet moment for English.</h1></div><p>Your recommended level is <strong>{level}</strong>. Read at your pace; definitions are one tap away.</p></section>
      <article className="featured-reading">
        <div className="feature-number">{reading.level.replace('.', '·')}</div>
        <div className="feature-content">
          <div className="card-meta"><span className="level-pill">{reading.level}</span><span>{reading.topic}</span></div>
          <h2>{reading.title}</h2>
          <p>{reading.text.split('\n\n')[0]}</p>
          <div className="reading-facts"><span><strong>{reading.estimatedMinutes}</strong> minutes</span><span><strong>{countWords(reading.text)}</strong> words</span><span><strong>{reading.questions.length}</strong> questions</span></div>
          <button className="primary-button" onClick={onOpen}>{result ? 'Read again' : 'Start reading'} <span>→</span></button>
        </div>
      </article>
      <section className="today-details">
        <div><span className="detail-label">Words to notice</span><p>{reading.targetVocabulary.join(', ')}</p></div>
        <div><span className="detail-label">Grammar you’ll meet</span><p>{reading.grammar.map((item) => item.replaceAll('-', ' ')).join(', ')}</p></div>
        {result && <div><span className="detail-label">Last result</span><p>{result.percentage}% comprehension</p></div>}
      </section>
    </main>
  )
}
