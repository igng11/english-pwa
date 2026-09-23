export type Level = 'A2.1' | 'A2.2' | 'A2.3' | 'A2.4'
export type Topic = 'Technology' | 'Programming' | 'Work' | 'Business' | 'Daily Life' | 'Travel' | 'Culture' | 'Short Stories'
export type VocabularyStatus = 'learning' | 'almost-known' | 'known'

export interface Question {
  question: string
  options: [string, string, string]
  correctIndex: number
}

export interface Reading {
  id: string
  title: string
  level: Level
  topic: Topic
  estimatedMinutes: number
  text: string
  targetVocabulary: string[]
  grammar: string[]
  questions: Question[]
}

export interface ReadingResult {
  id: string
  readingId: string
  level: Level
  date: string
  correct: number
  total: number
  percentage: number
  wordCount: number
}

export interface VocabularyEntry {
  term: string
  definition: string
  spanish: string
  example: string
  seenCount: number
  successCount: number
  lastSeen: string
  status: VocabularyStatus
  isPhrase: boolean
}

export interface ActivityEntry {
  id: string
  date: string
  kind: 'reading' | 'vocabulary'
}

export type View = 'today' | 'read' | 'words' | 'progress'
