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
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Note titled ${note.title}, updated on ${formatRelativeTime(note.updatedAt)}`}
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
          {category && (
            <View style={[styles.categoryBadge, {borderColor: category.color}]}>
              <Text style={styles.categoryText}>
                {category.icon ? `${category.icon} ` : ''}{category.name}
              </Text>
            </View>
          )}
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
        {note.createdAt !== note.updatedAt ? (
          <Text style={styles.editedDate}>Edited {formatRelativeTime(note.updatedAt)}</Text>
        ) : (
          <View />
        )}
        <Text style={styles.date}>{formatRelativeTime(note.createdAt)}</Text>
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
    alignItems: 'center',
    gap: spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: spacing.xs,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  preview: {
    color: colors.textSecondary,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  footer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: colors.textDisabled,
    fontSize: typography.caption.fontSize,
  },
  editedDate: {
    color: colors.textDisabled,
    fontSize: typography.caption.fontSize,
    fontStyle: 'italic',
  },
});
