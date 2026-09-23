import { useState } from 'react'
import type { Reading } from '../types'

export function ComprehensionTest({ reading, onComplete, onBack }: { reading: Reading; onComplete: (answers: number[]) => void; onBack: () => void }) {
  const [answers, setAnswers] = useState<number[]>(Array(reading.questions.length).fill(-1))
  const complete = answers.every((answer) => answer >= 0)
  return (
    <main className="test-page page-enter">
      <button className="back-button" onClick={onBack}>← Back to reading</button>
      <div className="eyebrow">Comprehension check</div>
      <h1>{reading.title}</h1>
      <p className="test-intro">Choose the best answer. Everything you need is in the text.</p>
      <form onSubmit={(event) => { event.preventDefault(); if (complete) onComplete(answers) }}>
        {reading.questions.map((question, questionIndex) => (
          <fieldset key={question.question}>
            <legend><span>{String(questionIndex + 1).padStart(2, '0')}</span>{question.question}</legend>
            {question.options.map((option, optionIndex) => (
              <label className={answers[questionIndex] === optionIndex ? 'selected-option' : ''} key={option}>
                <input type="radio" name={`question-${questionIndex}`} checked={answers[questionIndex] === optionIndex} onChange={() => setAnswers((current) => current.map((answer, index) => index === questionIndex ? optionIndex : answer))} />
                <span>{option}</span>
              </label>
            ))}
          </fieldset>
        ))}
        <button className="primary-button wide" type="submit" disabled={!complete}>See my result</button>
      </form>
    </main>
  )
}
