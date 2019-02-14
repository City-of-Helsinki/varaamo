import { expect } from 'chai';

import { selector } from './MainNavbarContainer';

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

    it('returns isAdmin', () => {
      const selected = selector(getState());
      expect(selected.isAdmin).to.exist;
    });

    it('returns isLoggedIn', () => {
      const selected = selector(getState());
      expect(selected.isLoggedIn).to.exist;
    });
  });
});
