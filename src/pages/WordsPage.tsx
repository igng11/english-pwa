import { useState } from 'react'
import type { VocabularyEntry, VocabularyStatus } from '../types'

type Tab = VocabularyStatus | 'phrases'
const tabs: { id: Tab; label: string }[] = [{ id: 'learning', label: 'Learning' }, { id: 'almost-known', label: 'Almost known' }, { id: 'known', label: 'Known' }, { id: 'phrases', label: 'Saved phrases' }]

export function WordsPage({ vocabulary, onStatus }: { vocabulary: VocabularyEntry[]; onStatus: (term: string, status: VocabularyStatus) => void }) {
  const [tab, setTab] = useState<Tab>('learning')
  const entries = vocabulary.filter((entry) => tab === 'phrases' ? entry.isPhrase : !entry.isPhrase && entry.status === tab)
  return (
    <main className="words-page page-enter">
      <header className="page-heading"><div className="eyebrow">Personal vocabulary</div><h1>Words worth keeping.</h1><p>Build familiarity from the texts you read, one encounter at a time.</p></header>
      <div className="tabs" role="tablist">{tabs.map((item) => <button role="tab" aria-selected={tab === item.id} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)} key={item.id}>{item.label}<span>{vocabulary.filter((entry) => item.id === 'phrases' ? entry.isPhrase : !entry.isPhrase && entry.status === item.id).length}</span></button>)}</div>
      <section className="word-list">{entries.map((entry) => <article className="word-card" key={entry.term}>
        <div className="word-title-row"><h2>{entry.term}</h2><span className={`status status-${entry.status}`}>{entry.isPhrase ? 'phrase' : entry.status.replace('-', ' ')}</span></div>
        <dl><div><dt>Definition</dt><dd>{entry.definition}</dd></div><div><dt>Spanish</dt><dd>{entry.spanish}</dd></div><div><dt>Example</dt><dd className="word-example">“{entry.example}”</dd></div></dl>
        <div className="word-stats"><span>Seen <strong>{entry.seenCount}</strong></span><span>Correct <strong>{entry.successCount}</strong></span><span>Accuracy <strong>{entry.seenCount ? Math.round(entry.successCount / entry.seenCount * 100) : 0}%</strong></span></div>
        {!entry.isPhrase && <label className="status-select">Status<select value={entry.status} onChange={(event) => onStatus(entry.term, event.target.value as VocabularyStatus)}><option value="learning">Learning</option><option value="almost-known">Almost known</option><option value="known">Known</option></select></label>}
      </article>)}</section>
      {!entries.length && <div className="empty-state"><div className="empty-glyph">Aa</div><h2>{tab === 'phrases' ? 'No saved phrases yet.' : `No ${tabs.find((item) => item.id === tab)?.label.toLowerCase()} words yet.`}</h2><p>Tap words or select phrases while reading to add them here.</p></div>}
    </main>
  )
}
