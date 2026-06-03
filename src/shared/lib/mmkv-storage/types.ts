/**
 * Storage Adapter Interface
 *
 * Abstracts away the underlying storage engine (MMKV) so that
 * upper layers (entities, features) never depend on MMKV directly.
 * This also makes unit-testing trivial — swap in an in-memory Map.
 *
 * @module shared/lib/mmkv-storage
 */

export interface IStorageAdapter {
  /** Store a JSON-serializable value under `key`. */
  set<T>(key: string, value: T): void;

  /** Read a JSON-serializable value. Returns `null` when the key is missing. */
  get<T>(key: string): T | null;

  /** Store a raw string. */
  setString(key: string, value: string): void;

  /** Read a raw string. Returns `undefined` when the key is missing. */
  getString(key: string): string | undefined;

  /** Store a boolean flag. */
  setBoolean(key: string, value: boolean): void;

  /** Read a boolean flag. Defaults to `false` when the key is missing. */
  getBoolean(key: string): boolean;

  /** Store a number. */
  setNumber(key: string, value: number): void;

  /** Read a number. Returns `0` when the key is missing. */
  getNumber(key: string): number;

  /** Delete a single key. */
  delete(key: string): void;

  /** Check whether a key exists. */
  contains(key: string): boolean;

  /** Return every key currently stored. */
  getAllKeys(): string[];

  /** Return keys that start with `prefix`. */
  getKeysByPrefix(prefix: string): string[];

  /** Wipe the entire store. */
  clearAll(): void;
}
