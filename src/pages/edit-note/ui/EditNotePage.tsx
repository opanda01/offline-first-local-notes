import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation, useRoute, type RouteProp} from '@react-navigation/native';
import {EditNoteForm} from '@/features/edit-note';
import type {VaultStackParamList} from '@/app/navigation/types';

type EditNoteRouteProps = RouteProp<VaultStackParamList, 'EditNote'>;

export function EditNotePage(): React.JSX.Element {
  const route = useRoute<EditNoteRouteProps>();
  const navigation = useNavigation();
  const {noteId} = route.params;

  const handleSaved = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleDeleted = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <EditNoteForm
        noteId={noteId}
        onSaved={handleSaved}
        onDeleted={handleDeleted}
        onBack={handleBack}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
