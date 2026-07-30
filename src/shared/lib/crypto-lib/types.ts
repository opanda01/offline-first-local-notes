/**
 * Crypto Service — Type definitions
 *
 * Defines the encrypted payload format and the service interface
 * for AES-256-CBC encryption used in backup export/import.
 *
 * @module shared/lib/crypto-lib
 */

export interface EncryptedPayload {
  /** Base64-encoded ciphertext */
  ciphertext: string;
  /** Base64-encoded initialization vector (16 bytes for CBC) */
  iv: string;
  /** Base64-encoded PBKDF2 salt (16 bytes) */
  salt: string;
  /** Algorithm identifier */
  algorithm: string;
  /** Payload format version */
  version: number;
}

export interface ICryptoService {
  encrypt(plaintext: string, password: string): EncryptedPayload;
  decrypt(payload: EncryptedPayload, password: string): string;
}
