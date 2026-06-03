/**
 * MMKV Storage Adapter
 *
 * Wraps the singleton MMKV instance behind the IStorageAdapter
 * interface so the rest of the app never touches MMKV directly.
 *
 * JSON values are stored as strings — MMKV's native string
 * read/write is already O(1) via JSI, so the JSON.parse overhead
 * is negligible for the payload sizes we deal with (single notes).
 *
 * NOTE: react-native-mmkv v4 uses `createMMKV()` factory instead
 * of `new MMKV()`, and `remove()` instead of `delete()`.
 *
 * @module shared/lib/mmkv-storage
 */

import {createMMKV} from 'react-native-mmkv';
import type {IStorageAdapter} from './types';

// ---------------------------------------------------------------------------
// Singleton — one MMKV store for the whole app.
// Partitioning happens through key prefixes (e.g. "note:", "category:").
// ---------------------------------------------------------------------------
const mmkv = createMMKV({id: 'offline-notes-storage'});

// ---------------------------------------------------------------------------
// Adapter implementation
// ---------------------------------------------------------------------------
export const storage: IStorageAdapter = {
  // -- JSON values ----------------------------------------------------------

  set<T>(key: string, value: T): void {
    mmkv.set(key, JSON.stringify(value));
  },

  get<T>(key: string): T | null {
    const raw = mmkv.getString(key);
    if (raw === undefined) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  // -- Primitive values -----------------------------------------------------

  setString(key: string, value: string): void {
    mmkv.set(key, value);
  },

  getString(key: string): string | undefined {
    return mmkv.getString(key);
  },

  setBoolean(key: string, value: boolean): void {
    mmkv.set(key, value);
  },

  getBoolean(key: string): boolean {
    return mmkv.getBoolean(key) ?? false;
  },

  setNumber(key: string, value: number): void {
    mmkv.set(key, value);
  },

  getNumber(key: string): number {
    return mmkv.getNumber(key) ?? 0;
  },

  // -- Key management -------------------------------------------------------

  delete(key: string): void {
    mmkv.remove(key);
  },

  contains(key: string): boolean {
    return mmkv.contains(key);
  },

  getAllKeys(): string[] {
    return mmkv.getAllKeys();
  },

  getKeysByPrefix(prefix: string): string[] {
    return mmkv.getAllKeys().filter((k: string) => k.startsWith(prefix));
  },

  clearAll(): void {
    mmkv.clearAll();
  },
};
