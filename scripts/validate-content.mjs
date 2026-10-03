import { createServer } from 'vite'

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } })

try {
  const [{ readings, countWords }, { dictionary }, { sentenceTranslations }, { newContentSources }, { LEVELS, getRecommendedLevel }, { cleanTerm }] = await Promise.all([
    server.ssrLoadModule('/src/data/readings.ts'),
    server.ssrLoadModule('/src/data/dictionary.ts'),
    server.ssrLoadModule('/src/data/sentence-translations.ts'),
    server.ssrLoadModule('/src/data/new-content.ts'),
    server.ssrLoadModule('/src/utils/progression.ts'),
    server.ssrLoadModule('/src/utils/vocabulary.ts'),
  ])

  const errors = []
  const ids = new Set()
  const newIds = new Set(newContentSources.map((source) => source.id))
  const normalize = (value) => value.replace(/\s+/g, ' ').trim()
  const tokens = new Set()

  for (const reading of readings) {
    if (ids.has(reading.id)) errors.push(`Duplicate reading id: ${reading.id}`)
    ids.add(reading.id)
    if (!LEVELS.includes(reading.level)) errors.push(`${reading.id}: unknown level ${reading.level}`)
    if (!reading.title.trim() || !reading.topic || !reading.estimatedMinutes || !reading.targetVocabulary.length || !reading.grammar.length) errors.push(`${reading.id}: incomplete required metadata`)

    const words = countWords(reading.text)
    if (newIds.has(reading.id) && (words < 220 || words > 260)) errors.push(`${reading.id}: ${words} words (new readings require 220–260)`)

    if (reading.questions.length !== 3) errors.push(`${reading.id}: expected exactly 3 questions`)
    reading.questions.forEach((item, index) => {
      if (!item.question.trim() || !item.questionEs.trim()) errors.push(`${reading.id}: question ${index + 1} is not bilingual`)
      if (item.options.length !== 3 || item.optionsEs.length !== 3) errors.push(`${reading.id}: question ${index + 1} needs 3 bilingual options`)
      if (item.options.some((option) => !option.trim()) || item.optionsEs.some((option) => !option.trim())) errors.push(`${reading.id}: question ${index + 1} has an empty option`)
      if (item.correctIndex < 0 || item.correctIndex > 2) errors.push(`${reading.id}: question ${index + 1} has an invalid correctIndex`)
    })

    const pairs = sentenceTranslations[reading.id]
    if (!pairs?.length) errors.push(`${reading.id}: missing sentence translations`)
    else {
      if (pairs.some(([english, spanish]) => !english.trim() || !spanish.trim())) errors.push(`${reading.id}: empty sentence translation`)
      if (normalize(pairs.map(([english]) => english).join(' ')) !== normalize(reading.text)) errors.push(`${reading.id}: sentence translations do not exactly reconstruct the English text`)
    }

    for (const raw of reading.text.split(/\s+/)) {
      const term = cleanTerm(raw)
      if (term) tokens.add(term)
    }
  }

  const missing = [...tokens].filter((term) => !dictionary[term]?.spanish?.trim()).sort()
  if (missing.length) errors.push(`Missing Spanish dictionary entries (${missing.length}): ${missing.join(', ')}`)

  const levelCounts = Object.fromEntries(LEVELS.map((level) => [level, readings.filter((reading) => reading.level === level).length]))
  const expected = { 'A2.1': 3, 'A2.2': 3, 'A2.3': 3, 'A2.4': 6, 'A2.5': 5, 'A2.6': 5, 'A2.7': 5, 'A2.8': 5, 'B1.1': 6 }
  for (const [level, count] of Object.entries(expected)) {
    if (levelCounts[level] !== count) errors.push(`${level}: expected ${count} readings, found ${levelCounts[level]}`)
  }
  if (readings.length !== 41) errors.push(`Expected 41 readings, found ${readings.length}`)

  let recommendedLevel = LEVELS[0]
  for (let levelIndex = 0; levelIndex < LEVELS.length - 1; levelIndex += 1) {
    const level = LEVELS[levelIndex]
    const strongResults = [0, 1, 2].map((index) => ({ id: `${level}-${index}`, readingId: `${level}-${index}`, level, date: `2026-01-0${index + 1}T12:00:00.000Z`, correct: 3, total: 3, percentage: 100, wordCount: 230 }))
    recommendedLevel = getRecommendedLevel(strongResults, recommendedLevel)
  }
  if (recommendedLevel !== 'B1.1') errors.push(`Progression cannot reach B1.1 (stopped at ${recommendedLevel})`)

  const sentenceCount = Object.values(sentenceTranslations).reduce((sum, pairs) => sum + pairs.length, 0)
  const wordCount = readings.reduce((sum, reading) => sum + countWords(reading.text), 0)
  const newWordCounts = readings.filter((reading) => newIds.has(reading.id)).map((reading) => countWords(reading.text))
  const legacyBelowTarget = readings.filter((reading) => !newIds.has(reading.id) && countWords(reading.text) < 220).length
  const questionCount = readings.reduce((sum, reading) => sum + reading.questions.length, 0)
  const newQuestionCount = readings.filter((reading) => newIds.has(reading.id)).reduce((sum, reading) => sum + reading.questions.length, 0)
  console.log(`Content: ${readings.length} readings · ${sentenceCount} translated sentences · ${wordCount} words`)
  console.log(`New reading length: ${Math.min(...newWordCounts)}–${Math.max(...newWordCounts)} words`)
  console.log(`Questions: ${questionCount} total · ${newQuestionCount} new · ${newQuestionCount * 3} new options`)
  if (legacyBelowTarget) console.log(`Legacy exception: ${legacyBelowTarget} immutable reading(s) below 220 words retained unchanged`)
  console.log(`Dictionary: ${tokens.size - missing.length}/${tokens.size} reading forms covered`)
  console.log(`Levels: ${Object.entries(levelCounts).map(([level, count]) => `${level} ${count}`).join(' · ')}`)

  if (errors.length) {
    console.error(`\nContent validation failed with ${errors.length} issue(s):`)
    errors.forEach((error) => console.error(`- ${error}`))
    process.exitCode = 1
  } else {
    console.log('Content validation passed.')
  }
} finally {
  await server.close()
}
