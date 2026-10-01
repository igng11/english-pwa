import type { Level, ReadingResult } from '../types'

export const LEVELS: Level[] = ['A2.1', 'A2.2', 'A2.3', 'A2.4']
const STRONG_READING_SCORE = 80

export function getStrongReadingStreak(results: ReadingResult[], current: Level): number {
  const forCurrent = results
    .filter((result) => result.level === current)
    .sort((first, second) => first.date.localeCompare(second.date))
  let streak = 0
  for (let index = forCurrent.length - 1; index >= 0 && streak < 3; index -= 1) {
    if (forCurrent[index].percentage < STRONG_READING_SCORE) break
    streak += 1
  }
  return streak
}

export function getRecommendedLevel(results: ReadingResult[], current: Level = 'A2.1'): Level {
  if (!results.length) return current
  const ordered = [...results].sort((a, b) => a.date.localeCompare(b.date))
  const forCurrent = ordered.filter((r) => r.level === current)
  const lastThree = forCurrent.slice(-3)
  const lastTwo = forCurrent.slice(-2)
  const index = LEVELS.indexOf(current)
  if (lastThree.length === 3 && lastThree.every((r) => r.percentage >= STRONG_READING_SCORE)) return LEVELS[Math.min(index + 1, LEVELS.length - 1)]
  if (lastTwo.length === 2 && lastTwo.every((r) => r.percentage < 60)) return LEVELS[Math.max(index - 1, 0)]
  return current
}
