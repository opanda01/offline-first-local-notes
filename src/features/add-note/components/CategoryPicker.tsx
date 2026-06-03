/**
 * Add Note Feature — Category Picker UI
 * @module features/add-note
 */

import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, Pressable, View, TextInput, Alert} from 'react-native';
import {categoryRepository, type Category} from '@/entities/category';
import {colors, spacing, borderRadius, typography} from '@/shared/config';
import {Icon} from '@/shared/ui';

interface CategoryPickerProps {
  selectedId?: string;
  onSelect: (categoryId: string | undefined) => void;
  visible?: boolean;
}

export function CategoryPicker({selectedId, onSelect, visible}: CategoryPickerProps): React.JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [addingParentId, setAddingParentId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCategories(newExpanded);
  };

  const refreshCategories = () => {
    setCategories(categoryRepository.getAll());
  };

  useEffect(() => {
    refreshCategories();
  }, [visible]);

  const handleAddCategory = (parentId?: string) => {
    const trimmed = newCategoryName.trim();
    if (trimmed) {
      const newCat = categoryRepository.create({
        name: trimmed,
        parentId,
      });
      refreshCategories();
      onSelect(newCat.id);
    }
    setAddingParentId(null);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (cat: Category) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${cat.name}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            categoryRepository.delete(cat.id);
            if (selectedId === cat.id) {
              onSelect(undefined);
            }
            refreshCategories();
          },
        },
      ],
      {cancelable: true},
    );
  };

  const rootCategories = categories.filter(c => !c.parentId);
  const getChildren = (parentId: string) => categories.filter(c => c.parentId === parentId);

  const renderAddInput = (parentId?: string) => {
    return (
      <View style={[styles.itemContainer, parentId ? styles.indent : null, styles.addInputRow]}>
        <TextInput
          style={styles.addInput}
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          onSubmitEditing={() => handleAddCategory(parentId)}
          placeholder={parentId ? "Subcategory name..." : "List name..."}
          placeholderTextColor={colors.textDisabled}
          autoFocus
        />
        <Pressable onPress={() => handleAddCategory(parentId)} style={styles.addConfirmBtn}>
          <Text style={styles.addConfirmBtnText}>ADD</Text>
        </Pressable>
        <Pressable onPress={() => { setAddingParentId(null); setNewCategoryName(''); }} style={styles.addCancelBtn}>
          <Text style={styles.addCancelBtnText}>X</Text>
        </Pressable>
      </View>
    );
  };

  const renderCategory = (cat: Category, level: number = 0) => {
    const isSelected = selectedId === cat.id;
    const children = getChildren(cat.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedCategories.has(cat.id);

    return (
      <View key={cat.id}>
        <View style={[styles.itemRow, {marginLeft: level * spacing.lg}]}>
          <Pressable 
            onPress={() => toggleExpand(cat.id)}
            style={styles.expandIconContainer}>
            {hasChildren ? (
              <Icon name={isExpanded ? "chevron-down" : "chevron-right"} size="sm" color={colors.textSecondary} />
            ) : (
              <View style={styles.expandIconPlaceholder} />
            )}
          </Pressable>

          <Pressable
            onLongPress={() => handleDeleteCategory(cat)}
            onPress={() => {
              onSelect(cat.id);
              if (!isExpanded && hasChildren) toggleExpand(cat.id);
            }}
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
          
          {/* Add Subcategory Button (visible only if parent is selected to avoid clutter) */}
          {isSelected && addingParentId !== cat.id && (
             <Pressable
               onPress={() => {
                 setAddingParentId(cat.id);
                 setNewCategoryName('');
                 if (!isExpanded) toggleExpand(cat.id);
               }}
               style={styles.addSubBtn}
             >
               <Icon name="plus" size="sm" color={colors.accent} />
             </Pressable>
          )}
        </View>

        {addingParentId === cat.id && (
          <View style={{marginLeft: (level + 1) * spacing.lg}}>
            {renderAddInput(cat.id)}
          </View>
        )}

        {isExpanded && children.map(child => renderCategory(child, level + 1))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}>
        
        {/* "No Category" chip */}
        <Pressable
          onPress={() => onSelect(undefined)}
          style={[styles.chip, !selectedId && styles.chipSelected, {marginBottom: spacing.sm}]}>
          <Text style={[styles.chipText, !selectedId && styles.chipTextSelected]}>
            No Category
          </Text>
        </Pressable>

        {/* Root Categories */}
        {rootCategories.map(cat => renderCategory(cat, 0))}

        {/* Add Root Category */}
        {addingParentId === 'root' ? (
          renderAddInput(undefined)
        ) : (
          <Pressable
            onPress={() => {
              setAddingParentId('root');
              setNewCategoryName('');
            }}
            style={[styles.chip, styles.chipAdd, {marginTop: spacing.sm}]}>
            <Text style={styles.chipTextAdd}>+ New List</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 300, // Limiting height since it's vertical now
  },
  scrollContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  itemContainer: {
    marginVertical: 4,
  },
  indent: {
    marginLeft: spacing.lg,
  },
  chip: {
    flex: 1, // Take available space
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.primary,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: typography.body.fontSize,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  chipAdd: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.textDisabled,
    alignItems: 'center',
  },
  chipTextAdd: {
    color: colors.textSecondary,
    fontSize: typography.caption.fontSize,
    fontWeight: 'bold',
  },
  addInput: {
    height: 40,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent,
    color: colors.primary,
    fontSize: typography.body.fontSize,
    backgroundColor: colors.surfaceElevated,
  },
  addSubBtn: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addSubBtnText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  expandIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  expandIconPlaceholder: {
    width: 24,
  },
  addInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addConfirmBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  addConfirmBtnText: {
    color: colors.background,
    fontSize: typography.caption.fontSize,
    fontWeight: 'bold',
  },
  addCancelBtn: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addCancelBtnText: {
    color: colors.textSecondary,
    fontSize: typography.caption.fontSize,
    fontWeight: 'bold',
  },
});
