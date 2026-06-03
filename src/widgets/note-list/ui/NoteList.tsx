import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {noteRepository, type Note, type NoteSortOptions} from '@/entities/note';
import {EmptyState} from '@/shared/ui';
import {spacing} from '@/shared/config';
import {NoteCard} from '../components/NoteCard';

interface NoteListProps {
  categoryId?: string;
  searchQuery?: string;
  onNotePress: (noteId: string) => void;
  sortOptions?: NoteSortOptions;
}

export function NoteList({
  categoryId,
  searchQuery,
  onNotePress,
  sortOptions,
}: NoteListProps): React.JSX.Element {
  const [notes, setNotes] = useState<Note[]>([]);

  useFocusEffect(
    useCallback(() => {
      let fetchedNotes = noteRepository.getAll(sortOptions);

      if (categoryId) {
        fetchedNotes = fetchedNotes.filter(n => n.categoryId === categoryId);
      }

      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        fetchedNotes = fetchedNotes.filter(
          n =>
            n.title.toLowerCase().includes(lowerQuery) ||
            n.content.toLowerCase().includes(lowerQuery),
        );
      }

      // Pinned notes on top
      fetchedNotes.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });

      setNotes(fetchedNotes);
    }, [categoryId, searchQuery, sortOptions]),
  );

  if (notes.length === 0) {
    return (
      <EmptyState
        icon="note-outline"
        title="No notes found"
        subtitle={searchQuery ? 'Try a different search term' : 'Create a note to get started'}
      />
    );
  }

  return (
    <FlatList
      data={notes}
      keyExtractor={item => item.id}
      renderItem={({item}) => <NoteCard note={item} onPress={onNotePress} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: spacing.md,
  },
});
