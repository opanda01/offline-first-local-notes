/**
 * AES-256-GCM Crypto Service
 *
 * Uses react-native-quick-crypto (native JSI, ~10x faster than crypto-js).
 *
 * Flow:
 *   encrypt(plaintext, password)
 *     1. Generate random 16-byte salt
 *     2. Derive 256-bit key via PBKDF2-SHA512 (100 000 iterations)
 *     3. Generate random 12-byte IV
 *     4. Encrypt with AES-256-GCM → ciphertext + 16-byte auth tag
 *     5. Return everything as Base64 in an EncryptedPayload
 *
 *   decrypt(payload, password)
 *     1. Re-derive key from password + stored salt
 *     2. Decrypt with AES-256-GCM using stored IV + authTag
 *     3. Return plaintext (throws on wrong password / tampered data)
 *
 * @module shared/lib/crypto-lib
 */

import crypto from 'react-native-quick-crypto';
import type {EncryptedPayload, ICryptoService} from './types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const ALGORITHM = 'aes-256-gcm' as const;
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12; // GCM standard
const SALT_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits
const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_DIGEST = 'sha512';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    KEY_LENGTH,
    PBKDF2_DIGEST,
  ) as unknown as Buffer;
}

function toBase64(buf: Buffer): string {
  return buf.toString('base64');
}

function fromBase64(b64: string): Buffer {
  return Buffer.from(b64, 'base64') as unknown as Buffer;
}

// ---------------------------------------------------------------------------
// Public service
// ---------------------------------------------------------------------------

export const cryptoService: ICryptoService = {
  encrypt(plaintext: string, password: string): EncryptedPayload {
    // 1. Random salt & IV
    const salt = crypto.randomBytes(SALT_LENGTH) as unknown as Buffer;
    const iv = crypto.randomBytes(IV_LENGTH) as unknown as Buffer;

    // 2. Key derivation
    const key = deriveKey(password, salt);

    // 3. Encrypt
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    } as any);

    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8') as unknown as Buffer,
      cipher.final() as unknown as Buffer,
    ]);

    const authTag = cipher.getAuthTag() as unknown as Buffer;

    // 4. Pack
    return {
      ciphertext: toBase64(encrypted),
      iv: toBase64(iv),
      authTag: toBase64(authTag),
      salt: toBase64(salt),
      algorithm: ALGORITHM,
      version: 1,
    };
  },

  decrypt(payload: EncryptedPayload, password: string): string {
    // 1. Unpack
    const salt = fromBase64(payload.salt);
    const iv = fromBase64(payload.iv);
    const authTag = fromBase64(payload.authTag);
    const ciphertext = fromBase64(payload.ciphertext);

    // 2. Re-derive key
    const key = deriveKey(password, salt);

    // 3. Decrypt
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    } as any);

    decipher.setAuthTag(authTag as any);

    const decrypted = Buffer.concat([
      decipher.update(ciphertext) as unknown as Buffer,
      decipher.final() as unknown as Buffer,
    ]);

    return decrypted.toString('utf8');
  },
};
