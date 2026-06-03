import {useState, useCallback} from 'react';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import {cryptoService} from '@/shared/lib/crypto-lib';
import {noteRepository} from '@/entities/note';
import {categoryRepository} from '@/entities/category';
import type {BackupData, EncryptedBackupFile} from './types';

export interface ImportResult {
  success: boolean;
  noteCount?: number;
  error?: string;
}

export function useImportBackup() {
  const [isImporting, setIsImporting] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedFileUri, setSelectedFileUri] = useState<string | null>(null);

  const startImport = useCallback(async (): Promise<void> => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.json, DocumentPicker.types.allFiles],
      });
      setSelectedFileUri(result.uri);
      setShowPasswordDialog(true);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('File pick error', err);
      }
    }
  }, []);

  const cancelImport = useCallback(() => {
    setShowPasswordDialog(false);
    setSelectedFileUri(null);
  }, []);

  const executeImport = useCallback(
    async (password: string): Promise<ImportResult> => {
      if (!selectedFileUri) {
        return {success: false, error: 'No file selected'};
      }

      setIsImporting(true);
      try {
        const fileContent = await RNFS.readFile(selectedFileUri, 'utf8');
        const backupFile: EncryptedBackupFile = JSON.parse(fileContent);

        if (backupFile.type !== 'encrypted-backup' || backupFile.version !== 1) {
          throw new Error('Invalid backup file format');
        }

        const plaintext = cryptoService.decrypt(backupFile.payload, password);
        const backupData: BackupData = JSON.parse(plaintext);

        if (backupData.appId !== 'offline-first-local-notes') {
          throw new Error('Invalid backup data content');
        }

        noteRepository.importAll(backupData.notes);
        categoryRepository.importAll(backupData.categories);

        return {success: true, noteCount: backupData.meta.noteCount};
      } catch (error: any) {
        return {success: false, error: error.message || 'Import failed. Incorrect password or corrupt file.'};
      } finally {
        setIsImporting(false);
        setShowPasswordDialog(false);
        setSelectedFileUri(null);
      }
    },
    [selectedFileUri],
  );

  return {startImport, cancelImport, executeImport, isImporting, showPasswordDialog};
}
