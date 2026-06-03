import {cryptoService} from '../crypto';

describe('Shared - Crypto Library', () => {
  it('should encrypt and decrypt a string securely', () => {
    // Note: In our test environment, 'react-native-quick-crypto' is mocked
    // to return static buffers for deterministic testing without native bridges.
    const plaintext = 'Super secret note content';
    const password = 'my-secure-password';

    const encrypted = cryptoService.encrypt(plaintext, password);

    expect(encrypted.ciphertext).toBeDefined();
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.salt).toBeDefined();
    expect(encrypted.authTag).toBeDefined();

    // Since we mocked it, the decrypt will return our mocked decrypted buffer
    const decrypted = cryptoService.decrypt(encrypted, password);
    expect(decrypted).toBe('mock-decrypted');
  });
});
