/**
 * Card — Shared UI Primitive
 *
 * A container surface with three visual variants.
 * Optionally pressable (when `onPress` is supplied).
 *
 * @module shared/ui
 */

import React from 'react';
import {Pressable, StyleSheet, View, type ViewStyle} from 'react-native';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  type Spacing,
} from '../config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CardProps {
  /** Card body */
  children: React.ReactNode;
  /** Visual variant */
  variant?: 'default' | 'elevated' | 'outlined';
  /** Makes the card tappable */
  onPress?: () => void;
  /** Inner padding key from Spacing scale */
  padding?: keyof Spacing;
  /** Optional extra styles */
  style?: ViewStyle;
}

// ---------------------------------------------------------------------------
// Variant map
// ---------------------------------------------------------------------------

function getVariantStyle(
  variant: NonNullable<CardProps['variant']>,
): ViewStyle {
  switch (variant) {
    case 'default':
      return {backgroundColor: colors.surface};
    case 'elevated':
      return {
        backgroundColor: colors.surfaceElevated,
        ...shadows.md,
      };
    case 'outlined':
      return {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
      };
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Card({
  children,
  variant = 'default',
  onPress,
  padding = 'md',
  style,
}: CardProps): React.JSX.Element {
  const cardStyle: ViewStyle[] = [
    styles.base,
    {padding: spacing[padding]},
    getVariantStyle(variant),
    style as ViewStyle,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({pressed}) => [
          ...cardStyle,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button">
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.85,
    transform: [{scale: 0.99}],
  },
});
