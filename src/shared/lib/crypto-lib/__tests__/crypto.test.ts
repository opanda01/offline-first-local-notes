import {cryptoService} from '../crypto';

describe('Shared - Crypto Library', () => {
  it('should encrypt and decrypt a string securely', () => {
    const plaintext = 'Super secret note content';
    const password = 'my-secure-password';

    const encrypted = cryptoService.encrypt(plaintext, password);

    expect(encrypted.ciphertext).toBeDefined();
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.salt).toBeDefined();
    expect(encrypted.algorithm).toBe('aes-256-cbc');
    expect(encrypted.version).toBe(2);

    const decrypted = cryptoService.decrypt(encrypted, password);
    expect(decrypted).toBe(plaintext);
  });

  it('should fail decryption with wrong password', () => {
    const encrypted = cryptoService.encrypt('secret', 'correct-password');
    expect(() => cryptoService.decrypt(encrypted, 'wrong-password')).toThrow(
      'Decryption failed',
    );
  });

  it('should produce different ciphertext for same plaintext', () => {
    const a = cryptoService.encrypt('same', 'pass');
    const b = cryptoService.encrypt('same', 'pass');
    expect(a.ciphertext).not.toBe(b.ciphertext);
    expect(a.iv).not.toBe(b.iv);
  });
});
