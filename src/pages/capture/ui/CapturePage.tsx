import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AddNoteForm} from '@/features/add-note';

import {SafeAreaView} from 'react-native-safe-area-context';

export function CapturePage(): React.JSX.Element {
  const navigation = useNavigation<any>();

  const handleNoteSaved = useCallback(() => {
    navigation.navigate('VaultTab');
  }, [navigation]);

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
