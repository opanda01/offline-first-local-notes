import React, {useCallback, useState} from 'react';
import {StyleSheet, Alert, TouchableOpacity, View, ScrollView, Dimensions, FlatList} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {noteRepository, type Note, type NoteSortOptions} from '@/entities/note';
import {categoryRepository} from '@/entities/category';
import {EmptyState, Icon} from '@/shared/ui';
import {colors, spacing, borderRadius} from '@/shared/config';
import {NoteCard} from '../components/NoteCard';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
// Padding is spacing.md (16) on both sides = 32
const LIST_PADDING = spacing.md * 2;
const ROW_WIDTH = SCREEN_WIDTH - LIST_PADDING;
const DELETE_BTN_WIDTH = 80;

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
        const allCategories = categoryRepository.getAll();
        const validCategoryIds = new Set<string>();
        const queue = [categoryId];
        
        while (queue.length > 0) {
          const currentId = queue.shift()!;
          validCategoryIds.add(currentId);
          const children = allCategories.filter(c => c.parentId === currentId).map(c => c.id);
          queue.push(...children);
        }

        fetchedNotes = fetchedNotes.filter(n => n.categoryId && validCategoryIds.has(n.categoryId));
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

  const handleDeleteAttempt = (note: Note) => {
    Alert.alert(
      'Delete Note',
      `Are you sure you want to delete "${note.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            noteRepository.delete(note.id);
            setNotes(prev => prev.filter(n => n.id !== note.id));
          },
        },
      ],
      {cancelable: true},
    );
  };

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
      renderItem={({item}) => (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToOffsets={[0, DELETE_BTN_WIDTH]}
          snapToEnd={false}
          decelerationRate="fast"
          contentContainerStyle={{width: ROW_WIDTH + DELETE_BTN_WIDTH}}
          style={styles.rowContainer}>
          <View style={{width: ROW_WIDTH}}>
            <NoteCard note={item} onPress={onNotePress} />
          </View>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDeleteAttempt(item)}
            activeOpacity={0.8}>
            <Icon name="delete-outline" size="md" color={colors.background} />
          </TouchableOpacity>
        </ScrollView>
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: spacing.md,
  },
  rowContainer: {
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.error,
  },
  deleteBtn: {
    width: DELETE_BTN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.error,
    borderTopRightRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
});
