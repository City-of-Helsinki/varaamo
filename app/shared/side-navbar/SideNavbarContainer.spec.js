import { selector } from './SideNavbarContainer';

describe('shared/side-navbar/SideNavbarContainer', () => {
  describe('selector', () => {
    function getState(user = {}) {
      return {
        auth: {
          userId: user.id,
          token: 'mock-token',
        },
        data: {
          users: { [user.id]: user },
        },
      };
    }

    describe('initials', () => {
      test('returns an empty string if user is not logged in', () => {
        const selected = selector(getState());
        expect(selected.initials).toBeNull();
      });

      test('returns user firstName + lastName initials', () => {
        const user = { firstName: 'Luke', lastName: 'Skywalker' };
        const selected = selector(getState(user));
        expect(selected.initials).toBe('LS');
      });

      test('returns user email initial if not firstName or lastName', () => {
        const user = { email: 'luke@skywalker.com' };
        const selected = selector(getState(user));
        expect(selected.initials).toBe('l');
      });

      test(
        'returns user email initial from emails array if no firstName or lastName',
        () => {
          const user = { emails: [{ value: 'luke@skywalker.com' }] };
          const selected = selector(getState(user));
          expect(selected.initials).toBe('l');
        }
      );
    });
  });
});
