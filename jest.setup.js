import {jest} from '@jest/globals';

// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => {
  return {
    createMMKV: jest.fn().mockImplementation(() => {
      const storage = new Map();
      return {
        set: jest.fn((key, value) => storage.set(key, value)),
        getString: jest.fn((key) => storage.get(key)),
        getNumber: jest.fn((key) => storage.get(key)),
        getBoolean: jest.fn((key) => storage.get(key)),
        contains: jest.fn((key) => storage.has(key)),
        remove: jest.fn((key) => storage.delete(key)),
        clearAll: jest.fn(() => storage.clear()),
        getAllKeys: jest.fn(() => Array.from(storage.keys())),
      };
    }),
  };
});

// Mock react-native-quick-crypto
jest.mock('react-native-quick-crypto', () => {
  return {
    createCipheriv: jest.fn(() => ({
      update: jest.fn(() => Buffer.from('mock-encrypted')),
      final: jest.fn(() => Buffer.from('')),
      getAuthTag: jest.fn(() => Buffer.from('mock-auth-tag')),
    })),
    createDecipheriv: jest.fn(() => ({
      setAuthTag: jest.fn(),
      update: jest.fn(() => Buffer.from('mock-decrypted')),
      final: jest.fn(() => Buffer.from('')),
    })),
    pbkdf2Sync: jest.fn(() => Buffer.from('mock-derived-key')),
    randomBytes: jest.fn(() => Buffer.from('1234567890123456')), // 16 bytes
  };
});

// Mock react-native-fs
jest.mock('react-native-fs', () => {
  return {
    CachesDirectoryPath: '/mock/cache/path',
    writeFile: jest.fn(() => Promise.resolve()),
    readFile: jest.fn(() => Promise.resolve('{"mock": "data"}')),
  };
});

/* global Buffer */

// Mock react-native-share
jest.mock('react-native-share', () => ({
  open: jest.fn(() => Promise.resolve()),
}));

// Mock DocumentPicker
jest.mock('@react-native-documents/picker', () => ({
  pickSingle: jest.fn(() => Promise.resolve({uri: 'mock-file-uri'})),
  isCancel: jest.fn(() => false),
  types: {
    json: 'application/json',
    allFiles: '*/*',
  },
}));
