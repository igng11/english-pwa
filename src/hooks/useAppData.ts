import { useEffect, useMemo, useState } from 'react'
import { db } from '../services/db'
import type { ActivityEntry, Level, PersistedData, ReadingResult, SettingEntry, VoicePreference, VocabularyEntry, VocabularyStatus } from '../types'
import { getRecommendedLevel } from '../utils/progression'
import { getVocabularyStatus } from '../utils/vocabulary'

function localDateKey(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.slice(0, 10)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function settingValue<T>(settings: SettingEntry[], key: string) {
  return settings.find((entry) => entry.key === key)?.value as T | undefined
}

function recoverReadingActivity(data: PersistedData) {
  const recovered = data.results.flatMap((result) => {
    const alreadyRecorded = data.activity.some((entry) => entry.kind === 'reading'
      && entry.date === result.date
      && (entry.readingId === result.readingId || entry.id === `reading-${result.readingId}`))
    if (alreadyRecorded) return []

    return [{
      id: `reading-recovered-${result.readingId}-${result.date.replace(/[^a-zA-Z0-9]/g, '')}`,
      date: result.date,
      localDate: localDateKey(result.date),
      readingId: result.readingId,
      kind: 'reading' as const,
    }]
  })
  return { data: { ...data, activity: [...data.activity, ...recovered] }, recovered }
}

function uniqueActivityId(readingId: string, date: string) {
  const random = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).slice(2)
  return `reading-event-${readingId}-${date}-${random}`
}

export function useAppData() {
  const [results, setResults] = useState<ReadingResult[]>([])
  const [vocabulary, setVocabulary] = useState<VocabularyEntry[]>([])
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [settings, setSettings] = useState<SettingEntry[]>([])
  const [recommendedLevel, setRecommendedLevel] = useState<Level>('A2.1')
  const [voicePreference, setVoicePreference] = useState<VoicePreference>()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    Promise.all([db.getResults(), db.getVocabulary(), db.getActivity(), db.getSettings()])
      .then(async ([storedResults, storedVocabulary, storedActivity, storedSettings]) => {
        const { data, recovered } = recoverReadingActivity({ results: storedResults, vocabulary: storedVocabulary, activity: storedActivity, settings: storedSettings })
        await Promise.all(recovered.map((entry) => db.saveActivity(entry)))
        setResults(data.results)
        setVocabulary(data.vocabulary)
        setActivity(data.activity)
        setSettings(data.settings)
        setRecommendedLevel(settingValue<Level>(data.settings, 'recommendedLevel') ?? 'A2.1')
        setVoicePreference(settingValue<VoicePreference>(data.settings, 'voicePreference'))
      })
      .finally(() => setReady(true))
  }, [])

  function updateSettingState(key: string, value: unknown) {
    setSettings((items) => [...items.filter((entry) => entry.key !== key), { key, value }])
  }

  async function saveResult(result: ReadingResult) {
    const activityEntry: ActivityEntry = {
      id: uniqueActivityId(result.readingId, result.date),
      date: result.date,
      localDate: localDateKey(result.date),
      readingId: result.readingId,
      kind: 'reading',
    }
    const nextResults = [...results.filter((item) => item.readingId !== result.readingId), result]
    const nextLevel = getRecommendedLevel(nextResults, recommendedLevel)
    await db.saveReadingCompletion(result, activityEntry, nextLevel)
    setResults(nextResults)
    setActivity((items) => [...items, activityEntry])
    setRecommendedLevel(nextLevel)
    updateSettingState('recommendedLevel', nextLevel)
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

  async function saveVoicePreference(preference: VoicePreference) {
    await db.setSetting('voicePreference', preference)
    setVoicePreference(preference)
    updateSettingState('voicePreference', preference)
  }

  function getPersistentData(): PersistedData {
    return { results, vocabulary, activity, settings }
  }

  async function restorePersistentData(imported: PersistedData) {
    const { data } = recoverReadingActivity(imported)
    await db.replacePersistentData(data)
    setResults(data.results)
    setVocabulary(data.vocabulary)
    setActivity(data.activity)
    setSettings(data.settings)
    setRecommendedLevel(settingValue<Level>(data.settings, 'recommendedLevel') ?? 'A2.1')
    setVoicePreference(settingValue<VoicePreference>(data.settings, 'voicePreference'))
  }

  const completedIds = useMemo(() => new Set(results.map((result) => result.readingId)), [results])
  return { ready, results, vocabulary, activity, recommendedLevel, voicePreference, completedIds, saveResult, saveTerm, setTermStatus, removeTerm, saveVoicePreference, getPersistentData, restorePersistentData }
}
