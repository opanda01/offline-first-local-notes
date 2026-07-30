# Secret (OfflineFirstLocalNotes) — Product Roadmap

Bu belge, mimari değerlendirme planı sonrası **tamamlanan işleri** ve **önerilen sonraki adımları** öncelik sırasıyla listeler. Güncelleme: plan implementasyonu commit’i sonrası.

## Tamamlanan (baseline)

| Alan | Durum |
|------|--------|
| Jest + crypto-js round-trip testleri | CI’da `npm test` açık |
| AES-256-CBC dokümantasyonu | `crypto.ts`, `types.ts`, README hizalı |
| Kategori silme | `deleteCascade` + notlarda `categoryId` temizliği |
| FSD | `features/category-management`, `features/index.ts` public API |
| Ölü bağımlılıklar | `bottom-tabs`, `swipe-list-view` kaldırıldı |
| Keep-parite (offline) | Checklist, not rengi, `#` etiketler, Vault pin/favori filtreleri |
| UX | Capture kayıt sonrası Vault sekmesi; `NoteStats` Settings’te |
| Spike | [spike-local-capture-extras.md](./spike-local-capture-extras.md) |

## Faz 5 — Kısa vade (1–2 hafta)

**Hedef:** Kalan P2/P3 maddeleri, ürün kalitesi, release netliği.

1. **Import / refresh**
   - Yedek içe aktarımından sonra Vault/Settings’in anında yenilenmesi (hafif event bus veya `navigation` + `key` remount).
2. **Vault sıralama UI**
   - `sortNotes` zaten var: kullanıcıya `createdAt` / `updatedAt` / `title` seçimi (Settings veya Vault header).
3. **Arama UX**
   - SearchBar’da debounce (300 ms); isteğe bağlı eşleşme vurgusu.
4. **Android gizlilik**
   - Release build için `INTERNET` iznini dokümante et veya flavor ile ayır (`debug` vs `release` manifest merge).
5. **Kategori sıralama**
   - `categoryRepository.reorder` için Category Manager’da sürükle-bırak veya yukarı/aşağı.

**Doğrulama:** Manuel export → import; büyük vault (100+ not) scroll hissi; CI yeşil.

## Faz 6 — Yakalama ve erişilebilirlik (2–4 hafta)

Detay: [spike-local-capture-extras.md](./spike-local-capture-extras.md).

| Özellik | Öncelik | Not |
|---------|---------|-----|
| Android **Share intent** (`ACTION_SEND` → Capture) | P1 | Tamamen offline |
| **Ana ekran widget** (pin’li not / checklist özeti) | P2 | Native Android + MMKV snapshot key |
| **Ses eki** (dosya yolu, oynatma) | P3 | Transkript opsiyonel, ayrı faz |
| iOS Share Extension | P4 | Ayrı Xcode target |

## Faz 7 — Gelişmiş yerel arama ve dışa aktarım (4–8 hafta)

1. **Fuse.js** veya benzeri fuzzy arama (typo toleransı).
2. **Tek not export** — Markdown / `.txt`.
3. **Yedek sürüm migrasyonu** — `BackupData.version` ile alan ekleme (checklist, labels, color).
4. **Otomatik yerel yedek** — kullanıcı onayı + zamanlama; şifreli veya cihaz kilidi (ürün kararı gerekir).

## Faz 8 — Medya (on-device, bulutsuz)

1. **Foto + OCR** — ML Kit Text Recognition; metin not gövdesine ekleme.
2. **Basit zengin metin** — kalın / liste (Keep kadar hafif; Notion değil).

## Bilinçli dışlama (Secret kimliği)

Aşağıdakiler **varsayılan ürün kapsamı dışında**; ayrı modül ve açık opt-in olmadan eklenmemeli:

- Bulut sync, hesap sistemi
- Gemini / Keep Live, bulut STT
- Gerçek zamanlı işbirlikçi düzenleme
- Google Workspace entegrasyonu

## Teknik borç backlog

| Madde | Efor |
|-------|------|
| `entities/category` → `entities/note` import (deleteCascade) — orchestration katmanı | Küçük |
| Widget → feature import (CategoryManagerModal) — FSD sıkı mod | Küçük |
| FlatList `getItemLayout` / memoized `NoteCard` | Küçük |
| `categoryRepository` + `noteRepository` integration testleri | Orta |
| Mağaza yayını (Play / App Store), imzalama, sürüm notları | Orta |

## Önerilen sıradaki sprint (tek cümle)

**Sprint 1:** Share intent (Android) + import refresh + Vault sıralama UI.

## Referanslar

- Uygulama README: [../README.md](../README.md)
- Offline capture spike: [spike-local-capture-extras.md](./spike-local-capture-extras.md)
