import { useState } from 'react'
import { BackupData } from '../components/BackupData'
import { ReadingActivity } from '../components/ReadingActivity'
import { VoiceSettings } from '../components/VoiceSettings'
import { countWords, readings } from '../data/readings'
import type { SpeechController } from '../hooks/useSpeechSynthesis'
import type { ActivityEntry, Level, PersistedData, ReadingResult, VocabularyEntry } from '../types'
import { getStrongReadingStreak, LEVELS } from '../utils/progression'

function localDateKey(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.slice(0, 10)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function weekRange() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return { start: localDateKey(start.toISOString()), end: localDateKey(end.toISOString()) }
}

function readingForActivity(entry: ActivityEntry) {
  return readings.find((reading) => reading.id === entry.readingId || entry.id === `reading-${reading.id}`)
}

export function ProgressPage({ level, results, vocabulary, activity, speech, getData, onRestore, onOpenWords }: { level: Level; results: ReadingResult[]; vocabulary: VocabularyEntry[]; activity: ActivityEntry[]; speech: SpeechController; getData: () => PersistedData; onRestore: (data: PersistedData) => Promise<void>; onOpenWords: () => void }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const currentIndex = LEVELS.indexOf(level)
  const nextLevel = LEVELS[currentIndex + 1]
  const strongReadingStreak = getStrongReadingStreak(results, level)
  const byLevel = LEVELS.map((item) => {
    const scores = results.filter((result) => result.level === item).map((result) => result.percentage)
    return { level: item, score: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0, count: scores.length }
  })
  const { start: weekStart, end: weekEnd } = weekRange()
  const weekActivity = activity.filter((entry) => {
    if (entry.kind !== 'reading') return false
    const day = entry.localDate ?? localDateKey(entry.date)
    return day >= weekStart && day <= weekEnd
  })
  const weekResults = results.filter((result) => {
    const day = localDateKey(result.date)
    return day >= weekStart && day <= weekEnd
  })
  const weekComprehension = weekResults.length
    ? Math.round(weekResults.reduce((sum, result) => sum + result.percentage, 0) / weekResults.length)
    : null
  const resultByReading = new Map(results.map((result) => [result.readingId, result]))
  const weekWords = weekActivity.reduce((sum, entry) => {
    const reading = readingForActivity(entry)
    if (!reading) return sum
    return sum + (resultByReading.get(reading.id)?.wordCount || countWords(reading.text))
  }, 0)
  const weekDays = new Set(weekActivity.map((entry) => entry.localDate ?? localDateKey(entry.date))).size
  const known = vocabulary.filter((entry) => !entry.isPhrase && entry.status === 'known').length
  const learning = vocabulary.filter((entry) => !entry.isPhrase && entry.status !== 'known').length
  const phrases = vocabulary.filter((entry) => entry.isPhrase).length

  if (settingsOpen) return (
    <main className="progress-page progress-settings-page page-enter">
      <header className="settings-header">
        <button className="back-button" type="button" onClick={() => { speech.cancel(); setSettingsOpen(false); window.scrollTo({ top: 0 }) }}>← Progress</button>
        <h1>Settings</h1>
        <p>Pronunciation and local data.</p>
      </header>
      <VoiceSettings speech={speech} title="Pronunciation" />
      <BackupData getData={getData} onRestore={onRestore} title="Data" />
    </main>
  )

  return (
    <main className="progress-page progress-dashboard page-enter">
      <header className="progress-header">
        <h1>Progress</h1>
        <button className="settings-button" type="button" onClick={() => { setSettingsOpen(true); window.scrollTo({ top: 0 }) }} aria-label="Open settings"><span aria-hidden="true">⚙</span> Settings</button>
      </header>

      <section className="level-overview" aria-labelledby="current-level-title">
        <div className="current-level">
          <span id="current-level-title">Current reading level</span>
          <strong>{level}</strong>
          <small>Based on your comprehension results</small>
        </div>
        <div className="level-advance">
          {nextLevel ? <>
            <span>Working toward <strong>{nextLevel}</strong></span>
            <div className="streak-dots" aria-label={`${strongReadingStreak} of 3 strong readings`}>
              {[0, 1, 2].map((index) => <i className={index < strongReadingStreak ? 'filled' : ''} key={index} />)}
            </div>
            <small>{strongReadingStreak} of 3 strong readings</small>
          </> : <>
            <span>Current corpus milestone</span>
            <strong className="future-goal">B1.1</strong>
            <small>More B1 levels can be added later</small>
          </>}
        </div>
      </section>

      <div className="progress-priority-grid">
        <section className="weekly-summary" aria-labelledby="week-title">
          <h2 id="week-title">This week</h2>
          <div>
            <p><strong>{weekActivity.length}</strong><span>readings</span></p>
            <p><strong>{weekDays}</strong><span>active days</span></p>
            <p><strong>{weekComprehension === null ? '—' : `${weekComprehension}%`}</strong><span>comprehension</span></p>
            <p><strong>{weekWords.toLocaleString('en-US')}</strong><span>words read</span></p>
          </div>
        </section>

        <section className="path-section" aria-labelledby="path-title">
          <div className="section-title"><h2 id="path-title">Your path</h2><span>Reading levels</span></div>
          <ol className="level-path">
            {LEVELS.map((item, index) => {
              const state = index < currentIndex ? 'reached' : index === currentIndex ? 'current' : 'pending'
              return <li className={state} aria-current={state === 'current' ? 'step' : undefined} key={item}><span>{state === 'reached' ? '✓' : state === 'current' ? '●' : '○'}</span><strong>{item}</strong></li>
            })}
          </ol>
          <p className="b1-goal">B1 path <span aria-hidden="true">→</span><small>Continues beyond B1.1</small></p>
        </section>
      </div>

      <ReadingActivity activity={activity} />

      <div className="progress-secondary-grid">
        <section className="progress-section comprehension-section" aria-labelledby="comprehension-title">
          <div className="section-title"><h2 id="comprehension-title">Comprehension by level</h2><span>Average</span></div>
          <div className="level-bars">{byLevel.map((item) => <div className="level-bar" key={item.level}><span>{item.level}</span><div><i style={{ width: `${item.score}%` }} /></div><strong>{item.count ? `${item.score}%` : '—'}</strong></div>)}</div>
        </section>

        <button className="progress-vocabulary" type="button" onClick={onOpenWords} aria-label="Open personal vocabulary">
          <span><strong>Vocabulary</strong><small>{learning} learning · {known} known{phrases ? ` · ${phrases} ${phrases === 1 ? 'phrase' : 'phrases'}` : ''}</small></span>
          <i aria-hidden="true">→</i>
        </button>
      </div>
    </main>
  )
}
