import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { dictionary, fallbackDefinition } from '../data/dictionary'
import type { Reading, VocabularyEntry } from '../types'
import { cleanTerm } from '../utils/vocabulary'

type SaveInput = Omit<VocabularyEntry, 'seenCount' | 'successCount' | 'lastSeen' | 'status'>

function TokenizedParagraph({ text, onWord }: { text: string; onWord: (word: string) => void }) {
  return <p>{text.split(/(\s+)/).map((token, index) => /^\s+$/.test(token) ? token : <span className="reader-word" role="button" tabIndex={0} key={`${token}-${index}`} onClick={() => onWord(token)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onWord(token) } }}>{token}</span>)}</p>
}

export function Reader({ reading, vocabulary, onClose, onTest, onSaveTerm, onRemoveTerm }: { reading: Reading; vocabulary: VocabularyEntry[]; onClose: () => void; onTest: () => void; onSaveTerm: (entry: SaveInput, known?: boolean) => Promise<void>; onRemoveTerm: (term: string) => Promise<void> }) {
  const [progress, setProgress] = useState(0)
  const [activeWord, setActiveWord] = useState('')
  const [selection, setSelection] = useState('')
  const [notice, setNotice] = useState('')
  const [confirmRemoval, setConfirmRemoval] = useState(false)
  const articleCopyRef = useRef<HTMLDivElement>(null)
  const definition = useMemo(() => dictionary[activeWord] ?? fallbackDefinition, [activeWord])
  const savedEntry = useMemo(() => vocabulary.find((entry) => !entry.isPhrase && entry.term === activeWord), [activeWord, vocabulary])

  function closeWordPanel() {
    setActiveWord('')
    setConfirmRemoval(false)
  }

  useEffect(() => {
    window.scrollTo({ top: 0 })
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      setProgress(height > 0 ? Math.min(100, Math.round(window.scrollY / height * 100)) : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    const handleSelectionChange = () => {
      const nativeSelection = window.getSelection()
      const copy = articleCopyRef.current
      if (!nativeSelection || nativeSelection.rangeCount === 0 || nativeSelection.isCollapsed || !copy || !nativeSelection.anchorNode || !nativeSelection.focusNode || !copy.contains(nativeSelection.anchorNode) || !copy.contains(nativeSelection.focusNode)) {
        setSelection('')
        return
      }

      const text = nativeSelection.toString().trim().replace(/\s+/g, ' ')
      setSelection(text.split(/\s+/).length > 1 && text.length < 140 ? text : '')
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [])

  function openWord(raw: string) {
    const nativeSelection = window.getSelection()
    if (nativeSelection && !nativeSelection.isCollapsed) return
    const word = cleanTerm(raw)
    if (!word) return
    setSelection('')
    setActiveWord(word)
    setConfirmRemoval(false)
  }

  async function saveWord(known: boolean) {
    await onSaveTerm({ term: activeWord, ...definition, isPhrase: false }, known)
    setNotice(known ? 'Marked as known' : 'Added to Learning')
    closeWordPanel()
    window.setTimeout(() => setNotice(''), 1800)
  }

  async function removeWord() {
    await onRemoveTerm(activeWord)
    setNotice('Removed from vocabulary')
    closeWordPanel()
    window.setTimeout(() => setNotice(''), 1800)
  }

  async function savePhrase() {
    await onSaveTerm({ term: selection, definition: 'A phrase saved from a reading. Review it in its original context.', spanish: 'Frase guardada para revisar.', example: selection, isPhrase: true })
    window.getSelection()?.removeAllRanges()
    setSelection('')
    setNotice('Phrase saved')
    window.setTimeout(() => setNotice(''), 1800)
  }

  return (
    <main className="reader-page page-enter">
      <div className="reader-progress" aria-label={`${progress}% of article read`}><span style={{ width: `${progress}%` }} /></div>
      <header className="reader-toolbar"><button className="back-button" onClick={onClose}>← Library</button><span>{progress}% read</span></header>
      <article className="reader-article">
        <div className="reader-meta"><span className="level-pill">{reading.level}</span><span>{reading.topic}</span><span>{reading.estimatedMinutes} min</span></div>
        <h1>{reading.title}</h1>
        <p className="reader-hint">Tap a word for Spanish and a simple definition. Select a longer expression to save it.</p>
        <div className="article-copy" ref={articleCopyRef}>{reading.text.split('\n\n').map((paragraph) => <TokenizedParagraph key={paragraph.slice(0, 28)} text={paragraph} onWord={openWord} />)}</div>
        <aside className="reading-notes">
          <div><span>Target words</span><p>{reading.targetVocabulary.join(' · ')}</p></div>
          <div><span>Grammar in context</span><p>{reading.grammar.map((item) => item.replaceAll('-', ' ')).join(' · ')}</p></div>
        </aside>
        <button className="primary-button finish-reading" onClick={onTest}>I’ve finished reading →</button>
      </article>
      {selection && <div className="selection-action" onPointerDown={(event) => event.preventDefault()}><span>“{selection}”</span><button onClick={savePhrase}>Save phrase</button></div>}
      {activeWord && createPortal(<>
        <div className="sheet-backdrop" aria-hidden="true" onClick={closeWordPanel} />
        <section className="word-sheet" role="dialog" aria-modal="true" aria-labelledby="word-title">
          <button className="sheet-close" onClick={closeWordPanel} aria-label="Close definition">×</button>
          <div className="eyebrow">Word in context</div><h2 id="word-title">{activeWord}</h2>
          <p className="spanish"><span>Spanish</span>{definition.spanish}</p>
          <p className="definition">{definition.definition}</p><p className="example">“{definition.example}”</p>
          <div className="sheet-actions"><button className="secondary-button" onClick={() => saveWord(true)}>I know it</button><button className="primary-button" onClick={() => saveWord(false)}>Learning</button></div>
          {savedEntry && <div className="reader-vocabulary-actions">
            {!confirmRemoval ? <button className="text-button danger-text" onClick={() => setConfirmRemoval(true)}>Remove from vocabulary</button> : <div className="inline-confirmation" role="group" aria-label={`Confirm removal of ${activeWord}`}>
              <span>Remove this word permanently?</span>
              <button className="text-button" onClick={() => setConfirmRemoval(false)}>Cancel</button>
              <button className="danger-button" onClick={removeWord}>Remove</button>
            </div>}
          </div>}
        </section>
      </>, document.body)}
      {notice && <div className="toast" role="status">{notice}</div>}
    </main>
  )
}
