import React, {useEffect, useRef} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {useAddNote} from '../model/useAddNote';
import {CategoryPicker} from './CategoryPicker';
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
    content,
    setContent,
    selectedCategoryId,
    selectCategory,
    saveNote,
    resetForm,
    isEmpty,
    wordCount,
    charCount,
  } = useAddNote();

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [autoFocus]);

  const handleSave = () => {
    const result = saveNote();
    if (result.success && result.noteId) {
      resetForm();
      onNoteSaved?.(result.noteId);
      if (autoFocus) {
        inputRef.current?.focus();
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Button
          label="Save"
          onPress={handleSave}
          disabled={isEmpty}
          size="sm"
        />
      </View>

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

      <View style={styles.footer}>
        <CategoryPicker
          selectedId={selectedCategoryId}
          onSelect={selectCategory}
        />
        <CharacterCounter charCount={charCount} wordCount={wordCount} />
      </View>
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
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: colors.primary,
  },
  footer: {
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
