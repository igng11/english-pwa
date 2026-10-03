import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { dictionary, fallbackDefinition } from '../data/dictionary'
import { sentenceTranslations, type SentenceTranslation } from '../data/sentence-translations'
import type { SpeechController } from '../hooks/useSpeechSynthesis'
import type { Reading, VocabularyEntry } from '../types'
import { cleanTerm } from '../utils/vocabulary'

type SaveInput = Omit<VocabularyEntry, 'seenCount' | 'successCount' | 'lastSeen' | 'status'>
type WordSelection = { word: string; context: SentenceTranslation }

function contextAt(text: string, offset: number, contexts: SentenceTranslation[]): SentenceTranslation {
  let searchFrom = 0
  for (const context of contexts) {
    const start = text.indexOf(context[0], searchFrom)
    if (start >= 0 && start <= offset && offset < start + context[0].length) return context
    if (start >= 0) searchFrom = start + context[0].length
  }
  return [text.trim(), '']
}

function TokenizedParagraph({ text, contexts, onWord }: { text: string; contexts: SentenceTranslation[]; onWord: (selection: WordSelection) => void }) {
  let offset = 0

  return <p>{text.split(/(\s+)/).map((token, index) => {
    const tokenOffset = offset
    offset += token.length
    if (/^\s+$/.test(token)) return token

    const selection = { word: token, context: contextAt(text, tokenOffset, contexts) }
    return <span className="reader-word" role="button" tabIndex={0} key={`${token}-${index}`} onClick={() => onWord(selection)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onWord(selection) } }}>{token}</span>
  })}</p>
}

export function Reader({ reading, vocabulary, speech, onClose, onTest, onSaveTerm, onRemoveTerm }: { reading: Reading; vocabulary: VocabularyEntry[]; speech: SpeechController; onClose: () => void; onTest: () => void; onSaveTerm: (entry: SaveInput, known?: boolean) => Promise<void>; onRemoveTerm: (term: string) => Promise<void> }) {
  const [progress, setProgress] = useState(0)
  const [activeWord, setActiveWord] = useState('')
  const [activeSentence, setActiveSentence] = useState('')
  const [activeSentenceEs, setActiveSentenceEs] = useState('')
  const [showSentenceEs, setShowSentenceEs] = useState(false)
  const [selection, setSelection] = useState('')
  const [notice, setNotice] = useState('')
  const [confirmRemoval, setConfirmRemoval] = useState(false)
  const articleCopyRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLElement>(null)
  const definition = useMemo(() => dictionary[activeWord] ?? fallbackDefinition, [activeWord])
  const savedEntry = useMemo(() => vocabulary.find((entry) => !entry.isPhrase && entry.term === activeWord), [activeWord, vocabulary])

  function closeWordPanel() {
    speech.cancel()
    setActiveWord('')
    setActiveSentence('')
    setActiveSentenceEs('')
    setShowSentenceEs(false)
    setConfirmRemoval(false)
  }

  function closeReader() {
    speech.cancel()
    onClose()
  }

  useEffect(() => {
    window.scrollTo({ top: 0 })
    setProgress(0)
    let frame = 0
    const update = () => {
      frame = 0
      const copy = articleCopyRef.current
      if (!copy) return
      const contentTop = window.scrollY + copy.getBoundingClientRect().top
      const contentBottom = contentTop + copy.offsetHeight
      const start = contentTop - (toolbarRef.current?.offsetHeight ?? 0)
      const end = Math.max(start + 1, contentBottom - window.innerHeight)
      const next = Math.max(0, Math.min(100, Math.round((window.scrollY - start) / (end - start) * 100)))
      setProgress((current) => current === next ? current : next)
    }
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    requestUpdate()
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [reading.id])

  useEffect(() => () => {
    speech.cancel()
  }, [reading.id, speech.cancel])

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

  function openWord(selection: WordSelection) {
    const nativeSelection = window.getSelection()
    if (nativeSelection && !nativeSelection.isCollapsed) return
    const word = cleanTerm(selection.word)
    if (!word) return
    speech.cancel()
    setSelection('')
    setActiveWord(word)
    setActiveSentence(selection.context[0])
    setActiveSentenceEs(selection.context[1])
    setShowSentenceEs(false)
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
      <header className="reader-toolbar" ref={toolbarRef}><button className="back-button" onClick={closeReader}>← Library</button><span>{progress}% read</span></header>
      <article className="reader-article">
        <div className="reader-meta"><span className="level-pill">{reading.level}</span><span>{reading.topic}</span><span>{reading.estimatedMinutes} min</span></div>
        <h1>{reading.title}</h1>
        <div className="article-copy" ref={articleCopyRef}>{reading.text.split('\n\n').map((paragraph) => <TokenizedParagraph key={paragraph.slice(0, 28)} text={paragraph} contexts={(sentenceTranslations[reading.id] ?? []).filter(([english]) => paragraph.includes(english))} onWord={openWord} />)}</div>
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
          {speech.available && <div className="word-audio-actions" aria-label="Pronunciation controls">
            <button type="button" aria-label="Listen to pronunciation" onClick={() => speech.speak(activeWord)}><span aria-hidden="true">🔊</span> Listen</button>
          </div>}
          <p className="spanish"><span>Spanish</span>{definition.spanish}</p>
          <p className="definition">{definition.definition}</p><p className="example">“{definition.example}”</p>
          <div className="sentence-context"><span>Context</span><p>“{activeSentence}”</p>
            {speech.available && <button type="button" className="sentence-audio-button" aria-label="Listen to sentence" onClick={() => speech.speak(activeSentence)}><span aria-hidden="true">🔊</span> Listen to sentence</button>}
            {activeSentenceEs && <button type="button" className="sentence-translation-toggle" aria-expanded={showSentenceEs} onClick={() => setShowSentenceEs((visible) => !visible)}>{showSentenceEs ? 'Ocultar oración en español' : 'Ver oración en español'}</button>}
            {showSentenceEs && <p className="sentence-translation" lang="es">{activeSentenceEs}</p>}
          </div>
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
