import {useState, useCallback, useEffect} from 'react';
import {noteRepository, type Note} from '@/entities/note';

export interface UseEditNoteReturn {
  note: Note | null;
  title: string;
  setTitle: (text: string) => void;
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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedNote = noteRepository.getById(noteId);
    if (loadedNote) {
      setNote(loadedNote);
      setTitle(loadedNote.title || '');
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
        title: title.trim() || undefined,
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
  }, [note, noteId, title, content, categoryId]);

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

  const hasChanges = note ? title !== (note.title || '') || content !== note.content || categoryId !== note.categoryId : false;

  return {
    note,
    title,
    setTitle,
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
