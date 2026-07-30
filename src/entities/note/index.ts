/**
 * Note Entity — Public API
 * @module entities/note
 */

// Model
export type {
  Note,
  CreateNoteDTO,
  UpdateNoteDTO,
  NoteSortOptions,
  NoteSortField,
  SortDirection,
  NoteType,
  ChecklistItem,
  VaultListFilter,
} from './model/types';

// Repository
export {noteRepository} from './api/noteRepository';

// Helpers
export {
  generateNoteId,
  extractTitle,
  sortNotes,
  formatRelativeTime,
  getContentPreview,
  getWordCount,
  normalizeNote,
  extractLabelsFromText,
  syncChecklistContent,
  parseChecklistFromContent,
  NOTE_COLOR_PALETTE,
} from './lib/noteHelpers';
