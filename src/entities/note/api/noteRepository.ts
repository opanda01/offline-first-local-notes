/**
 * Note Entity — Repository
 * @module entities/note
 */

import {storage} from '@/shared/lib/mmkv-storage';
import type {Note, CreateNoteDTO, UpdateNoteDTO, NoteSortOptions} from '../model/types';
import {generateNoteId, extractTitle, sortNotes, normalizeNote, extractLabelsFromText, syncChecklistContent} from '../lib/noteHelpers';

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
    const noteType = dto.noteType ?? 'text';
    const checklistItems = dto.checklistItems;
    const labels =
      dto.labels ?? extractLabelsFromText(`${dto.title ?? ''}\n${dto.content}`);
    const content =
      noteType === 'checklist' && checklistItems
        ? syncChecklistContent(checklistItems)
        : dto.content;

    const note: Note = normalizeNote({
      id: generateNoteId(),
      title: dto.title || extractTitle(content),
      content,
      noteType,
      checklistItems,
      color: dto.color,
      labels,
      categoryId: dto.categoryId,
      createdAt: now,
      updatedAt: now,
      isFavorite: false,
      isPinned: false,
    });

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
    const raw = storage.get<Note>(`${NOTES_KEY_PREFIX}${id}`);
    return raw ? normalizeNote(raw) : null;
  },

  /** Tüm notları getir (sıralı) */
  getAll(sort?: NoteSortOptions): Note[] {
    const index = storage.get<string[]>(NOTE_INDEX_KEY) || [];
    const notes = index
      .map(id => storage.get<Note>(`${NOTES_KEY_PREFIX}${id}`))
      .filter((n): n is Note => n !== null)
      .map(normalizeNote);

    return sortNotes(notes, sort);
  },

  /** Notu güncelle */
  update(id: string, dto: UpdateNoteDTO): Note | null {
    const existing = this.getById(id);
    if (!existing) return null;

    // Yalnızca başlık veya içerik gerçekten değiştiyse tarihi güncelle
    const titleChanged = dto.title !== undefined && dto.title !== existing.title;
    const contentChanged = dto.content !== undefined && dto.content !== existing.content;
    const checklistChanged =
      dto.checklistItems !== undefined &&
      JSON.stringify(dto.checklistItems) !== JSON.stringify(existing.checklistItems);
    const shouldUpdateTimestamp = titleChanged || contentChanged || checklistChanged;

    const mergedLabels =
      dto.labels ??
      extractLabelsFromText(
        `${dto.title ?? existing.title}\n${dto.content ?? existing.content}`,
      );

    const nextType = dto.noteType ?? existing.noteType ?? 'text';
    const nextChecklist = dto.checklistItems ?? existing.checklistItems;
    const nextContent =
      dto.content !== undefined
        ? dto.content
        : nextType === 'checklist' && nextChecklist
          ? syncChecklistContent(nextChecklist)
          : existing.content;

    const updated: Note = normalizeNote({
      ...existing,
      ...dto,
      content: nextContent,
      noteType: nextType,
      checklistItems: nextChecklist,
      labels: mergedLabels,
      updatedAt: shouldUpdateTimestamp ? Date.now() : existing.updatedAt,
    });

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

  /** Metin araması (başlık, içerik, etiketler, checklist maddeleri) */
  search(query: string): Note[] {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return this.getAll();

    return this.getAll().filter(n => {
      if (n.title.toLowerCase().includes(lowerQuery)) return true;
      if (n.content.toLowerCase().includes(lowerQuery)) return true;
      if (n.labels?.some(label => label.toLowerCase().includes(lowerQuery))) {
        return true;
      }
      if (
        n.checklistItems?.some(item => item.text.toLowerCase().includes(lowerQuery))
      ) {
        return true;
      }
      return false;
    });
  },

  /** Verilen kategori id'lerine bağlı notların categoryId alanını temizler */
  clearCategoryIds(categoryIds: string[]): void {
    const idSet = new Set(categoryIds);
    const index = storage.get<string[]>(NOTE_INDEX_KEY) || [];
    for (const noteId of index) {
      const note = storage.get<Note>(`${NOTES_KEY_PREFIX}${noteId}`);
      if (note?.categoryId && idSet.has(note.categoryId)) {
        const updated = normalizeNote({...note, categoryId: undefined});
        storage.set(`${NOTES_KEY_PREFIX}${noteId}`, updated);
      }
    }
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
