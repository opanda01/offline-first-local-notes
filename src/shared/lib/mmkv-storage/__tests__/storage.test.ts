import {storage} from '../storage';

describe('Shared - MMKV Storage Adapter', () => {
  beforeEach(() => {
    storage.clearAll();
  });

  it('sets and gets string values', () => {
    storage.setString('my-key', 'my-value');
    expect(storage.getString('my-key')).toBe('my-value');
  });

  it('sets and gets boolean values', () => {
    storage.setBoolean('my-bool', true);
    expect(storage.getBoolean('my-bool')).toBe(true);
  });

  it('sets and gets number values', () => {
    storage.setNumber('my-num', 42);
    expect(storage.getNumber('my-num')).toBe(42);
  });

  it('deletes keys correctly', () => {
    storage.setString('delete-me', 'test');
    expect(storage.contains('delete-me')).toBe(true);
    
    storage.delete('delete-me');
    expect(storage.contains('delete-me')).toBe(false);
    expect(storage.getString('delete-me')).toBeUndefined();
  });
});
