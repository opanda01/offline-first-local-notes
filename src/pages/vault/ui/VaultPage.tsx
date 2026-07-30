import React, {useState, useCallback} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NoteList, CategoryFilter, SearchBar, VaultQuickFilters} from '@/widgets';
import {colors, spacing, typography} from '@/shared/config';
import type {VaultListFilter} from '@/entities/note';

export function VaultPage(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [listFilter, setListFilter] = useState<VaultListFilter>('all');

  const handleNotePress = useCallback(
    (noteId: string) => {
      navigation.navigate('EditNote', {noteId});
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your notes</Text>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </View>

      <View style={styles.filterContainer}>
        <VaultQuickFilters activeFilter={listFilter} onChange={setListFilter} />
        <CategoryFilter
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
      </View>

      <View style={styles.listContainer}>
        <NoteList
          categoryId={selectedCategoryId}
          searchQuery={searchQuery}
          listFilter={listFilter}
          onNotePress={handleNotePress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl, // Moved down slightly
    paddingBottom: spacing.md,
  },
  title: {
    color: colors.primary,
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight as any,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  filterContainer: {
    marginBottom: spacing.sm,
  },
  listContainer: {
    flex: 1,
  },
});
