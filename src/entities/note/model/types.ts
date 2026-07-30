/**
 * Note Entity — Domain Model
 * @module entities/note
 */

export type NoteType = 'text' | 'checklist';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  indentLevel?: number;
}

export interface Note {
  /** Benzersiz tanımlayıcı (UUID v4 formatı veya benzeri) */
  id: string;

  /** Not başlığı (ilk satırdan otomatik çıkarılabilir veya özel tanımlı) */
  title: string;

  /** Not içeriği (plaintext) */
  content: string;

  /** Metin veya checklist notu */
  noteType?: NoteType;

  /** Checklist maddeleri (noteType === 'checklist') */
  checklistItems?: ChecklistItem[];

  /** Not kart rengi (hex) */
  color?: string;

  /** Keep-style #etiketler */
  labels?: string[];

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
export type CreateNoteDTO = Pick<Note, 'content'> &
  Partial<
    Pick<
      Note,
      | 'title'
      | 'categoryId'
      | 'noteType'
      | 'checklistItems'
      | 'color'
      | 'labels'
    >
  >;

/** Not güncellemek için izin verilen alanlar */
export type UpdateNoteDTO = Partial<
  Pick<
    Note,
    | 'title'
    | 'content'
    | 'categoryId'
    | 'isFavorite'
    | 'isPinned'
    | 'noteType'
    | 'checklistItems'
    | 'color'
    | 'labels'
  >
>;

/** Not sıralama seçenekleri */
export type NoteSortField = 'createdAt' | 'updatedAt' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface NoteSortOptions {
  field: NoteSortField;
  direction: SortDirection;
}

export type VaultListFilter = 'all' | 'pinned' | 'favorites';
