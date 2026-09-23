import type { Reading } from '../types'

export function ResultView({ reading, score, onDone, onReadAgain }: { reading: Reading; score: number; onDone: () => void; onReadAgain: () => void }) {
  const correct = Math.round(score * reading.questions.length / 100)
  return (
    <main className="result-page page-enter">
      <div className="score-ring" style={{ '--score': `${score * 3.6}deg` } as React.CSSProperties}><div><strong>{score}%</strong><span>comprehension</span></div></div>
      <div className="eyebrow">Reading complete</div>
      <h1>{score >= 80 ? 'You understood the main ideas.' : score >= 60 ? 'A solid start.' : 'Take another look.'}</h1>
      <p>You answered {correct} of {reading.questions.length} questions correctly. Your result has been saved on this device.</p>
      <div className="result-actions"><button className="primary-button" onClick={onDone}>Continue</button><button className="secondary-button" onClick={onReadAgain}>Read again</button></div>
    </main>
  )
}
