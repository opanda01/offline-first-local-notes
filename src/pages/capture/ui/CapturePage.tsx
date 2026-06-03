import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AddNoteForm} from '@/features/add-note';

export function CapturePage(): React.JSX.Element {
  const navigation = useNavigation<any>();

  const handleNoteSaved = useCallback((noteId: string) => {
    // Optionally navigate to vault or just stay on Capture page and reset
    // For now we'll just let it stay on CapturePage and start a new note.
    // If we wanted to go to Vault: navigation.navigate('VaultTab');
  }, []);

  return (
    <View style={styles.container}>
      <AddNoteForm onNoteSaved={handleNoteSaved} autoFocus />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
