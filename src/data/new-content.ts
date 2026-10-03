import { a24a25Sources } from './new-content-a24-a25'
import { a26a27Sources } from './new-content-a26-a27'
import { a28b11Sources } from './new-content-a28-b11'
import { buildReadings, buildSentenceTranslations } from './new-content-model'

export const newContentSources = [...a24a25Sources, ...a26a27Sources, ...a28b11Sources]
export const newReadings = buildReadings(newContentSources)
export const newSentenceTranslations = buildSentenceTranslations(newContentSources)
