import { useEffect, useMemo, useState } from 'react'
import type { SpeechController } from '../hooks/useSpeechSynthesis'
import { voiceIdentifier } from '../hooks/useSpeechSynthesis'

export function VoiceSettings({ speech }: { speech: SpeechController }) {
  const [candidateId, setCandidateId] = useState('')
  const [notice, setNotice] = useState('')
  const selectedId = speech.selectedVoice ? voiceIdentifier(speech.selectedVoice) : ''
  const candidate = useMemo(
    () => speech.voices.find((voice) => voiceIdentifier(voice) === candidateId) ?? null,
    [candidateId, speech.voices],
  )

  useEffect(() => {
    setCandidateId((current) => speech.voices.some((voice) => voiceIdentifier(voice) === current)
      ? current
      : selectedId)
  }, [selectedId, speech.voices])

  async function saveVoice() {
    if (!candidate) return
    await speech.selectVoice(candidate)
    setNotice('Voice saved on this device')
    window.setTimeout(() => setNotice(''), 1800)
  }

  return (
    <section className="progress-section voice-settings" aria-labelledby="voice-settings-title">
      <div className="section-title"><h2 id="voice-settings-title">Voice</h2><span>English pronunciation</span></div>
      <p className="voice-count">Available voices on this device: {speech.voices.length}</p>
      {speech.supported ? <>
        <label htmlFor="voice-select">Voice</label>
        <select id="voice-select" value={candidateId} onChange={(event) => setCandidateId(event.target.value)} disabled={!speech.voices.length}>
          {!speech.voices.length && <option value="">No English voices available</option>}
          {speech.voices.map((voice, index) => <option key={`${voiceIdentifier(voice)}-${index}`} value={voiceIdentifier(voice)}>
            {voice.name} — {voice.lang}{voice.default ? ' — Default' : ''}
          </option>)}
        </select>
        <div className="voice-actions">
          <button className="secondary-button" type="button" onClick={() => candidate && speech.preview(candidate)} disabled={!candidate}>Preview</button>
          <button className="primary-button" type="button" onClick={saveVoice} disabled={!candidate}>Use voice</button>
        </div>
        {speech.selectedVoice && <p className="current-voice">Current voice: <strong>{speech.selectedVoice.name}</strong> — {speech.selectedVoice.lang}</p>}
      </> : <p className="voice-unavailable">Pronunciation is not available on this device.</p>}
      {notice && <p className="voice-notice" role="status">{notice}</p>}
    </section>
  )
}
