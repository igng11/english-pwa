import type { ActivityEntry, ReadingResult, VocabularyEntry } from '../types'

const DB_NAME = 'steadily-reader'
const DB_VERSION = 1

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

export const db = {
  getResults: () => getAll<ReadingResult>('results'),
  saveResult: (result: ReadingResult) => put('results', result),
  getVocabulary: () => getAll<VocabularyEntry>('vocabulary'),
  saveVocabulary: (entry: VocabularyEntry) => put('vocabulary', entry),
  deleteVocabulary: (term: string) => remove('vocabulary', term),
  getActivity: () => getAll<ActivityEntry>('activity'),
  saveActivity: (entry: ActivityEntry) => put('activity', entry),
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
