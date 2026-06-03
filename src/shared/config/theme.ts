/**
 * Design Tokens — Corporate Dark Theme
 *
 * Single source of truth for all visual constants.
 * Every color, spacing, font size, and timing value used across the app
 * MUST come from this file (or be derived via helper functions).
 *
 * @module shared/config/theme
 */

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

export interface Colors {
  /** Main background (#121212) */
  background: string;
  /** Cards, modals, tab bar (#1E1E1E) */
  surface: string;
  /** Elevated surfaces — hover, focus (#252525) */
  surfaceElevated: string;
  /** Primary text and active elements (#F5F5F5) */
  primary: string;
  /** Secondary / muted text (#8A8A8A) */
  textSecondary: string;
  /** Disabled text and placeholders (#5A5A5A) */
  textDisabled: string;
  /** Borders, dividers (#2A2A2A) */
  border: string;
  /** Accent color — used sparingly (#BB86FC) */
  accent: string;
  /** Error states (#CF6679) */
  error: string;
  /** Success states (#4CAF50) */
  success: string;
}

export interface Spacing {
  /** 4 */
  xs: number;
  /** 8 */
  sm: number;
  /** 16 */
  md: number;
  /** 24 */
  lg: number;
  /** 32 */
  xl: number;
  /** 48 */
  xxl: number;
}

export interface Typography {
  /** Eyebrow: uppercase label above headings */
  eyebrow: {fontSize: number; fontWeight: string; letterSpacing: number};
  /** H1: page titles */
  h1: {fontSize: number; fontWeight: string};
  /** H2: section headings, card titles */
  h2: {fontSize: number; fontWeight: string};
  /** Body: main content text */
  body: {fontSize: number; lineHeight: number};
  /** Caption: timestamps, counters, fine print */
  caption: {fontSize: number};
}

export interface BorderRadius {
  /** 4 */
  sm: number;
  /** 8 */
  md: number;
  /** 12 */
  lg: number;
  /** 16 */
  xl: number;
  /** 9999 — fully rounded */
  full: number;
}

export interface Shadows {
  sm: {
    shadowColor: string;
    shadowOffset: {width: number; height: number};
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  md: {
    shadowColor: string;
    shadowOffset: {width: number; height: number};
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  lg: {
    shadowColor: string;
    shadowOffset: {width: number; height: number};
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
}

export interface Animation {
  /** 150ms — micro-interactions, button presses */
  fast: number;
  /** 300ms — modals, page transitions */
  normal: number;
  /** 500ms — onboarding, first-load reveals */
  slow: number;
}

export interface IconSizes {
  /** 16 */
  sm: number;
  /** 20 */
  md: number;
  /** 24 */
  lg: number;
  /** 32 */
  xl: number;
}

export interface Theme {
  colors: Colors;
  spacing: Spacing;
  typography: Typography;
  borderRadius: BorderRadius;
  shadows: Shadows;
  animation: Animation;
  iconSizes: IconSizes;
}

// ---------------------------------------------------------------------------
// Token values
// ---------------------------------------------------------------------------

export const colors: Colors = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceElevated: '#252525',
  primary: '#F5F5F5',
  textSecondary: '#8A8A8A',
  textDisabled: '#5A5A5A',
  border: '#2A2A2A',
  accent: '#BB86FC',
  error: '#CF6679',
  success: '#4CAF50',
};

export const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography: Typography = {
  eyebrow: {fontSize: 11, fontWeight: '700', letterSpacing: 1.4},
  h1: {fontSize: 28, fontWeight: '700'},
  h2: {fontSize: 20, fontWeight: '600'},
  body: {fontSize: 17, lineHeight: 26},
  caption: {fontSize: 12},
};

export const borderRadius: BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows: Shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const animation: Animation = {
  fast: 150,
  normal: 300,
  slow: 500,
};

export const iconSizes: IconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

// ---------------------------------------------------------------------------
// Composed theme object (for consumers that want everything in one import)
// ---------------------------------------------------------------------------

export const theme: Theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  animation,
  iconSizes,
};

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Returns the sum of spacing values for the given multipliers.
 *
 * @example
 *   getSpacing(1, 2)  // spacing.xs + spacing.sm = 4 + 8 = 12
 *
 * Each multiplier maps to a base unit of 4:
 *   getSpacing(n) → n * 4
 *   getSpacing(a, b) → (a * 4) + (b * 4)
 */
export function getSpacing(...multipliers: number[]): number {
  const BASE = 4;
  return multipliers.reduce((sum, m) => sum + m * BASE, 0);
}

/**
 * Appends an alpha channel to a 6-digit hex color.
 *
 * @param hex   — e.g. '#FF0000'
 * @param alpha — 0..1
 * @returns       'rgba(r, g, b, alpha)' string
 *
 * @example
 *   addAlpha('#FF0000', 0.5) // 'rgba(255, 0, 0, 0.5)'
 */
export function addAlpha(hex: string, alpha: number): string {
  const sanitized = hex.replace('#', '');
  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
