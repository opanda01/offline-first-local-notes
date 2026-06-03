import { useState, useCallback } from 'react';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { cryptoService } from '@/shared/lib/crypto-lib';
import { noteRepository } from '@/entities/note';
import { categoryRepository } from '@/entities/category';
import type { BackupData, EncryptedBackupFile } from './types';

export interface ExportResult {
  success: boolean;
  noteCount?: number;
  error?: string;
}

export function useExportBackup() {
  const [isExporting, setIsExporting] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const startExport = useCallback(() => {
    setShowPasswordDialog(true);
  }, []);

  const cancelExport = useCallback(() => {
    setShowPasswordDialog(false);
  }, []);

  const executeExport = useCallback(async (password: string): Promise<ExportResult> => {
    setIsExporting(true);
    try {
      const notes = noteRepository.exportAll();
      const categories = categoryRepository.getAll();

      const backupData: BackupData = {
        appId: 'offline-first-local-notes',
        version: 1,
        exportedAt: new Date().toISOString(),
        notes,
        categories,
        meta: { noteCount: notes.length, categoryCount: categories.length },
      };

      const plaintext = JSON.stringify(backupData);
      const encrypted = cryptoService.encrypt(plaintext, password);

      const backupFile: EncryptedBackupFile = {
        type: 'encrypted-backup',
        version: 1,
        payload: encrypted,
        salt: encrypted.salt,
        exportedAt: backupData.exportedAt,
      };

      const fileContent = JSON.stringify(backupFile, null, 2);
      const dateStr = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const fileName = `notes-backup-${dateStr}.json`;
      const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      await RNFS.writeFile(filePath, fileContent, 'utf8');


      await Share.open({
        url: `file://${filePath}`,
        type: 'application/json',
        title: 'Export Backup',
        failOnCancel: false,
      });

      return { success: true, noteCount: notes.length };
    } catch (error: any) {
      return { success: false, error: error.message || 'Export failed' };
    } finally {
      setIsExporting(false);
      setShowPasswordDialog(false);
    }
  }, []);

  return { startExport, cancelExport, executeExport, isExporting, showPasswordDialog };
}
