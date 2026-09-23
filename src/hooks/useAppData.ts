import { useEffect, useMemo, useState } from 'react'
import { db } from '../services/db'
import type { Level, ReadingResult, VocabularyEntry, VocabularyStatus } from '../types'
import { getRecommendedLevel } from '../utils/progression'
import { getVocabularyStatus } from '../utils/vocabulary'

export function useAppData() {
  const [results, setResults] = useState<ReadingResult[]>([])
  const [vocabulary, setVocabulary] = useState<VocabularyEntry[]>([])
  const [recommendedLevel, setRecommendedLevel] = useState<Level>('A2.1')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    Promise.all([db.getResults(), db.getVocabulary(), db.getSetting<Level>('recommendedLevel')])
      .then(([storedResults, storedVocabulary, storedLevel]) => {
        setResults(storedResults)
        setVocabulary(storedVocabulary)
        setRecommendedLevel(storedLevel ?? 'A2.1')
      })
      .finally(() => setReady(true))
  }, [])

  async function saveResult(result: ReadingResult) {
    await db.saveResult(result)
    await db.saveActivity({ id: `reading-${result.id}`, date: result.date, kind: 'reading' })
    const nextResults = [...results.filter((item) => item.readingId !== result.readingId), result]
    const nextLevel = getRecommendedLevel(nextResults, recommendedLevel)
    setResults(nextResults)
    setRecommendedLevel(nextLevel)
    await db.setSetting('recommendedLevel', nextLevel)
  }

  async function saveTerm(input: Omit<VocabularyEntry, 'seenCount' | 'successCount' | 'lastSeen' | 'status'>, known = false) {
    const current = vocabulary.find((item) => item.term === input.term)
    const seenCount = (current?.seenCount ?? 0) + 1
    const successCount = (current?.successCount ?? 0) + (known ? 1 : 0)
    const entry: VocabularyEntry = {
      ...input,
      seenCount,
      successCount,
      lastSeen: new Date().toISOString(),
      status: known ? getVocabularyStatus(seenCount, successCount) : (current?.status ?? 'learning'),
    }
    await db.saveVocabulary(entry)
    await db.saveActivity({ id: `vocabulary-${Date.now()}-${entry.term}`, date: entry.lastSeen, kind: 'vocabulary' })
    setVocabulary((items) => [...items.filter((item) => item.term !== entry.term), entry])
  }

  async function setTermStatus(term: string, status: VocabularyStatus) {
    const current = vocabulary.find((item) => item.term === term)
    if (!current) return
    const entry = { ...current, status }
    await db.saveVocabulary(entry)
    setVocabulary((items) => items.map((item) => item.term === term ? entry : item))
  }

  async function removeTerm(term: string) {
    await db.deleteVocabulary(term)
    setVocabulary((items) => items.filter((item) => item.term !== term))
  }

  const completedIds = useMemo(() => new Set(results.map((result) => result.readingId)), [results])
  return { ready, results, vocabulary, recommendedLevel, completedIds, saveResult, saveTerm, setTermStatus, removeTerm }
}
