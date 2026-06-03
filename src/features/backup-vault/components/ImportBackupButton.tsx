import React from 'react';
import {Alert, View} from 'react-native';
import {SettingsRow} from '@/shared/ui';
import {useImportBackup} from '../model/useImportBackup';
import {PasswordDialog} from './PasswordDialog';

export function ImportBackupButton(): React.JSX.Element {
  const {startImport, cancelImport, executeImport, isImporting, showPasswordDialog} = useImportBackup();

  const handlePasswordSubmit = async (password: string) => {
    const result = await executeImport(password);
    if (result.success) {
      Alert.alert('Success', `Successfully restored ${result.noteCount} notes.`);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handlePress = () => {
    Alert.alert(
      'Warning',
      'Importing a backup will overwrite all your current notes. Are you sure you want to continue?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Continue', style: 'destructive', onPress: startImport},
      ]
    );
  };

  return (
    <View>
      <SettingsRow
        label="Import Encrypted Backup"
        icon="import"
        onPress={handlePress}
      />
      <PasswordDialog
        visible={showPasswordDialog}
        mode="import"
        isLoading={isImporting}
        onCancel={cancelImport}
        onSubmit={handlePasswordSubmit}
      />
    </View>
  );
}


