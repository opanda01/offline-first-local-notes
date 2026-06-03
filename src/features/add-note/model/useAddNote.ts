/**
 * Add Note Feature — Business Logic Hook
 * @module features/add-note
 */

import {useState, useCallback} from 'react';
import {noteRepository, getWordCount, type CreateNoteDTO} from '@/entities/note';

export interface UseAddNoteReturn {
  /** Not başlığı */
  title: string;
  /** Başlık değiştirme handler'ı */
  setTitle: (text: string) => void;
  /** Mevcut not içeriği */
  content: string;
  /** İçerik değiştirme handler'ı */
  setContent: (text: string) => void;
  /** Seçili kategori ID */
  selectedCategoryId: string | undefined;
  /** Kategori seçme handler'ı */
  selectCategory: (categoryId: string | undefined) => void;
  /** Notu kaydet */
  saveNote: () => SaveNoteResult;
  /** Formu sıfırla */
  resetForm: () => void;
  /** İçerik boş mu? */
  isEmpty: boolean;
  /** Kelime sayısı */
  wordCount: number;
  /** Karakter sayısı */
  charCount: number;
}

export interface SaveNoteResult {
  success: boolean;
  noteId?: string;
  error?: string;
}

export function useAddNote(): UseAddNoteReturn {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();

  const saveNote = useCallback((): SaveNoteResult => {
    const trimmed = content.trim();
    if (!trimmed) {
      return {success: false, error: 'Content cannot be empty'};
    }

    try {
      const dto: CreateNoteDTO = {
        title: title.trim() || undefined,
        content: trimmed,
        categoryId: selectedCategoryId,
      };
      const note = noteRepository.create(dto);
      return {success: true, noteId: note.id};
    } catch {
      return {success: false, error: 'Failed to save note'};
    }
  }, [title, content, selectedCategoryId]);

  const resetForm = useCallback(() => {
    setTitle('');
    setContent('');
    setSelectedCategoryId(undefined);
  }, []);

  return {
    title,
    setTitle,
    content,
    setContent,
    selectedCategoryId,
    selectCategory: setSelectedCategoryId,
    saveNote,
    resetForm,
    isEmpty: content.trim().length === 0,
    wordCount: getWordCount(content),
    charCount: content.length,
  };
}
