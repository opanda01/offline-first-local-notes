/**
 * Shared Config — Public API
 *
 * Re-exports all design tokens, types, and helper functions
 * from the theme module.
 *
 * @module shared/config
 */

export {
  // Token objects
  theme,
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  animation,
  iconSizes,
  // Helper functions
  getSpacing,
  addAlpha,
  // Type exports
  type Theme,
  type Colors,
  type Spacing,
  type Typography,
  type BorderRadius,
  type Shadows,
  type Animation,
  type IconSizes,
} from './theme';
