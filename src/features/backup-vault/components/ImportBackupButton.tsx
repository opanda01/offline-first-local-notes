import React from 'react';
import {Alert, View, StyleSheet} from 'react-native';
import {Button} from '@/shared/ui';
import {spacing} from '@/shared/config';
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
    <View style={styles.container}>
      <Button
        label="Import Encrypted Backup"
        variant="secondary"
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

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
  },
});
