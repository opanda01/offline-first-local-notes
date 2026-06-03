import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, spacing, typography} from '@/shared/config';

interface CharacterCounterProps {
  charCount: number;
  wordCount: number;
}

export function CharacterCounter({charCount, wordCount}: CharacterCounterProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {wordCount} words • {charCount} chars
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: 'flex-end',
  },
  text: {
    color: colors.textDisabled,
    fontSize: typography.caption.fontSize,
  },
});
