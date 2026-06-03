import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {AddNoteForm} from '@/features/add-note';

export function CapturePage(): React.JSX.Element {
  const handleNoteSaved = useCallback(() => {
    // Optionally navigate to vault or just stay on Capture page and reset
    // For now we'll just let it stay on CapturePage and start a new note.
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
