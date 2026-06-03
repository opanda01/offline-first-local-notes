import type {EncryptedPayload} from '@/shared/lib/crypto-lib';
import type {Note} from '@/entities/note';
import type {Category} from '@/entities/category';

export interface BackupData {
  appId: 'offline-first-local-notes';
  version: 1;
  exportedAt: string;
  notes: Note[];
  categories: Category[];
  meta: {
    noteCount: number;
    categoryCount: number;
  };
}

export interface EncryptedBackupFile {
  type: 'encrypted-backup';
  version: 1;
  payload: EncryptedPayload;
  salt: string;
  exportedAt: string;
}
