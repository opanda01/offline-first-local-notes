/**
 * EmptyState — Shared UI Primitive
 *
 * Full-screen (flex: 1) centered placeholder shown when a list
 * or view has no content yet. Accepts an icon name, title, and
 * optional subtitle.
 *
 * @module shared/ui
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, spacing, typography, iconSizes} from '../config';
import {Icon} from './Icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EmptyStateProps {
  /** MaterialCommunityIcons icon name */
  icon: string;
  /** Heading text */
  title: string;
  /** Optional secondary description */
  subtitle?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EmptyState({
  icon,
  title,
  subtitle,
}: EmptyStateProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Icon name={icon} size="xl" color={colors.textDisabled} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight as any,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.textDisabled,
    fontSize: typography.caption.fontSize,
    textAlign: 'center',
    lineHeight: 18,
  },
});
