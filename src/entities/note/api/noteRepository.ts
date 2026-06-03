/**
 * Note Entity — Repository
 * @module entities/note
 */

import {storage} from '@/shared/lib/mmkv-storage';
import type {Note, CreateNoteDTO, UpdateNoteDTO, NoteSortOptions} from '../model/types';
import {generateNoteId, extractTitle, sortNotes} from '../lib/noteHelpers';

const NOTES_KEY_PREFIX = 'note:';
const NOTE_INDEX_KEY = 'note:__index__';

/**
 * Note Repository — MMKV üzerinde CRUD operasyonları.
 *
 * Depolama stratejisi:
 * - Her not ayrı key'de: `note:{id}` → Note JSON
 * - ID index'i: `note:__index__` → string[] (tüm note ID'leri)
 *
 * Bu strateji tekil not okuma/yazma'yı O(1) yapar.
 */
export const noteRepository = {
  /** Yeni not oluştur */
  create(dto: CreateNoteDTO): Note {
    const now = Date.now();
    const note: Note = {
      id: generateNoteId(),
      title: dto.title || extractTitle(dto.content),
      content: dto.content,
      categoryId: dto.categoryId,
      createdAt: now,
      updatedAt: now,
      isFavorite: false,
      isPinned: false,
    };

    // Notu kaydet
    storage.set<Note>(`${NOTES_KEY_PREFIX}${note.id}`, note);

    // Index'e ekle
    const index = storage.get<string[]>(NOTE_INDEX_KEY) || [];
    index.push(note.id);
    storage.set(NOTE_INDEX_KEY, index);

    return note;
  },

  /** ID ile not getir */
  getById(id: string): Note | null {
    return storage.get<Note>(`${NOTES_KEY_PREFIX}${id}`);
  },

  /** Tüm notları getir (sıralı) */
  getAll(sort?: NoteSortOptions): Note[] {
    const index = storage.get<string[]>(NOTE_INDEX_KEY) || [];
    const notes = index
      .map(id => storage.get<Note>(`${NOTES_KEY_PREFIX}${id}`))
      .filter((n): n is Note => n !== null);

    return sortNotes(notes, sort);
  },

  /** Notu güncelle */
  update(id: string, dto: UpdateNoteDTO): Note | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const updated: Note = {
      ...existing,
      ...dto,
      updatedAt: Date.now(),
    };

    storage.set<Note>(`${NOTES_KEY_PREFIX}${id}`, updated);
    return updated;
  },

  /** Notu sil */
  delete(id: string): boolean {
    if (!storage.contains(`${NOTES_KEY_PREFIX}${id}`)) return false;

    storage.delete(`${NOTES_KEY_PREFIX}${id}`);

    const index = storage.get<string[]>(NOTE_INDEX_KEY) || [];
    storage.set(
      NOTE_INDEX_KEY,
      index.filter(i => i !== id),
    );

    return true;
  },

  /** Kategori ID'sine göre filtrele */
  getByCategory(categoryId: string): Note[] {
    return this.getAll().filter(n => n.categoryId === categoryId);
  },

  /** Metin araması (basit contains) */
  search(query: string): Note[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(
      n =>
        n.title.toLowerCase().includes(lowerQuery) ||
        n.content.toLowerCase().includes(lowerQuery),
    );
  },

  /** Not sayısını getir */
  count(): number {
    const index = storage.get<string[]>(NOTE_INDEX_KEY) || [];
    return index.length;
  },

  /** Tüm notları export et (backup için) */
  exportAll(): Note[] {
    return this.getAll();
  },

  /** Notları import et (backup restore) */
  importAll(notes: Note[]): void {
    this.clearAll();

    const index: string[] = [];
    for (const note of notes) {
      storage.set<Note>(`${NOTES_KEY_PREFIX}${note.id}`, note);
      index.push(note.id);
    }
    storage.set(NOTE_INDEX_KEY, index);
  },

  /** Tüm notları sil */
  clearAll(): void {
    const index = storage.get<string[]>(NOTE_INDEX_KEY) || [];
    for (const id of index) {
      storage.delete(`${NOTES_KEY_PREFIX}${id}`);
    }
    storage.set(NOTE_INDEX_KEY, []);
  },
};
