/**
 * Category Entity — Domain Model
 * @module entities/category
 */

export interface Category {
  /** Benzersiz tanımlayıcı */
  id: string;

  /** Kategori adı */
  name: string;

  /** Renk kodu (hex) — not kartlarında ince sol border olarak gösterilir */
  color: string;

  /** Emoji ikonu (opsiyonel) */
  icon?: string;

  /** Oluşturulma sırası (kullanıcının sıralamayı değiştirebilmesi için) */
  sortOrder: number;

  /** Oluşturulma zamanı */
  createdAt: number;
}

export type CreateCategoryDTO = Pick<Category, 'name'> &
  Partial<Pick<Category, 'color' | 'icon'>>;

export type UpdateCategoryDTO = Partial<
  Pick<Category, 'name' | 'color' | 'icon' | 'sortOrder'>
>;
