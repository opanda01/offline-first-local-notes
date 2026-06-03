import React from 'react';
import {Alert, View} from 'react-native';
import {SettingsRow} from '@/shared/ui';
import {useExportBackup} from '../model/useExportBackup';
import {PasswordDialog} from './PasswordDialog';

export function ExportBackupButton(): React.JSX.Element {
  const {startExport, cancelExport, executeExport, isExporting, showPasswordDialog} = useExportBackup();

  const handlePasswordSubmit = async (password: string) => {
    const result = await executeExport(password);
    if (result.success) {
      Alert.alert('Success', `Successfully exported ${result.noteCount} notes.`);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <View>
      <SettingsRow
        label="Export Encrypted Backup"
        icon="export"
        onPress={startExport}
      />
      <PasswordDialog
        visible={showPasswordDialog}
        mode="export"
        isLoading={isExporting}
        onCancel={cancelExport}
        onSubmit={handlePasswordSubmit}
      />
    </View>
  );
}
