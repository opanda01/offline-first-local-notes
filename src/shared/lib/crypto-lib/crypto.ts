/**
 * AES-256-CBC Crypto Service (crypto-js)
 *
 * Flow:
 *   encrypt(plaintext, password)
 *     1. Generate random 16-byte salt
 *     2. Derive 256-bit key via PBKDF2-SHA256 (100 000 iterations)
 *     3. Generate random 16-byte IV
 *     4. Encrypt with AES-256-CBC (PKCS7 padding)
 *     5. Return Base64 fields in EncryptedPayload
 *
 *   decrypt(payload, password)
 *     1. Re-derive key from password + stored salt
 *     2. Decrypt with AES-256-CBC using stored IV
 *     3. Return plaintext (throws on wrong password / corrupted data)
 *
 * @module shared/lib/crypto-lib
 */

import CryptoJS from 'crypto-js';
import type {EncryptedPayload, ICryptoService} from './types';

const ALGORITHM = 'aes-256-cbc';
const KEY_LENGTH_WORDS = 256 / 32;
const PBKDF2_ITERATIONS = 100_000;

export const cryptoService: ICryptoService = {
  encrypt(plaintext: string, password: string): EncryptedPayload {
    const salt = CryptoJS.lib.WordArray.random(16);
    const iv = CryptoJS.lib.WordArray.random(16);

    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: KEY_LENGTH_WORDS,
      iterations: PBKDF2_ITERATIONS,
      hasher: CryptoJS.algo.SHA256,
    });

    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return {
      ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
      iv: iv.toString(CryptoJS.enc.Base64),
      salt: salt.toString(CryptoJS.enc.Base64),
      algorithm: ALGORITHM,
      version: 2,
    };
  },

  decrypt(payload: EncryptedPayload, password: string): string {
    const salt = CryptoJS.enc.Base64.parse(payload.salt);
    const iv = CryptoJS.enc.Base64.parse(payload.iv);
    const ciphertext = CryptoJS.enc.Base64.parse(payload.ciphertext);

    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: KEY_LENGTH_WORDS,
      iterations: PBKDF2_ITERATIONS,
      hasher: CryptoJS.algo.SHA256,
    });

    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: ciphertext,
    });

    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedStr) {
      throw new Error('Decryption failed: Incorrect password or corrupted data');
    }

    return decryptedStr;
  },
};
