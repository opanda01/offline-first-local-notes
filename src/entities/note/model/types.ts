/**
 * Note Entity — Domain Model
 * @module entities/note
 */

export interface Note {
  /** Benzersiz tanımlayıcı (UUID v4 formatı veya benzeri) */
  id: string;

  /** Not başlığı (ilk satırdan otomatik çıkarılabilir veya özel tanımlı) */
  title: string;

  /** Not içeriği (plaintext) */
  content: string;

  /** Kategori ID'si (opsiyonel) */
  categoryId?: string;

  /** Oluşturulma zamanı (Unix timestamp ms) */
  createdAt: number;

  /** Son güncelleme zamanı (Unix timestamp ms) */
  updatedAt: number;

  /** Favori durumu */
  isFavorite: boolean;

  /** Sabitlenmiş durum (vault'ta veya listede üstte gösterilir) */
  isPinned: boolean;
}

/** Not oluşturmak için gerekli minimum veri */
export type CreateNoteDTO = Pick<Note, 'content'> & Partial<Pick<Note, 'title' | 'categoryId'>>;

/** Not güncellemek için izin verilen alanlar */
export type UpdateNoteDTO = Partial<Pick<Note, 'title' | 'content' | 'categoryId' | 'isFavorite' | 'isPinned'>>;

/** Not sıralama seçenekleri */
export type NoteSortField = 'createdAt' | 'updatedAt' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface NoteSortOptions {
  field: NoteSortField;
  direction: SortDirection;
}
