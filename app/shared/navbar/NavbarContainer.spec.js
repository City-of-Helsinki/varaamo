import { expect } from 'chai';

import { selector } from './NavbarContainer';

describe('shared/navbar/NavbarContainer', () => {
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
        const selected = selector(getState(user));
        expect(selected.userName).to.equal('Luke Skywalker');
      });

      it('returns user email if no firstName or lastName', () => {
        const user = { emails: [{ value: 'luke@skywalker.com' }] };
        const selected = selector(getState(user));
        expect(selected.userName).to.equal('luke@skywalker.com');
      });
    });
  });
});
