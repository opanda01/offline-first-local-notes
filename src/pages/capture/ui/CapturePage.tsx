import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {AddNoteForm} from '@/features/add-note';

import {SafeAreaView} from 'react-native-safe-area-context';

export function CapturePage(): React.JSX.Element {
  const handleNoteSaved = useCallback(() => {
    // Optionally navigate to vault or just stay on Capture page and reset
    // For now we'll just let it stay on CapturePage and start a new note.
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AddNoteForm onNoteSaved={handleNoteSaved} autoFocus />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
