/**
 * Divider — Shared UI Primitive
 *
 * A thin horizontal rule for visually separating content sections.
 *
 * @module shared/ui
 */

import React from 'react';
import {StyleSheet, View, type ViewStyle} from 'react-native';
import {colors, spacing} from '../config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DividerProps {
  /** Vertical space above and below the line */
  verticalSpacing?: number;
  /** Override color */
  color?: string;
  /** Optional extra styles */
  style?: ViewStyle;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Divider({
  verticalSpacing = spacing.md,
  color = colors.border,
  style,
}: DividerProps): React.JSX.Element {
  return (
    <View
      style={[
        styles.line,
        {
          marginVertical: verticalSpacing,
          backgroundColor: color,
        },
        style,
      ]}
      accessibilityRole="none"
    />
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
