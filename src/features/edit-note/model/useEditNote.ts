import {useState, useCallback, useEffect} from 'react';
import {noteRepository, type Note} from '@/entities/note';

export interface UseEditNoteReturn {
  note: Note | null;
  content: string;
  setContent: (text: string) => void;
  categoryId: string | undefined;
  changeCategory: (categoryId: string | undefined) => void;
  saveChanges: () => {success: boolean; error?: string};
  deleteNote: () => boolean;
  toggleFavorite: () => void;
  togglePin: () => void;
  hasChanges: boolean;
  isLoading: boolean;
}

export function useEditNote(noteId: string): UseEditNoteReturn {
  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedNote = noteRepository.getById(noteId);
    if (loadedNote) {
      setNote(loadedNote);
      setContent(loadedNote.content);
      setCategoryId(loadedNote.categoryId);
    }
    setIsLoading(false);
  }, [noteId]);

  const saveChanges = useCallback(() => {
    if (!note) return {success: false, error: 'Note not found'};
    const trimmed = content.trim();
    if (!trimmed) return {success: false, error: 'Content cannot be empty'};

    try {
      const updated = noteRepository.update(noteId, {
        content: trimmed,
        categoryId,
      });
      if (updated) {
        setNote(updated);
        return {success: true};
      }
      return {success: false, error: 'Failed to update note'};
    } catch {
      return {success: false, error: 'Unknown error'};
    }
  }, [note, noteId, content, categoryId]);

  const deleteNote = useCallback(() => {
    return noteRepository.delete(noteId);
  }, [noteId]);

  const toggleFavorite = useCallback(() => {
    if (!note) return;
    const updated = noteRepository.update(noteId, {
      isFavorite: !note.isFavorite,
    });
    if (updated) setNote(updated);
  }, [note, noteId]);

  const togglePin = useCallback(() => {
    if (!note) return;
    const updated = noteRepository.update(noteId, {
      isPinned: !note.isPinned,
    });
    if (updated) setNote(updated);
  }, [note, noteId]);

  const hasChanges = note ? content !== note.content || categoryId !== note.categoryId : false;

  return {
    note,
    content,
    setContent,
    categoryId,
    changeCategory: setCategoryId,
    saveChanges,
    deleteNote,
    toggleFavorite,
    togglePin,
    hasChanges,
    isLoading,
  };
}
