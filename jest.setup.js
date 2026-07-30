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

// Mock react-native-fs
jest.mock('react-native-fs', () => {
  return {
    CachesDirectoryPath: '/mock/cache/path',
    writeFile: jest.fn(() => Promise.resolve()),
    readFile: jest.fn(() => Promise.resolve('{"mock": "data"}')),
  };
});

// Mock react-native-share
jest.mock('react-native-share', () => ({
  open: jest.fn(() => Promise.resolve()),
}));

// Mock DocumentPicker
jest.mock('@react-native-documents/picker', () => ({
  pick: jest.fn(() => Promise.resolve([{uri: 'mock-file-uri'}])),
  pickSingle: jest.fn(() => Promise.resolve({uri: 'mock-file-uri'})),
  isCancel: jest.fn(() => false),
  types: {
    json: 'application/json',
    allFiles: '*/*',
  },
}));
