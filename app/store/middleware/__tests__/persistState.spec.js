import { loadPersistedLocale, savePersistLocale } from '../persistState';

describe('loadPersistedLocale', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should load persisted locale from localStorage', () => {
    const mockLocale = 'foo';
    // init localStorage data
    localStorage.setItem('userLocale', mockLocale);

    expect(loadPersistedLocale()).toEqual(mockLocale);
  });

  test('if no persisted locale from localStorage, return undefined', () => {
    expect(loadPersistedLocale()).toEqual(undefined);
  });
});

describe('savePersistLocale', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should override persisted locale from localStorage', () => {
    const mockLocale = 'foo';
    const expectedLocale = 'bar';

    // init localStorage data
    localStorage.setItem('userLocale', mockLocale);

    // override locale
    savePersistLocale(expectedLocale);

    expect(localStorage.getItem('userLocale')).toEqual(expectedLocale);
  });

  test('should not setValue if locale param is empty', () => {
    savePersistLocale('');

    expect(localStorage.getItem('userLocale')).toEqual(null);
  });

  test('should not setValue if locale param is not string', () => {
    savePersistLocale(123);

    expect(localStorage.getItem('userLocale')).toEqual(null);
  });

  test('should set locale if string', () => {
    const expectedLocale = 'bar';

    savePersistLocale(expectedLocale);

    expect(localStorage.getItem('userLocale')).toEqual(expectedLocale);
  });
});
