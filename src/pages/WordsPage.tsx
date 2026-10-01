import { useEffect, useMemo, useState } from 'react'
import type { SpeechController } from '../hooks/useSpeechSynthesis'
import type { VocabularyEntry, VocabularyStatus } from '../types'

type Filter = VocabularyStatus | 'all' | 'phrases'

const filters: { id: Filter; label: string }[] = [
  { id: 'learning', label: 'Learning' },
  { id: 'almost-known', label: 'Almost known' },
  { id: 'known', label: 'Known' },
  { id: 'all', label: 'All' },
  { id: 'phrases', label: 'Phrases' },
]

function matchesFilter(entry: VocabularyEntry, filter: Filter) {
  if (filter === 'all') return true
  if (filter === 'phrases') return entry.isPhrase
  return !entry.isPhrase && entry.status === filter
}

function accuracy(entry: VocabularyEntry) {
  return entry.seenCount ? Math.round(entry.successCount / entry.seenCount * 100) : 0
}

function sortEntries(entries: VocabularyEntry[], filter: Filter) {
  return [...entries].sort((first, second) => {
    const recent = new Date(second.lastSeen).getTime() - new Date(first.lastSeen).getTime()
    if (recent) return recent
    if (filter === 'learning') {
      const accuracyDifference = accuracy(first) - accuracy(second)
      if (accuracyDifference) return accuracyDifference
      return first.seenCount - second.seenCount
    }
    return first.term.localeCompare(second.term)
  })
}

export function WordsPage({ vocabulary, speech, onStatus, onRemove }: { vocabulary: VocabularyEntry[]; speech: SpeechController; onStatus: (term: string, status: VocabularyStatus) => Promise<void>; onRemove: (term: string) => Promise<void> }) {
  const [filter, setFilter] = useState<Filter>('learning')
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null)
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null)
  const entries = useMemo(() => sortEntries(vocabulary.filter((entry) => matchesFilter(entry, filter)), filter), [filter, vocabulary])

  useEffect(() => () => speech.cancel(), [speech.cancel])

  function selectFilter(next: Filter) {
    speech.cancel()
    setFilter(next)
    setExpandedTerm(null)
    setPendingRemoval(null)
  }

  function toggleEntry(term: string) {
    speech.cancel()
    setExpandedTerm((current) => current === term ? null : term)
    setPendingRemoval(null)
  }

  async function markAsKnown(term: string) {
    await onStatus(term, 'known')
    setExpandedTerm(null)
  }

  async function remove(term: string) {
    await onRemove(term)
    setPendingRemoval(null)
    setExpandedTerm(null)
  }

  return (
    <main className="words-page page-enter">
      <header className="page-heading"><div className="eyebrow">Personal vocabulary</div><h1>Words worth keeping.</h1><p>Build familiarity from the texts you read, one encounter at a time.</p></header>
      <div className="word-filters" role="group" aria-label="Vocabulary filters">{filters.map((item) => <button type="button" aria-pressed={filter === item.id} className={filter === item.id ? 'active' : ''} onClick={() => selectFilter(item.id)} key={item.id}>{item.label}<span>{vocabulary.filter((entry) => matchesFilter(entry, item.id)).length}</span></button>)}</div>
      <section className="word-list" aria-label={`${filters.find((item) => item.id === filter)?.label} vocabulary`}>
        {entries.map((entry, index) => {
          const expanded = expandedTerm === entry.term
          const statusLabel = entry.isPhrase ? 'Phrase' : entry.status.replace('-', ' ')
          const detailsId = `word-details-${index}`
          return <article className={`word-card${expanded ? ' expanded' : ''}`} key={entry.term}>
            <button type="button" className="word-summary" aria-expanded={expanded} aria-controls={detailsId} onClick={() => toggleEntry(entry.term)}>
              <span className="word-summary-copy"><strong>{entry.term}</strong><span lang="es">{entry.spanish}</span></span>
              <span className={`status status-${entry.status}`}>{statusLabel}</span>
              <span className="word-chevron" aria-hidden="true">⌄</span>
            </button>
            {expanded && <div className="word-details" id={detailsId}>
              {speech.available && <button type="button" className="word-listen" aria-label={`Listen to ${entry.term}`} onClick={() => speech.speak(entry.term)}><span aria-hidden="true">🔊</span> Listen</button>}
              <p className="word-context"><span>Context</span><q>{entry.example}</q></p>
              {speech.available && <button type="button" className="sentence-audio-button word-sentence-listen" aria-label={`Listen to the context for ${entry.term}`} onClick={() => speech.speak(entry.example)}><span aria-hidden="true">🔊</span> Listen to sentence</button>}
              <p className="word-metrics">Seen {entry.seenCount} <span aria-hidden="true">·</span> Accuracy {accuracy(entry)}%</p>
              <div className="word-card-actions">
                {entry.status !== 'known' && <button className="secondary-button" type="button" onClick={() => markAsKnown(entry.term)}>Mark as known</button>}
                {pendingRemoval !== entry.term ? <button className="text-button danger-text" type="button" onClick={() => setPendingRemoval(entry.term)}>Remove</button> : <div className="inline-confirmation" role="group" aria-label={`Confirm removal of ${entry.term}`}>
                  <span>Remove permanently?</span>
                  <button className="text-button" type="button" onClick={() => setPendingRemoval(null)}>Cancel</button>
                  <button className="danger-button" type="button" onClick={() => remove(entry.term)}>Remove</button>
                </div>}
              </div>
            </div>}
          </article>
        })}
      </section>
      {!entries.length && <div className="empty-state"><div className="empty-glyph">Aa</div><h2>{filter === 'phrases' ? 'No saved phrases yet.' : `No ${filters.find((item) => item.id === filter)?.label.toLowerCase()} words yet.`}</h2><p>Tap words or select phrases while reading to add them here.</p></div>}
    </main>
  )
}
