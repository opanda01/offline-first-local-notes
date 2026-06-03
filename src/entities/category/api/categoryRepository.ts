/**
 * Category Entity — Repository
 * @module entities/category
 */

import {storage} from '@/shared/lib/mmkv-storage';
import type {Category, CreateCategoryDTO, UpdateCategoryDTO} from '../model/types';
import {generateCategoryId, getNextColor} from '../lib/categoryHelpers';

const CATEGORIES_KEY_PREFIX = 'category:';
const CATEGORY_INDEX_KEY = 'category:__index__';

/**
 * Category Repository — MMKV üzerinde CRUD operasyonları.
 */
export const categoryRepository = {
  /** Yeni kategori oluştur */
  create(dto: CreateCategoryDTO): Category {
    const allCategories = this.getAll();
    const usedColors = allCategories.map(c => c.color);
    
    const category: Category = {
      id: generateCategoryId(),
      name: dto.name,
      color: dto.color || getNextColor(usedColors),
      icon: dto.icon,
      sortOrder: allCategories.length,
      createdAt: Date.now(),
      parentId: dto.parentId,
    };

    // Kategoriyi kaydet
    storage.set<Category>(`${CATEGORIES_KEY_PREFIX}${category.id}`, category);

    // Index'e ekle
    const index = storage.get<string[]>(CATEGORY_INDEX_KEY) || [];
    index.push(category.id);
    storage.set(CATEGORY_INDEX_KEY, index);

    return category;
  },

  /** ID ile kategori getir */
  getById(id: string): Category | null {
    return storage.get<Category>(`${CATEGORIES_KEY_PREFIX}${id}`);
  },

  /** Tüm kategorileri getir (sortOrder'a göre sıralı) */
  getAll(): Category[] {
    const index = storage.get<string[]>(CATEGORY_INDEX_KEY) || [];
    const categories = index
      .map(id => storage.get<Category>(`${CATEGORIES_KEY_PREFIX}${id}`))
      .filter((c): c is Category => c !== null);

    return categories.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  /** Kategoriyi güncelle */
  update(id: string, dto: UpdateCategoryDTO): Category | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const updated: Category = {
      ...existing,
      ...dto,
    };

    storage.set<Category>(`${CATEGORIES_KEY_PREFIX}${id}`, updated);
    return updated;
  },

  /** Kategoriyi sil */
  delete(id: string): boolean {
    if (!storage.contains(`${CATEGORIES_KEY_PREFIX}${id}`)) return false;

    storage.delete(`${CATEGORIES_KEY_PREFIX}${id}`);

    const index = storage.get<string[]>(CATEGORY_INDEX_KEY) || [];
    storage.set(
      CATEGORY_INDEX_KEY,
      index.filter(i => i !== id),
    );

    return true;
  },

  /** Kategorileri yeniden sırala */
  reorder(orderedIds: string[]): void {
    const categories = this.getAll();
    
    // Her bir kategorinin sortOrder'ını güncelle
    categories.forEach(category => {
      const newOrder = orderedIds.indexOf(category.id);
      if (newOrder !== -1 && category.sortOrder !== newOrder) {
        this.update(category.id, { sortOrder: newOrder });
      }
    });
  },

  /** Kategori sayısını getir */
  count(): number {
    const index = storage.get<string[]>(CATEGORY_INDEX_KEY) || [];
    return index.length;
  },

  /** Tüm kategorileri export et (backup için) */
  exportAll(): Category[] {
    return this.getAll();
  },

  /** Kategorileri import et (backup restore) */
  importAll(categories: Category[]): void {
    this.clearAll();

    const index: string[] = [];
    for (const category of categories) {
      storage.set<Category>(`${CATEGORIES_KEY_PREFIX}${category.id}`, category);
      index.push(category.id);
    }
    storage.set(CATEGORY_INDEX_KEY, index);
  },

  /** Tüm kategorileri sil */
  clearAll(): void {
    const index = storage.get<string[]>(CATEGORY_INDEX_KEY) || [];
    for (const id of index) {
      storage.delete(`${CATEGORIES_KEY_PREFIX}${id}`);
    }
    storage.set(CATEGORY_INDEX_KEY, []);
  },
};
