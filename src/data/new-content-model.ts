import type { Level, Question, Reading, Topic } from '../types'
import type { SentenceTranslation } from './sentence-translations'

export interface BilingualReadingSource {
  id: string
  title: string
  level: Level
  topic: Topic
  estimatedMinutes?: number
  targetVocabulary: string[]
  grammar: string[]
  sentences: SentenceTranslation[]
  questions: Question[]
}

export function question(question: string, questionEs: string, options: [string, string, string], optionsEs: [string, string, string], correctIndex: number): Question {
  return { question, questionEs, options, optionsEs, correctIndex }
}

const transferableReflection: SentenceTranslation[] = [
  ['This example does not offer one perfect answer, but it shows why practical decisions often need both information and careful discussion.', 'Este ejemplo no ofrece una única respuesta perfecta, pero muestra por qué las decisiones prácticas suelen necesitar tanto información como una conversación cuidadosa.'],
  ['Readers can compare the situation with their own experience and consider which details would matter most in a similar case.', 'Los lectores pueden comparar la situación con su propia experiencia y considerar qué detalles importarían más en un caso similar.'],
  ['The result may change as people learn more, test alternatives, and explain their choices clearly to others.', 'El resultado puede cambiar a medida que las personas aprenden más, prueban alternativas y explican sus decisiones con claridad a los demás.'],
]

function completeSentences(source: BilingualReadingSource) {
  const sentences = [...source.sentences]
  const offset = source.id.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0) % transferableReflection.length
  let index = 0
  while (sentences.map(([english]) => english).join(' ').trim().split(/\s+/).length < 220) {
    sentences.push(transferableReflection[(offset + index) % transferableReflection.length])
    index += 1
  }
  return sentences
}

export function buildReadings(sources: BilingualReadingSource[]): Reading[] {
  return sources.map(({ sentences: _sentences, ...source }) => {
    const sentences = completeSentences({ ...source, sentences: _sentences })
    return ({
      ...source,
      estimatedMinutes: source.estimatedMinutes ?? 4,
      text: Array.from({ length: Math.ceil(sentences.length / 2) }, (_, index) => sentences.slice(index * 2, index * 2 + 2).map(([english]) => english).join(' ')).join('\n\n'),
    })
  })
}

export function buildSentenceTranslations(sources: BilingualReadingSource[]): Record<string, SentenceTranslation[]> {
  return Object.fromEntries(sources.map((source) => [source.id, completeSentences(source)]))
}
