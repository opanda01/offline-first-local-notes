import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
  Text,
  Alert,
  Pressable,
} from 'react-native';
import {useEditNote} from '../model/useEditNote';
import {DeleteConfirmDialog} from './DeleteConfirmDialog';
import {NoteActions} from './NoteActions';
import {categoryRepository} from '@/entities/category';
import {CategorySelectionModal} from '@/features/category-management';
import {ChecklistEditor} from '@/features/checklist-note';
import {Button, Icon} from '@/shared/ui';
import {colors, spacing, typography, borderRadius} from '@/shared/config';
import {formatRelativeTime, getWordCount, NOTE_COLOR_PALETTE, type NoteType} from '@/entities/note';

interface EditNoteFormProps {
  noteId: string;
  onSaved?: () => void;
  onDeleted?: () => void;
  onBack?: () => void;
}

export function EditNoteForm({
  noteId,
  onSaved,
  onDeleted,
  onBack,
}: EditNoteFormProps): React.JSX.Element {
  const {
    note,
    title,
    setTitle,
    content,
    setContent,
    noteType,
    setNoteType,
    checklistItems,
    setChecklistItems,
    noteColor,
    setNoteColor,
    categoryId,
    changeCategory,
    saveChanges,
    deleteNote,
    toggleFavorite,
    togglePin,
    hasChanges,
    isLoading,
  } = useEditNote(noteId);

  const currentCategory = categoryId ? categoryRepository.getById(categoryId) : null;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Unsaved changes guard
  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'Are you sure you want to discard your changes?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Discard', style: 'destructive', onPress: onBack},
        ],
      );
    } else {
      onBack?.();
    }
  };

  const handlePreSave = () => {
    setIsModalVisible(true);
  };

  const handleConfirmSave = () => {
    if (!hasChanges) {
      setIsModalVisible(false);
      onSaved?.();
      return;
    }
    const result = saveChanges();
    if (result.success) {
      setIsModalVisible(false);
      onSaved?.();
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleDeleteConfirm = () => {
    setIsDeleteDialogOpen(false);
    if (deleteNote()) {
      onDeleted?.();
    }
  };

  if (isLoading || !note) {
    return <View style={styles.container} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appTitle}>Secret Note</Text>
        </View>
        <View style={styles.headerActions}>
          <NoteActions
            isFavorite={note.isFavorite}
            isPinned={note.isPinned}
            onToggleFavorite={toggleFavorite}
            onTogglePin={togglePin}
            onDelete={() => setIsDeleteDialogOpen(true)}
          />
          <View style={styles.gap} />
          <Button
            label="Save"
            onPress={handlePreSave}
            variant="primary"
            size="sm"
          />
          <View style={styles.gap} />
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-left" size="sm" color={colors.background} />
          </Pressable>
        </View>
      </View>

      <View style={styles.metaHeader}>
        <View style={styles.categoryBadgeContainer}>
          <Text style={styles.categoryLabel}>Category:</Text>
          <Text
            style={styles.categoryBadge}
            onPress={() => setIsModalVisible(true)}>
            {currentCategory ? `${currentCategory.icon || '📁'} ${currentCategory.name}` : '📁 Uncategorized'}
          </Text>
        </View>
      </View>

      <View style={styles.colorRow}>
        <Pressable
          onPress={() => setNoteColor(undefined)}
          style={[styles.colorSwatch, styles.colorClear, !noteColor && styles.colorSwatchActive]}>
          <Text style={styles.colorClearText}>None</Text>
        </Pressable>
        {NOTE_COLOR_PALETTE.map(color => (
          <Pressable
            key={color}
            onPress={() => setNoteColor(color)}
            style={[
              styles.colorSwatch,
              {backgroundColor: color},
              noteColor === color && styles.colorSwatchActive,
            ]}
          />
        ))}
      </View>

      {note?.labels && note.labels.length > 0 && (
        <View style={styles.labelsRow}>
          {note.labels.map(label => (
            <Text key={label} style={styles.labelChip}>
              #{label}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.typeRow}>
        {(['text', 'checklist'] as NoteType[]).map(type => (
          <Pressable
            key={type}
            onPress={() => setNoteType(type)}
            style={[styles.typeChip, noteType === type && styles.typeChipActive]}>
            <Text style={[styles.typeChipText, noteType === type && styles.typeChipTextActive]}>
              {type === 'text' ? 'Text' : 'Checklist'}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        placeholderTextColor={colors.textDisabled}
        value={title}
        onChangeText={setTitle}
        selectionColor={colors.accent}
      />

      <View style={styles.inputWrapper}>
        {noteType === 'checklist' ? (
          <ChecklistEditor items={checklistItems} onChange={setChecklistItems} />
        ) : (
          <TextInput
            style={styles.input}
            multiline
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
            selectionColor={colors.accent}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.metaText}>
          Last edited {formatRelativeTime(note.updatedAt)} •{' '}
          {getWordCount(content)} words
        </Text>
      </View>

      <DeleteConfirmDialog
        visible={isDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />

      <CategorySelectionModal
        visible={isModalVisible}
        selectedCategoryId={categoryId}
        onSelectCategory={changeCategory}
        onConfirm={handleConfirmSave}
        onCancel={() => setIsModalVisible(false)}
        confirmLabel="Save Changes"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: colors.accent, // Canlı bir renk
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaHeader: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorSwatchActive: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  colorClear: {
    width: 'auto',
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  colorClearText: {
    color: colors.textSecondary,
    fontSize: typography.caption.fontSize,
  },
  labelsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  labelChip: {
    color: colors.accent,
    fontSize: typography.caption.fontSize,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  typeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  typeChipText: {
    color: colors.textSecondary,
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
  typeChipTextActive: {
    color: colors.background,
  },
  appTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gap: {
    width: spacing.md,
  },
  categoryBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  categoryBadge: {
    fontSize: typography.body.fontSize,
    fontWeight: 'bold',
    color: colors.primary,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  titleInput: {
    marginTop: spacing.sm,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold',
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    padding: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.primary,
  },
  footer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metaText: {
    color: colors.textDisabled,
    fontSize: typography.caption.fontSize,
    textAlign: 'right',
  },
});
