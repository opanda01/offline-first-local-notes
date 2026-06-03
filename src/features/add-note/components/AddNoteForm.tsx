import React, {useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
  Text,
} from 'react-native';
import {useAddNote} from '../model/useAddNote';
import {CategorySelectionModal} from './CategorySelectionModal';
import {CharacterCounter} from './CharacterCounter';
import {Button} from '@/shared/ui';
import {colors, spacing, typography} from '@/shared/config';

interface AddNoteFormProps {
  onNoteSaved?: (noteId: string) => void;
  autoFocus?: boolean;
}

export function AddNoteForm({
  onNoteSaved,
  autoFocus = true,
}: AddNoteFormProps): React.JSX.Element {
  const {
    title,
    setTitle,
    content,
    setContent,
    selectedCategoryId,
    selectCategory,
    saveNote,
    resetForm,
    wordCount,
    charCount,
  } = useAddNote();

  const inputRef = useRef<TextInput>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [autoFocus]);

  const handlePreSave = () => {
    setIsModalVisible(true);
  };

  const handleConfirmSave = () => {
    const result = saveNote();
    if (result.success && result.noteId) {
      setIsModalVisible(false);
      resetForm();
      onNoteSaved?.(result.noteId);
      if (autoFocus) {
        inputRef.current?.focus();
      }
    } else {
      // If content was empty, we can just close modal or do nothing
      setIsModalVisible(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Secret Note</Text>
        <Button
          label="Save"
          onPress={handlePreSave}
          variant="primary"
          size="sm"
        />
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
        <TextInput
          ref={inputRef}
          style={styles.input}
          multiline
          placeholder="Type something..."
          placeholderTextColor={colors.textDisabled}
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
          selectionColor={colors.accent}
        />
      </View>

      <View style={styles.footer}>
        <CharacterCounter charCount={charCount} wordCount={wordCount} />
      </View>

      <CategorySelectionModal
        visible={isModalVisible}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={selectCategory}
        onConfirm={handleConfirmSave}
        onCancel={() => setIsModalVisible(false)}
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
  appTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold',
    color: colors.primary,
  },
  categoryBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
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
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
