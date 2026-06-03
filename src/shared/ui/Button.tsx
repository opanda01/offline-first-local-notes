/**
 * Button — Shared UI Primitive
 *
 * Supports four visual variants and three sizes.
 * All colors come from design tokens — no hardcoded values.
 *
 * @module shared/ui
 */

import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {colors, spacing, borderRadius, animation} from '../config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ButtonProps {
  /** Button label text */
  label: string;
  /** Press handler */
  onPress: () => void;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Size preset */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Shows a spinner and disables interaction */
  loading?: boolean;
  /** Stretch to fill parent width */
  fullWidth?: boolean;
}

// ---------------------------------------------------------------------------
// Size & Variant maps
// ---------------------------------------------------------------------------

const SIZE_STYLES: Record<NonNullable<ButtonProps['size']>, ViewStyle> = {
  sm: {paddingVertical: spacing.xs, paddingHorizontal: spacing.md},
  md: {paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.lg},
  lg: {paddingVertical: spacing.md, paddingHorizontal: spacing.xl},
};

const SIZE_FONT: Record<NonNullable<ButtonProps['size']>, number> = {
  sm: 13,
  md: 15,
  lg: 17,
};

interface VariantStyle {
  container: ViewStyle;
  text: TextStyle;
}

function getVariantStyle(
  variant: NonNullable<ButtonProps['variant']>,
): VariantStyle {
  switch (variant) {
    case 'primary':
      return {
        container: {backgroundColor: colors.primary},
        text: {color: colors.background},
      };
    case 'secondary':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        },
        text: {color: colors.primary},
      };
    case 'ghost':
      return {
        container: {backgroundColor: 'transparent'},
        text: {color: colors.primary},
      };
    case 'danger':
      return {
        container: {backgroundColor: colors.error},
        text: {color: colors.primary},
      };
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps): React.JSX.Element {
  const isDisabled = disabled || loading;
  const variantStyle = getVariantStyle(variant);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({pressed}) => [
        styles.base,
        SIZE_STYLES[size],
        variantStyle.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{disabled: isDisabled}}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyle.text.color as string}
        />
      ) : (
        <Text
          style={[
            styles.label,
            {fontSize: SIZE_FONT[size]},
            variantStyle.text,
            isDisabled && styles.disabledText,
          ]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  disabled: {
    opacity: 0.4,
  },
  disabledText: {
    color: colors.textDisabled,
  },
  pressed: {
    opacity: 0.8,
    transform: [{scale: 0.98}],
  },
});
