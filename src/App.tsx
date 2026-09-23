import { useMemo, useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { ComprehensionTest } from './components/ComprehensionTest'
import { Navigation } from './components/Navigation'
import { Reader } from './components/Reader'
import { ResultView } from './components/ResultView'
import { readings, countWords } from './data/readings'
import { useAppData } from './hooks/useAppData'
import { ProgressPage } from './pages/ProgressPage'
import { ReadPage } from './pages/ReadPage'
import { TodayPage } from './pages/TodayPage'
import { WordsPage } from './pages/WordsPage'
import type { Reading, View } from './types'

type Overlay = 'reader' | 'test' | 'result' | null

export default function App() {
  const data = useAppData()
  const [view, setView] = useState<View>('today')
  const [activeReading, setActiveReading] = useState<Reading | null>(null)
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [latestScore, setLatestScore] = useState(0)
  const todayReading = useMemo(() => {
    const levelReadings = readings.filter((reading) => reading.level === data.recommendedLevel)
    const incompleteReading = levelReadings.find((reading) => !data.completedIds.has(reading.id))
    if (incompleteReading) return incompleteReading

    const resultByReading = new Map(data.results.map((result) => [result.readingId, result]))
    return [...levelReadings].sort((first, second) => {
      const firstCompletedAt = resultByReading.get(first.id)?.date ?? ''
      const secondCompletedAt = resultByReading.get(second.id)?.date ?? ''
      return firstCompletedAt.localeCompare(secondCompletedAt)
    })[0] ?? readings[0]
  }, [data.recommendedLevel, data.completedIds, data.results])

  function openReading(reading: Reading) {
    setActiveReading(reading)
    setOverlay('reader')
    window.scrollTo({ top: 0 })
  }

  async function finishTest(answers: number[]) {
    if (!activeReading) return
    const correct = answers.filter((answer, index) => answer === activeReading.questions[index].correctIndex).length
    const percentage = Math.round(correct / activeReading.questions.length * 100)
    setLatestScore(percentage)
    await data.saveResult({ id: activeReading.id, readingId: activeReading.id, level: activeReading.level, date: new Date().toISOString(), correct, total: activeReading.questions.length, percentage, wordCount: countWords(activeReading.text) })
    setOverlay('result')
    window.scrollTo({ top: 0 })
  }

  if (!data.ready) return <div className="loading-screen"><div className="brand-mark">S</div><span>Opening your library…</span></div>
  if (overlay === 'reader' && activeReading) return <Reader reading={activeReading} onClose={() => setOverlay(null)} onTest={() => { setOverlay('test'); window.scrollTo({ top: 0 }) }} onSaveTerm={data.saveTerm} />
  if (overlay === 'test' && activeReading) return <ComprehensionTest reading={activeReading} onBack={() => setOverlay('reader')} onComplete={finishTest} />
  if (overlay === 'result' && activeReading) return <ResultView reading={activeReading} score={latestScore} onDone={() => { setOverlay(null); setView('progress') }} onReadAgain={() => setOverlay('reader')} />

  return (
    <div className="app-shell">
      <AppHeader />
      <div className="desktop-layout">
        <Navigation current={view} onChange={(next) => { setView(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
        <div className="page-wrap">
          {view === 'today' && <TodayPage reading={todayReading} level={data.recommendedLevel} result={data.results.find((item) => item.readingId === todayReading.id)} onOpen={() => openReading(todayReading)} />}
          {view === 'read' && <ReadPage results={data.results} onOpen={openReading} />}
          {view === 'words' && <WordsPage vocabulary={data.vocabulary} onStatus={data.setTermStatus} />}
          {view === 'progress' && <ProgressPage level={data.recommendedLevel} results={data.results} vocabulary={data.vocabulary} />}
        </div>
      </div>
    </div>
  )
}
