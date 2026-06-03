/**
 * Category Entity — Public API
 * @module entities/category
 */

// Model
export type {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from './model/types';

// Repository
export {categoryRepository} from './api/categoryRepository';

// Helpers
export {
  CATEGORY_COLORS,
  DEFAULT_CATEGORIES,
  generateCategoryId,
  getNextColor,
} from './lib/categoryHelpers';
