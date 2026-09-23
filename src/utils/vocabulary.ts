import type { VocabularyStatus } from '../types'

export function getVocabularyStatus(seenCount: number, successCount: number): VocabularyStatus {
  const accuracy = seenCount ? successCount / seenCount : 0
  if (successCount >= 5 && accuracy >= 0.85) return 'known'
  if (successCount >= 3 && accuracy >= 0.7) return 'almost-known'
  return 'learning'
}

export function cleanTerm(value: string) {
  return value.trim().replace(/^[^a-zA-Z']+|[^a-zA-Z']+$/g, '').toLowerCase()
}
