/**
 * Add Note Feature — Business Logic Hook
 * @module features/add-note
 */

import {useState, useCallback} from 'react';
import {
  noteRepository,
  getWordCount,
  generateNoteId,
  syncChecklistContent,
  type CreateNoteDTO,
  type NoteType,
  type ChecklistItem,
} from '@/entities/note';

export interface UseAddNoteReturn {
  title: string;
  setTitle: (text: string) => void;
  content: string;
  setContent: (text: string) => void;
  noteType: NoteType;
  setNoteType: (type: NoteType) => void;
  checklistItems: ChecklistItem[];
  setChecklistItems: (items: ChecklistItem[]) => void;
  selectedCategoryId: string | undefined;
  selectCategory: (categoryId: string | undefined) => void;
  saveNote: () => SaveNoteResult;
  resetForm: () => void;
  isEmpty: boolean;
  wordCount: number;
  charCount: number;
}

export interface SaveNoteResult {
  success: boolean;
  noteId?: string;
  error?: string;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {id: generateNoteId(), text: '', checked: false, indentLevel: 0},
];

export function useAddNote(): UseAddNoteReturn {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteType, setNoteType] = useState<NoteType>('text');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();

  const saveNote = useCallback((): SaveNoteResult => {
    if (noteType === 'checklist') {
      const filledItems = checklistItems.filter(item => item.text.trim().length > 0);
      if (filledItems.length === 0) {
        return {success: false, error: 'Add at least one checklist item'};
      }
      try {
        const syncedContent = syncChecklistContent(filledItems);
        const dto: CreateNoteDTO = {
          title: title.trim() || undefined,
          content: syncedContent,
          noteType: 'checklist',
          checklistItems: filledItems,
          categoryId: selectedCategoryId,
        };
        const note = noteRepository.create(dto);
        return {success: true, noteId: note.id};
      } catch {
        return {success: false, error: 'Failed to save note'};
      }
    }

    const trimmed = content.trim();
    if (!trimmed) {
      return {success: false, error: 'Content cannot be empty'};
    }

    try {
      const dto: CreateNoteDTO = {
        title: title.trim() || undefined,
        content: trimmed,
        noteType: 'text',
        categoryId: selectedCategoryId,
      };
      const note = noteRepository.create(dto);
      return {success: true, noteId: note.id};
    } catch {
      return {success: false, error: 'Failed to save note'};
    }
  }, [title, content, noteType, checklistItems, selectedCategoryId]);

  const resetForm = useCallback(() => {
    setTitle('');
    setContent('');
    setNoteType('text');
    setChecklistItems([{id: generateNoteId(), text: '', checked: false, indentLevel: 0}]);
    setSelectedCategoryId(undefined);
  }, []);

  const displayContent =
    noteType === 'checklist' ? syncChecklistContent(checklistItems) : content;

  return {
    title,
    setTitle,
    content,
    setContent,
    noteType,
    setNoteType,
    checklistItems,
    setChecklistItems,
    selectedCategoryId,
    selectCategory: setSelectedCategoryId,
    saveNote,
    resetForm,
    isEmpty:
      noteType === 'checklist'
        ? checklistItems.every(item => !item.text.trim())
        : content.trim().length === 0,
    wordCount: getWordCount(displayContent),
    charCount: displayContent.length,
  };
}
