import { DB_VERSION } from '../services/db'
import type { ActivityEntry, BackupDocument, PersistedData, ReadingResult, SettingEntry, VocabularyEntry } from '../types'

export const BACKUP_VERSION = 1

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasString(value: Record<string, unknown>, key: string) {
  return typeof value[key] === 'string' && value[key].length > 0
}

function isReadingResult(value: unknown): value is ReadingResult {
  return isRecord(value) && hasString(value, 'id') && hasString(value, 'readingId') && hasString(value, 'date')
    && typeof value.correct === 'number' && typeof value.total === 'number' && typeof value.percentage === 'number'
}

function isVocabularyEntry(value: unknown): value is VocabularyEntry {
  return isRecord(value) && hasString(value, 'term') && hasString(value, 'definition') && hasString(value, 'spanish')
    && hasString(value, 'example') && typeof value.seenCount === 'number' && typeof value.successCount === 'number'
    && hasString(value, 'lastSeen') && hasString(value, 'status') && typeof value.isPhrase === 'boolean'
}

function isActivityEntry(value: unknown): value is ActivityEntry {
  return isRecord(value) && hasString(value, 'id') && hasString(value, 'date')
    && (value.kind === 'reading' || value.kind === 'vocabulary')
}

function isSettingEntry(value: unknown): value is SettingEntry {
  return isRecord(value) && hasString(value, 'key') && 'value' in value
}

function hasUniqueKeys(values: { id?: string; term?: string; key?: string }[], key: 'id' | 'term' | 'key') {
  const keys = values.map((value) => value[key])
  return keys.every(Boolean) && new Set(keys).size === keys.length
}

export function createBackup(data: PersistedData): BackupDocument {
  return {
    app: 'english-pwa',
    backupVersion: BACKUP_VERSION,
    databaseVersion: DB_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  }
}

export function parseBackup(value: unknown): BackupDocument {
  if (!isRecord(value) || value.app !== 'english-pwa' || value.backupVersion !== BACKUP_VERSION
    || typeof value.databaseVersion !== 'number' || value.databaseVersion > DB_VERSION
    || typeof value.exportedAt !== 'string' || !isRecord(value.data)) {
    throw new Error('This is not a compatible English PWA backup.')
  }

  const { results, vocabulary, activity, settings } = value.data
  if (!Array.isArray(results) || !results.every(isReadingResult)
    || !Array.isArray(vocabulary) || !vocabulary.every(isVocabularyEntry)
    || !Array.isArray(activity) || !activity.every(isActivityEntry)
    || !Array.isArray(settings) || !settings.every(isSettingEntry)
    || !hasUniqueKeys(results, 'id') || !hasUniqueKeys(vocabulary, 'term')
    || !hasUniqueKeys(activity, 'id') || !hasUniqueKeys(settings, 'key')) {
    throw new Error('The backup data is incomplete or invalid.')
  }

  return value as unknown as BackupDocument
}
