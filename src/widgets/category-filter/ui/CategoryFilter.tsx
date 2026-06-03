import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, Text, Pressable, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {categoryRepository, type Category} from '@/entities/category';
import {colors, spacing, borderRadius, typography} from '@/shared/config';

interface CategoryFilterProps {
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string | undefined) => void;
}

export function CategoryFilter({
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps): React.JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);

  useFocusEffect(
    useCallback(() => {
      setCategories(categoryRepository.getAll());
    }, []),
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <Pressable
          onPress={() => onSelectCategory(undefined)}
          style={[styles.chip, !selectedCategoryId && styles.chipSelected]}>
          <Text
            style={[
              styles.chipText,
              !selectedCategoryId && styles.chipTextSelected,
            ]}>
            All
          </Text>
        </Pressable>

        {categories.map(cat => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => onSelectCategory(cat.id)}
              style={[
                styles.chip,
                {borderColor: isSelected ? cat.color : colors.border},
                isSelected && {backgroundColor: cat.color},
              ]}>
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}>
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
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: colors.background,
  },
});
