import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { VoicePreference } from '../types'

export const VOICE_PREVIEW_TEXT = 'This is the voice used for English pronunciation.'

export interface SpeechController {
  supported: boolean
  available: boolean
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  speak: (text: string) => void
  preview: (voice: SpeechSynthesisVoice) => void
  selectVoice: (voice: SpeechSynthesisVoice) => Promise<void>
  cancel: () => void
}

function matchesPreference(voice: SpeechSynthesisVoice, preference: VoicePreference) {
  return (preference.voiceURI && voice.voiceURI === preference.voiceURI)
    || (voice.name === preference.name && voice.lang === preference.lang)
}

function fallbackVoice(voices: SpeechSynthesisVoice[]) {
  return voices.find((voice) => voice.default)
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('en-us'))
    ?? voices[0]
    ?? null
}

export function voiceIdentifier(voice: SpeechSynthesisVoice) {
  return JSON.stringify([voice.voiceURI, voice.name, voice.lang])
}

export function useSpeechSynthesis(preference: VoicePreference | undefined, onSelect: (preference: VoicePreference) => Promise<void>): SpeechController {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (!supported) return
    const synthesis = window.speechSynthesis
    const updateVoices = () => {
      const englishVoices = synthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith('en'))
      setVoices(englishVoices)
    }

    updateVoices()
    synthesis.addEventListener('voiceschanged', updateVoices)
    return () => synthesis.removeEventListener('voiceschanged', updateVoices)
  }, [supported])

  const selectedVoice = useMemo(() => {
    if (preference) {
      const storedVoice = voices.find((voice) => matchesPreference(voice, preference))
      if (storedVoice) return storedVoice
    }
    return fallbackVoice(voices)
  }, [preference, voices])

  const cancel = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    utteranceRef.current = null
  }, [supported])

  const play = useCallback((text: string, voice: SpeechSynthesisVoice | null) => {
    if (!supported || !text || !voice) return
    cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = voice
    utterance.lang = voice.lang
    utterance.rate = 1
    utterance.onend = () => { if (utteranceRef.current === utterance) utteranceRef.current = null }
    utterance.onerror = () => { if (utteranceRef.current === utterance) utteranceRef.current = null }
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [cancel, supported])

  const speak = useCallback((text: string) => play(text, selectedVoice), [play, selectedVoice])
  const preview = useCallback((voice: SpeechSynthesisVoice) => play(VOICE_PREVIEW_TEXT, voice), [play])
  const selectVoice = useCallback(async (voice: SpeechSynthesisVoice) => {
    await onSelect({ voiceURI: voice.voiceURI, name: voice.name, lang: voice.lang })
  }, [onSelect])

  useEffect(() => () => cancel(), [cancel])

  return { supported, available: supported && selectedVoice !== null, voices, selectedVoice, speak, preview, selectVoice, cancel }
}
