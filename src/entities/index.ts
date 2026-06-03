/**
 * Entity Layer — Public API
 *
 * Re-exports everything from the entity slices (note, category).
 * Upper layers (features, widgets, pages) should import from here.
 *
 * @module entities
 */

export {
  type Note,
  type CreateNoteDTO,
  type UpdateNoteDTO,
  type NoteSortOptions,
  type NoteSortField,
  type SortDirection,
  noteRepository,
  generateNoteId,
  extractTitle,
  sortNotes,
  formatRelativeTime,
  getContentPreview,
  getWordCount,
} from './note';

export {
  type Category,
  type CreateCategoryDTO,
  type UpdateCategoryDTO,
  categoryRepository,
  CATEGORY_COLORS,
  DEFAULT_CATEGORIES,
  generateCategoryId,
  getNextColor,
} from './category';
