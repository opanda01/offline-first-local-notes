/**
 * Icon — Shared UI Primitive
 *
 * Thin wrapper around react-native-vector-icons/MaterialCommunityIcons.
 * If the icon library ever changes, only this file needs updating.
 *
 * @module shared/ui
 */

import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, iconSizes, type IconSizes} from '../config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IconProps {
  /** MaterialCommunityIcons icon name */
  name: string;
  /** Size key from the IconSizes scale */
  size?: keyof IconSizes;
  /** Override color (defaults to colors.primary) */
  color?: string;
  /** Makes the icon tappable */
  onPress?: () => void;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Icon({
  name,
  size = 'lg',
  color = colors.primary,
  onPress,
  accessibilityLabel,
}: IconProps): React.JSX.Element {
  const resolvedSize = iconSizes[size];

  const icon = (
    <MaterialCommunityIcons
      name={name}
      size={resolvedSize}
      color={color}
      accessibilityLabel={accessibilityLabel}
    />
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        hitSlop={8}
        style={({pressed}) => pressed && styles.pressed}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}>
        {icon}
      </Pressable>
    );
  }

  return icon;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.6,
  },
});
