import { expect } from 'chai';

import { selector } from './TopNavbarContainer';

describe('shared/top-navbar/TopNavbarContainer', () => {
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
      test('returns sv is current locale is se', () => {
        const selected = selector(getState('se'));
        expect(selected.currentLanguage).to.equal('sv');
      });

      test('returns the current locale', () => {
        const selected = selector(getState('en'));
        expect(selected.currentLanguage).to.equal('en');
      });
    });

    test('returns isLoggedIn', () => {
      const selected = selector(getState());
      expect(selected.isLoggedIn).to.exist;
    });

    describe('userName', () => {
      test('returns an empty string if user is not logged in', () => {
        const selected = selector(getState());
        expect(selected.userName).to.equal('');
      });

      test('returns user firstName + lastName', () => {
        const user = { firstName: 'Luke', lastName: 'Skywalker' };
        const selected = selector(getState(null, user));
        expect(selected.userName).to.equal('Luke Skywalker');
      });

      test('returns user email if no firstName or lastName', () => {
        const user = { email: 'luke@skywalker.com' };
        const selected = selector(getState(null, user));
        expect(selected.userName).to.equal('luke@skywalker.com');
      });

      test(
        'returns user email from emails array if no firstName or lastName',
        () => {
          const user = { emails: [{ value: 'luke@skywalker.com' }] };
          const selected = selector(getState(null, user));
          expect(selected.userName).to.equal('luke@skywalker.com');
        }
      );
    });
  });
});
