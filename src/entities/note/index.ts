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
} from './lib/noteHelpers';
