import { useRef, useState } from 'react'
import type { BackupDocument, PersistedData } from '../types'
import { createBackup, parseBackup } from '../utils/backup'

function downloadFile(file: File) {
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function BackupData({ getData, onRestore, title = 'Backup data' }: { getData: () => PersistedData; onRestore: (data: PersistedData) => Promise<void>; title?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<BackupDocument | null>(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  async function exportProgress() {
    setError('')
    const backup = createBackup(getData())
    const filename = `english-pwa-backup-${backup.exportedAt.slice(0, 10)}.json`
    const file = new File([JSON.stringify(backup, null, 2)], filename, { type: 'application/json' })

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'English PWA backup' })
        return
      } catch (shareError) {
        if (shareError instanceof DOMException && shareError.name === 'AbortError') return
      }
    }
    downloadFile(file)
  }

  async function chooseBackup(file: File | undefined) {
    setPending(null)
    setNotice('')
    setError('')
    if (!file) return
    try {
      const parsed = parseBackup(JSON.parse(await file.text()) as unknown)
      setPending(parsed)
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : 'This backup could not be read.')
    }
  }

  async function restore() {
    if (!pending) return
    try {
      await onRestore(pending.data)
      setPending(null)
      setNotice('Progress restored')
      if (inputRef.current) inputRef.current.value = ''
      window.setTimeout(() => setNotice(''), 2000)
    } catch {
      setError('The backup could not be restored. Your current data was not changed.')
    }
  }

  return (
    <section className="progress-section backup-section" aria-labelledby="backup-title">
      <div className="section-title"><h2 id="backup-title">{title}</h2><span>Local JSON file</span></div>
      <p className="backup-copy">Export your local progress or restore a compatible backup on this device.</p>
      <div className="backup-actions">
        <button className="secondary-button" type="button" onClick={exportProgress}>Export progress</button>
        <button className="secondary-button" type="button" onClick={() => inputRef.current?.click()}>Import progress</button>
        <input ref={inputRef} className="visually-hidden" type="file" accept="application/json,.json" onChange={(event) => chooseBackup(event.target.files?.[0])} />
      </div>
      {pending && <div className="backup-confirmation" role="alertdialog" aria-labelledby="backup-confirmation-title">
        <strong id="backup-confirmation-title">Replace local data with this backup?</strong>
        <ul>
          <li>{pending.data.results.length} reading results</li>
          <li>{pending.data.vocabulary.length} vocabulary entries</li>
          <li>{pending.data.activity.length} activity records</li>
          <li>{pending.data.settings.length ? 'Settings included' : 'No settings included'}</li>
        </ul>
        <div><button className="text-button" type="button" onClick={() => setPending(null)}>Cancel</button><button className="danger-button" type="button" onClick={restore}>Replace data</button></div>
      </div>}
      {error && <p className="backup-error" role="alert">{error}</p>}
      {notice && <p className="backup-notice" role="status">{notice}</p>}
    </section>
  )
}
