import { storeInLocalStorage, getFromLocalStorage } from '../localStorageUtils';

describe('Utils: localStorageUtils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('storeInLocalStorage', () => {
    it('Should set the provided key and value in localStorage', () => {
      const key = 'foo';
      const value = 'bar';

      storeInLocalStorage(key, value);
      expect(localStorage.setItem).toHaveBeenLastCalledWith(key, value);
    });

    it('Should stringify the provided value', () => {
      const key = 'foo';
      const objectValue = {};

      storeInLocalStorage(key, objectValue);
      expect(localStorage.setItem).toHaveBeenLastCalledWith(key, expect.any(String));
    });
  });

  describe('getFromLocalStorage', () => {
    const key = 'foo';

    it('Should return the corresponding value from localStorage of the provided key', () => {
      const value = 'bar';
      localStorage.setItem(key, value);

      expect(getFromLocalStorage(key)).toBe(value);
    });

    it('Should parse the return value if needed', () => {
      const stringifiedArray = '[1,2]';
      const stringifiedObject = '{"foo":"bar"}';
      localStorage.setItem('stringifiedArray', stringifiedArray);
      localStorage.setItem('stringifiedObject', stringifiedObject);

      expect(getFromLocalStorage('stringifiedArray')).toEqual([1, 2]);
      expect(getFromLocalStorage('stringifiedObject')).toEqual({ foo: 'bar' });
    });
  });
});
