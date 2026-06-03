import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon} from '@/shared/ui';
import {colors, spacing} from '@/shared/config';

interface NoteActionsProps {
  isFavorite: boolean;
  isPinned: boolean;
  onToggleFavorite: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
}

export function NoteActions({
  isFavorite,
  isPinned,
  onToggleFavorite,
  onTogglePin,
  onDelete,
}: NoteActionsProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Icon
        name={isFavorite ? 'star' : 'star-outline'}
        color={isFavorite ? colors.accent : colors.textSecondary}
        onPress={onToggleFavorite}
      />
      <View style={styles.gap} />
      <Icon
        name={isPinned ? 'pin' : 'pin-outline'}
        color={isPinned ? colors.accent : colors.textSecondary}
        onPress={onTogglePin}
      />
      <View style={styles.gap} />
      <Icon
        name="trash-can-outline"
        color={colors.error}
        onPress={onDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gap: {
    width: spacing.md,
  },
});
