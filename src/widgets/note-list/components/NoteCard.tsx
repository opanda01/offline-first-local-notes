import React from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {type Note, formatRelativeTime, getContentPreview} from '@/entities/note';
import {categoryRepository} from '@/entities/category';
import {Icon} from '@/shared/ui';
import {colors, spacing, borderRadius, typography} from '@/shared/config';

interface NoteCardProps {
  note: Note;
  onPress: (noteId: string) => void;
  onLongPress?: (noteId: string) => void;
}

export function NoteCard({note, onPress, onLongPress}: NoteCardProps): React.JSX.Element {
  const category = note.categoryId ? categoryRepository.getById(note.categoryId) : null;

  return (
    <Pressable
      onPress={() => onPress(note.id)}
      onLongPress={() => onLongPress?.(note.id)}
      style={({pressed}) => [
        styles.card,
        {borderLeftColor: category?.color || 'transparent'},
        pressed && styles.pressed,
      ]}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {note.title}
        </Text>
        <View style={styles.icons}>
          {note.isFavorite && (
            <Icon name="star" size="sm" color={colors.accent} />
          )}
          {note.isPinned && (
            <Icon name="pin" size="sm" color={colors.textSecondary} />
          )}
        </View>
      </View>
      <Text style={styles.preview} numberOfLines={2}>
        {getContentPreview(note.content, 120)}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.date}>{formatRelativeTime(note.updatedAt)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
  },
  pressed: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    flex: 1,
    color: colors.primary,
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight as any,
  },
  icons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  preview: {
    color: colors.textSecondary,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  footer: {
    marginTop: spacing.sm,
    alignItems: 'flex-end',
  },
  date: {
    color: colors.textDisabled,
    fontSize: typography.caption.fontSize,
  },
});
