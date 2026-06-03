/**
 * Add Note Feature — Category Picker UI
 * @module features/add-note
 */

import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, Pressable, View} from 'react-native';
import {categoryRepository, type Category} from '@/entities/category';
import {colors, spacing, borderRadius, typography} from '@/shared/config';

interface CategoryPickerProps {
  selectedId?: string;
  onSelect: (categoryId: string | undefined) => void;
}

export function CategoryPicker({selectedId, onSelect}: CategoryPickerProps): React.JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);

  // Not: Şimdilik basit bir useEffect ile alıyoruz.
  // Gerçek uygulamada reaktif bir store veya MMKV hook'u gerekebilir,
  // ancak şimdilik add-note ekranı açıldığında okunması yeterli.
  useEffect(() => {
    setCategories(categoryRepository.getAll());
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* "All" veya "No Category" chip'i */}
        <Pressable
          onPress={() => onSelect(undefined)}
          style={[styles.chip, !selectedId && styles.chipSelected]}>
          <Text style={[styles.chipText, !selectedId && styles.chipTextSelected]}>
            No Category
          </Text>
        </Pressable>

        {/* Kategoriler */}
        {categories.map(cat => {
          const isSelected = selectedId === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => onSelect(cat.id)}
              style={[
                styles.chip,
                {borderLeftColor: cat.color, borderLeftWidth: 4},
                isSelected && styles.chipSelected,
              ]}>
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {cat.icon ? `${cat.icon} ` : ''}
                {cat.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: colors.primary,
  },
});
