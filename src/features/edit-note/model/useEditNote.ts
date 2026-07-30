import {useState, useCallback, useEffect} from 'react';
import {
  noteRepository,
  syncChecklistContent,
  type Note,
  type NoteType,
  type ChecklistItem,
} from '@/entities/note';

export interface UseEditNoteReturn {
  note: Note | null;
  title: string;
  setTitle: (text: string) => void;
  content: string;
  setContent: (text: string) => void;
  noteType: NoteType;
  setNoteType: (type: NoteType) => void;
  checklistItems: ChecklistItem[];
  setChecklistItems: (items: ChecklistItem[]) => void;
  noteColor?: string;
  setNoteColor: (color: string | undefined) => void;
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
  const [noteType, setNoteType] = useState<NoteType>('text');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [noteColor, setNoteColor] = useState<string | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedNote = noteRepository.getById(noteId);
    if (loadedNote) {
      setNote(loadedNote);
      setTitle(loadedNote.title || '');
      setContent(loadedNote.content);
      setNoteType(loadedNote.noteType ?? 'text');
      setChecklistItems(loadedNote.checklistItems ?? []);
      setNoteColor(loadedNote.color);
      setCategoryId(loadedNote.categoryId);
    }
    setIsLoading(false);
  }, [noteId]);

  const saveChanges = useCallback(() => {
    if (!note) return {success: false, error: 'Note not found'};

    if (noteType === 'checklist') {
      const filledItems = checklistItems.filter(item => item.text.trim().length > 0);
      if (filledItems.length === 0) {
        return {success: false, error: 'Add at least one checklist item'};
      }
      try {
        const updated = noteRepository.update(noteId, {
          title: title.trim() || undefined,
          content: syncChecklistContent(filledItems),
          noteType: 'checklist',
          checklistItems: filledItems,
          categoryId,
          color: noteColor,
        });
        if (updated) {
          setNote(updated);
          return {success: true};
        }
        return {success: false, error: 'Failed to update note'};
      } catch {
        return {success: false, error: 'Unknown error'};
      }
    }

    const trimmed = content.trim();
    if (!trimmed) return {success: false, error: 'Content cannot be empty'};

    try {
      const updated = noteRepository.update(noteId, {
        title: title.trim() || undefined,
        content: trimmed,
        noteType: 'text',
        categoryId,
        color: noteColor,
      });
      if (updated) {
        setNote(updated);
        return {success: true};
      }
      return {success: false, error: 'Failed to update note'};
    } catch {
      return {success: false, error: 'Unknown error'};
    }
  }, [note, noteId, title, content, noteType, checklistItems, categoryId, noteColor]);

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

  const hasChanges = note
    ? title !== (note.title || '') ||
      content !== note.content ||
      categoryId !== note.categoryId ||
      noteColor !== note.color ||
      noteType !== (note.noteType ?? 'text') ||
      JSON.stringify(checklistItems) !== JSON.stringify(note.checklistItems ?? [])
    : false;

  return {
    note,
    title,
    setTitle,
    content,
    setContent,
    noteType,
    setNoteType,
    checklistItems,
    setChecklistItems,
    noteColor,
    setNoteColor,
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
