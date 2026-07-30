import type {Category} from '../model/types';

/** Collects a category id and all descendant category ids. */
export function collectCategorySubtreeIds(
  rootId: string,
  categories: Category[],
): string[] {
  const ids = new Set<string>([rootId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const category of categories) {
      if (
        category.parentId &&
        ids.has(category.parentId) &&
        !ids.has(category.id)
      ) {
        ids.add(category.id);
        changed = true;
      }
    }
  }
  return Array.from(ids);
}
