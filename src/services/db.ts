import type { ActivityEntry, PersistedData, ReadingResult, SettingEntry, VocabularyEntry } from '../types'

const DB_NAME = 'steadily-reader'
export const DB_VERSION = 1

type Store = 'results' | 'vocabulary' | 'activity' | 'settings'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('results')) db.createObjectStore('results', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('vocabulary')) db.createObjectStore('vocabulary', { keyPath: 'term' })
      if (!db.objectStoreNames.contains('activity')) db.createObjectStore('activity', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings')
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function getAll<T>(store: Store): Promise<T[]> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const request = db.transaction(store, 'readonly').objectStore(store).getAll()
    request.onsuccess = () => resolve(request.result as T[])
    request.onerror = () => reject(request.error)
  })
}

async function put<T>(store: Store, value: T, key?: IDBValidKey): Promise<void> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite')
    key === undefined ? tx.objectStore(store).put(value) : tx.objectStore(store).put(value, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function remove(store: Store, key: IDBValidKey): Promise<void> {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = database.transaction(store, 'readwrite')
    tx.objectStore(store).delete(key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function getSettings(): Promise<SettingEntry[]> {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const entries: SettingEntry[] = []
    const request = database.transaction('settings', 'readonly').objectStore('settings').openCursor()
    request.onsuccess = () => {
      const cursor = request.result
      if (!cursor) {
        resolve(entries)
        return
      }
      entries.push({ key: String(cursor.key), value: cursor.value })
      cursor.continue()
    }
    request.onerror = () => reject(request.error)
  })
}

async function replacePersistentData(data: PersistedData): Promise<void> {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = database.transaction(['results', 'vocabulary', 'activity', 'settings'], 'readwrite')
    const results = tx.objectStore('results')
    const vocabulary = tx.objectStore('vocabulary')
    const activity = tx.objectStore('activity')
    const settings = tx.objectStore('settings')

    results.clear()
    vocabulary.clear()
    activity.clear()
    settings.clear()
    data.results.forEach((entry) => results.put(entry))
    data.vocabulary.forEach((entry) => vocabulary.put(entry))
    data.activity.forEach((entry) => activity.put(entry))
    data.settings.forEach((entry) => settings.put(entry.value, entry.key))

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error ?? new Error('Import was cancelled'))
  })
}

async function saveReadingCompletion(result: ReadingResult, activity: ActivityEntry, recommendedLevel: string): Promise<void> {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = database.transaction(['results', 'activity', 'settings'], 'readwrite')
    tx.objectStore('results').put(result)
    tx.objectStore('activity').put(activity)
    tx.objectStore('settings').put(recommendedLevel, 'recommendedLevel')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error ?? new Error('Reading completion was cancelled'))
  })
}

export const db = {
  getResults: () => getAll<ReadingResult>('results'),
  getVocabulary: () => getAll<VocabularyEntry>('vocabulary'),
  saveVocabulary: (entry: VocabularyEntry) => put('vocabulary', entry),
  deleteVocabulary: (term: string) => remove('vocabulary', term),
  getActivity: () => getAll<ActivityEntry>('activity'),
  saveActivity: (entry: ActivityEntry) => put('activity', entry),
  getSettings,
  replacePersistentData,
  saveReadingCompletion,
  async getSetting<T>(key: string): Promise<T | undefined> {
    const database = await openDatabase()
    return new Promise((resolve, reject) => {
      const request = database.transaction('settings', 'readonly').objectStore('settings').get(key)
      request.onsuccess = () => resolve(request.result as T | undefined)
      request.onerror = () => reject(request.error)
    })
  },
  setSetting: <T>(key: string, value: T) => put('settings', value, key),
}
