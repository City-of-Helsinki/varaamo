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
      test('returns sv is current locale is se', () => {
        const selected = selector(getState('se'));
        expect(selected.currentLanguage).toBe('sv');
      });

      test('returns the current locale', () => {
        const selected = selector(getState('en'));
        expect(selected.currentLanguage).toBe('en');
      });
    });

    test('returns isAdmin', () => {
      const selected = selector(getState());
      expect(selected.isAdmin).toBeDefined();
    });

    test('returns isLoggedIn', () => {
      const selected = selector(getState());
      expect(selected.isLoggedIn).toBeDefined();
    });

    describe('userName', () => {
      test('returns an empty string if user is not logged in', () => {
        const selected = selector(getState());
        expect(selected.userName).toBe('');
      });

      test('returns user firstName + lastName', () => {
        const user = { firstName: 'Luke', lastName: 'Skywalker' };
        const selected = selector(getState(null, user));
        expect(selected.userName).toBe('Luke Skywalker');
      });

      test('returns user email if no firstName or lastName', () => {
        const user = { email: 'luke@skywalker.com' };
        const selected = selector(getState(null, user));
        expect(selected.userName).toBe('luke@skywalker.com');
      });

      test(
        'returns user email from emails array if no firstName or lastName',
        () => {
          const user = { emails: [{ value: 'luke@skywalker.com' }] };
          const selected = selector(getState(null, user));
          expect(selected.userName).toBe('luke@skywalker.com');
        }
      );
    });
  });
});
