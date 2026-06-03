/**
 * Category Entity — Helpers & Constants
 * @module entities/category
 */

import type {CreateCategoryDTO} from '../model/types';

/** Önceden tanımlı renk paleti (kullanıcı yeni kategori oluştururken) */
export const CATEGORY_COLORS: string[] = [
  '#FF6B6B', // Kırmızı
  '#4ECDC4', // Teal
  '#45B7D1', // Mavi
  '#96CEB4', // Yeşil
  '#FFEAA7', // Sarı
  '#DDA0DD', // Mor
  '#FF8A65', // Turuncu
  '#81C784', // Açık Yeşil
];

/** Varsayılan kategoriler (ilk çalıştırmada seed) */
export const DEFAULT_CATEGORIES: CreateCategoryDTO[] = [
  {name: 'Personal', color: '#4ECDC4', icon: '👤'},
  {name: 'Work', color: '#45B7D1', icon: '💼'},
  {name: 'Ideas', color: '#FFEAA7', icon: '💡'},
];

/**
 * UUID v4 benzeri benzersiz kategori ID'si üretir.
 */
export function generateCategoryId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Bir sonraki kullanılabilir rengi getirir.
 * Eğer hepsi kullanılmışsa başa döner.
 */
export function getNextColor(usedColors: string[]): string {
  const available = CATEGORY_COLORS.filter(c => !usedColors.includes(c));
  if (available.length > 0) {
    return available[0];
  }
  // Eğer tüm renkler kullanılmışsa rastgele bir renk dön
  return CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)];
}
