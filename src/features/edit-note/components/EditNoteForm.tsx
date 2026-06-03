import React, {useState, useEffect} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
  Text,
  Alert,
} from 'react-native';
import {useEditNote} from '../model/useEditNote';
import {DeleteConfirmDialog} from './DeleteConfirmDialog';
import {NoteActions} from './NoteActions';
import {Button} from '@/shared/ui';
import {colors, spacing, typography} from '@/shared/config';
import {formatRelativeTime, getWordCount} from '@/entities/note';
// Not: CategoryPicker'ı add-note feature'dan kullanıyoruz (cross-slice import normalde istenmez ama FSD'de shared widget yapısına çıkarana kadar kullanılabilir).
// Fakat plan: CategoryPicker'ı add-note'dan import etmemek gerekir. En doğrusu onu entities'e veya shared/ui'a çekmektir. 
// Planı bozmamak için şimdilik kendi yazdığı component gibi veya sadece kategori adını gösterip basit tutacağız.
// FSD kuralı 203. satırda: features/edit-note -> features/add-note IMPORT YOK.
// O zaman Category seçimi edit note formunda şimdilik yapılmayacak ya da basit tutulacak. 

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
    content,
    setContent,
    saveChanges,
    deleteNote,
    toggleFavorite,
    togglePin,
    hasChanges,
    isLoading,
  } = useEditNote(noteId);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const handleSave = () => {
    const result = saveChanges();
    if (result.success) {
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Button label="Back" variant="ghost" onPress={handleBack} size="sm" />
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
            onPress={handleSave}
            disabled={!hasChanges}
            size="sm"
          />
        </View>
      </View>

      <TextInput
        style={styles.input}
        multiline
        value={content}
        onChangeText={setContent}
        textAlignVertical="top"
        selectionColor={colors.accent}
      />

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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gap: {
    width: spacing.md,
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
