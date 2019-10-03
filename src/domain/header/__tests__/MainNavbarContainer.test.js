import { selector } from '../MainNavbarContainer';

describe('shared/main-navbar/MainNavbarContainer', () => {
  describe('selector', () => {
    function getState(locale = 'fi', user = {}) {
      return {
        auth: {
          userId: user.id,
          token: 'mock-token',
        },
        data: {
          users: { [user.id]: user },
        },
        intl: {
          locale,
        },
      };
    }

    test('returns isAdmin', () => {
      const selected = selector(getState());
      expect(selected.isAdmin).toBeDefined();
    });

    test('returns isLoggedIn', () => {
      const selected = selector(getState());
      expect(selected.isLoggedIn).toBeDefined();
    });
  });
});
