import React, {useEffect} from 'react';
import {Alert, View} from 'react-native';
import {Button} from '@/shared/ui';
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
      <Button
        label="Export Encrypted Backup"
        variant="secondary"
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
