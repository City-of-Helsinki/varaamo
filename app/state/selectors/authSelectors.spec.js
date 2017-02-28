import { expect } from 'chai';

import User from 'utils/fixtures/User';
import { getState } from 'utils/testUtils';
import {
  currentUserSelector,
  isAdminSelector,
  isLoggedInSelector,
  staffUnitsSelector,
} from './authSelectors';

describe('state/selectors/authSelectors', () => {
  describe('currentUserSelector', () => {
    function getSelected(extraState) {
      const state = getState(extraState);
      return currentUserSelector(state);
    }

    it('returns user corresponding to the auth.userId', () => {
      const user = User.build();
      const selected = getSelected({
        auth: { userId: user.id },
        'data.users': { [user.id]: user },
      });
      expect(selected).to.deep.equal(user);
    });

    it('returns an empty object if logged in user data does not exist', () => {
      const selected = getSelected({
        auth: { userId: 'u-999' },
      });
      expect(selected).to.deep.equal({});
    });

    it('returns an empty object if user is not logged in', () => {
      const user = User.build();
      const selected = getSelected({
        auth: { userId: null },
        'data.users': { [user.id]: user },
      });
      expect(selected).to.deep.equal({});
    });
  });

  describe('isAdminSelector', () => {
    function getSelected(user = {}) {
      const state = getState({
        auth: { userId: user.id },
        'data.users': { [user.id]: user },
      });
      return isAdminSelector(state);
    }

    it('returns false if user is not logged in', () => {
      const user = {};
      expect(getSelected(user)).to.be.false;
    });

    it('returns false if user.isStaff is false', () => {
      const user = { id: 'u-1', isStaff: false };
      expect(getSelected(user)).to.be.false;
    });

    it('returns true if user.isStaff is true', () => {
      const user = { id: 'u-1', isStaff: true };
      expect(getSelected(user)).to.be.true;
    });
  });

  describe('isLoggedInSelector', () => {
    function getSelected({ token, userId }) {
      const state = getState({ auth: { token, userId } });
      return isLoggedInSelector(state);
    }

    it('returns false if token is null', () => {
      expect(getSelected({ token: null, userId: 'u-1' })).to.be.false;
    });

    it('returns false if userId is null', () => {
      expect(getSelected({ token: 'mock-token', userId: null })).to.be.false;
    });

    it('returns true if both token and userId are defined', () => {
      expect(getSelected({ token: 'mock-token', userId: 'u-1' })).to.be.true;
    });
  });

  describe('staffUnitsSelector', () => {
    function getSelected(user) {
      const state = {
        auth: {
          userId: user.id,
          token: 'mock-token',
        },
        data: {
          users: { [user.id]: user },
        },
      };
      return staffUnitsSelector(state);
    }

    it('returns unit ids where user has can_approve_reservation permission', () => {
      const user = User.build({
        staffPerms: {
          unit: {
            'unit-1': ['can_approve_reservation'],
            'unit-2': ['can_approve_reservation'],
          },
        },
      });
      const selected = getSelected(user);
      const expected = ['unit-1', 'unit-2'];

      expect(selected).to.deep.equal(expected);
    });

    it(
      'does not return unit ids where user does not have can_approve_reservation permission',
      () => {
        const user = User.build({
          staffPerms: {
            unit: {
              'unit-1': ['can_approve_something_else'],
              'unit-2': ['can_approve_reservation'],
              'unit-3': [],
            },
          },
        });
        const selected = getSelected(user);
        const expected = ['unit-2'];

        expect(selected).to.deep.equal(expected);
      }
    );

    it('returns an empty array if user has no staff permissions', () => {
      const user = User.build();
      const selected = getSelected(user);

      expect(selected).to.deep.equal([]);
    });

    it('returns an empty array if user has no staff permissions for units', () => {
      const user = User.build({
        staffPerms: {
          unit: {},
        },
      });
      const selected = getSelected(user);

      expect(selected).to.deep.equal([]);
    });
  });
});
