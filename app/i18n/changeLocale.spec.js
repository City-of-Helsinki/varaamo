import changeLocale from './changeLocale';
import * as persistState from '../store/middleware/persistState';

describe('changeLocale', () => {
  test('should invoke savePersistLocale', () => {
    persistState.savePersistLocale = jest.fn();
    const arg = 'foo';

    changeLocale(arg);

    expect(persistState.savePersistLocale.mock.calls.length).toBe(1);
    expect(persistState.savePersistLocale).toBeCalledWith(arg);
  });
});
