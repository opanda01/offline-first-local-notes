import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import type {VaultListFilter} from '@/entities/note';
import {colors, spacing, borderRadius, typography} from '@/shared/config';

interface VaultQuickFiltersProps {
  activeFilter: VaultListFilter;
  onChange: (filter: VaultListFilter) => void;
}

const FILTERS: {id: VaultListFilter; label: string}[] = [
  {id: 'all', label: 'All'},
  {id: 'pinned', label: 'Pinned'},
  {id: 'favorites', label: 'Favorites'},
];

export function VaultQuickFilters({
  activeFilter,
  onChange,
}: VaultQuickFiltersProps): React.JSX.Element {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      {FILTERS.map(filter => {
        const selected = activeFilter === filter.id;
        return (
          <Pressable
            key={filter.id}
            onPress={() => onChange(filter.id)}
            style={[styles.chip, selected && styles.chipSelected]}>
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: colors.background,
  },
});
