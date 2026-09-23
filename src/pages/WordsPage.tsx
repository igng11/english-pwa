import { useState } from 'react'
import type { VocabularyEntry, VocabularyStatus } from '../types'

type Tab = VocabularyStatus | 'phrases'
const tabs: { id: Tab; label: string }[] = [{ id: 'learning', label: 'Learning' }, { id: 'almost-known', label: 'Almost known' }, { id: 'known', label: 'Known' }, { id: 'phrases', label: 'Saved phrases' }]

function matchesTab(entry: VocabularyEntry, tab: Tab) {
  if (tab === 'phrases') return entry.isPhrase && entry.status !== 'known'
  if (tab === 'known') return entry.status === 'known'
  return !entry.isPhrase && entry.status === tab
}

export function WordsPage({ vocabulary, onStatus, onRemove }: { vocabulary: VocabularyEntry[]; onStatus: (term: string, status: VocabularyStatus) => void; onRemove: (term: string) => Promise<void> }) {
  const [tab, setTab] = useState<Tab>('learning')
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null)
  const entries = vocabulary.filter((entry) => matchesTab(entry, tab))
  return (
    <main className="words-page page-enter">
      <header className="page-heading"><div className="eyebrow">Personal vocabulary</div><h1>Words worth keeping.</h1><p>Build familiarity from the texts you read, one encounter at a time.</p></header>
      <div className="tabs" role="tablist">{tabs.map((item) => <button role="tab" aria-selected={tab === item.id} className={tab === item.id ? 'active' : ''} onClick={() => { setTab(item.id); setPendingRemoval(null) }} key={item.id}>{item.label}<span>{vocabulary.filter((entry) => matchesTab(entry, item.id)).length}</span></button>)}</div>
      <section className="word-list">{entries.map((entry) => <article className="word-card" key={entry.term}>
        <div className="word-title-row"><h2>{entry.term}</h2><span className={`status status-${entry.status}`}>{entry.isPhrase && entry.status !== 'known' ? 'phrase' : entry.status.replace('-', ' ')}</span></div>
        <dl><div><dt>Definition</dt><dd>{entry.definition}</dd></div><div><dt>Spanish</dt><dd>{entry.spanish}</dd></div><div><dt>Example</dt><dd className="word-example">“{entry.example}”</dd></div></dl>
        <div className="word-stats"><span>Seen <strong>{entry.seenCount}</strong></span><span>Correct <strong>{entry.successCount}</strong></span><span>Accuracy <strong>{entry.seenCount ? Math.round(entry.successCount / entry.seenCount * 100) : 0}%</strong></span></div>
        {!entry.isPhrase && <label className="status-select">Status<select value={entry.status} onChange={(event) => onStatus(entry.term, event.target.value as VocabularyStatus)}><option value="learning">Learning</option><option value="almost-known">Almost known</option><option value="known">Known</option></select></label>}
        <div className="word-card-actions">
          {entry.status !== 'known' && <button className="secondary-button" onClick={() => onStatus(entry.term, 'known')}>Mark as known</button>}
          {pendingRemoval !== entry.term ? <button className="text-button danger-text" onClick={() => setPendingRemoval(entry.term)}>Remove</button> : <div className="inline-confirmation" role="group" aria-label={`Confirm removal of ${entry.term}`}>
            <span>Remove permanently?</span>
            <button className="text-button" onClick={() => setPendingRemoval(null)}>Cancel</button>
            <button className="danger-button" onClick={async () => { await onRemove(entry.term); setPendingRemoval(null) }}>Remove</button>
          </div>}
        </div>
      </article>)}</section>
      {!entries.length && <div className="empty-state"><div className="empty-glyph">Aa</div><h2>{tab === 'phrases' ? 'No saved phrases yet.' : `No ${tabs.find((item) => item.id === tab)?.label.toLowerCase()} words yet.`}</h2><p>Tap words or select phrases while reading to add them here.</p></div>}
    </main>
  )
}
