/**
 * Crypto Service — Type definitions
 *
 * Defines the encrypted payload format and the service interface
 * for AES-256-GCM encryption used in backup export/import.
 *
 * @module shared/lib/crypto-lib
 */

/**
 * Self-contained encrypted payload.
 *
 * Everything needed to decrypt is stored here EXCEPT the password.
 * This struct is embedded inside the backup JSON file.
 */
export interface EncryptedPayload {
  /** Base64-encoded ciphertext */
  ciphertext: string;
  /** Base64-encoded initialization vector (12 bytes for GCM) */
  iv: string;
  /** Base64-encoded authentication tag (16 bytes for GCM) */
  authTag: string;
  /** Base64-encoded PBKDF2 salt (16 bytes) */
  salt: string;
  /** Algorithm identifier */
  algorithm: string;
  /** Payload format version */
  version: number;
}

/**
 * Crypto service contract.
 *
 * Upper layers (features/backup-vault) program against this
 * interface, never touching react-native-quick-crypto directly.
 */
export interface ICryptoService {
  /** Encrypt plaintext with a user-supplied password. */
  encrypt(plaintext: string, password: string): EncryptedPayload;

  /** Decrypt a payload. Throws if the password is wrong or data is tampered. */
  decrypt(payload: EncryptedPayload, password: string): string;
}
