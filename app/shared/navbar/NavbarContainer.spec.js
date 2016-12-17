import { expect } from 'chai';

import { selector } from './NavbarContainer';

describe('shared/navbar/NavbarContainer', () => {
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

    describe('currentLanguage', () => {
      it('returns sv is current locale is se', () => {
        const selected = selector(getState('se'));
        expect(selected.currentLanguage).to.equal('sv');
      });

      it('returns the current locale', () => {
        const selected = selector(getState('en'));
        expect(selected.currentLanguage).to.equal('en');
      });
    });

    it('returns isAdmin', () => {
      const selected = selector(getState());
      expect(selected.isAdmin).to.exist;
    });

    it('returns isLoggedIn', () => {
      const selected = selector(getState());
      expect(selected.isLoggedIn).to.exist;
    });

    describe('userName', () => {
      it('returns an empty string if user is not logged in', () => {
        const selected = selector(getState());
        expect(selected.userName).to.equal('');
      });

      it('returns user firstName + lastName', () => {
        const user = { firstName: 'Luke', lastName: 'Skywalker' };
        const selected = selector(getState(null, user));
        expect(selected.userName).to.equal('Luke Skywalker');
      });

      it('returns user email if no firstName or lastName', () => {
        const user = { emails: [{ value: 'luke@skywalker.com' }] };
        const selected = selector(getState(null, user));
        expect(selected.userName).to.equal('luke@skywalker.com');
      });
    });
  });
});
