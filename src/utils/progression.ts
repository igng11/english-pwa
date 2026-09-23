import type { Level, ReadingResult } from '../types'

export const LEVELS: Level[] = ['A2.1', 'A2.2', 'A2.3', 'A2.4']

export function getRecommendedLevel(results: ReadingResult[], current: Level = 'A2.1'): Level {
  if (!results.length) return current
  const ordered = [...results].sort((a, b) => a.date.localeCompare(b.date))
  const forCurrent = ordered.filter((r) => r.level === current)
  const lastThree = forCurrent.slice(-3)
  const lastTwo = forCurrent.slice(-2)
  const index = LEVELS.indexOf(current)
  if (lastThree.length === 3 && lastThree.every((r) => r.percentage >= 80)) return LEVELS[Math.min(index + 1, LEVELS.length - 1)]
  if (lastTwo.length === 2 && lastTwo.every((r) => r.percentage < 60)) return LEVELS[Math.max(index - 1, 0)]
  return current
}
