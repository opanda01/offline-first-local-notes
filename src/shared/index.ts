/**
 * Shared Layer — Public API
 *
 * Re-exports everything that upper layers (entities, features,
 * widgets, pages, app) may consume from the shared layer.
 *
 * FSD rule: this is the ONLY entry point into shared/.
 *
 * @module shared
 */

// ── Configuration (design tokens) ──────────────────────────────────────────
export {
  theme,
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  animation,
  iconSizes,
  getSpacing,
  addAlpha,
  type Theme,
  type Colors,
  type Spacing,
  type Typography,
  type BorderRadius,
  type Shadows,
  type Animation,
  type IconSizes,
} from './config';

// ── UI Primitives ──────────────────────────────────────────────────────────
export {
  Button,
  Card,
  Icon,
  Divider,
  EmptyState,
  type ButtonProps,
  type CardProps,
  type IconProps,
  type DividerProps,
  type EmptyStateProps,
} from './ui';

// ── Storage adapter ────────────────────────────────────────────────────────
export {storage, type IStorageAdapter} from './lib/mmkv-storage';

// ── Crypto service ─────────────────────────────────────────────────────────
export {
  cryptoService,
  type EncryptedPayload,
  type ICryptoService,
} from './lib/crypto-lib';
