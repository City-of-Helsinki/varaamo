import User from '../../../utils/fixtures/User';
import Resource from '../../../utils/fixtures/Resource';
import { getState } from '../../../utils/testUtils';
import {
  currentUserSelector,
  isAdminSelector,
  isLoggedInSelector,
  createIsStaffSelector,
} from '../authSelectors';

describe('state/selectors/authSelectors', () => {
  describe('currentUserSelector', () => {
    function getSelected(extraState) {
      const state = getState(extraState);
      return currentUserSelector(state);
    }

    test('returns user corresponding to the auth.userId', () => {
      const user = User.build();
      const selected = getSelected({
        auth: { userId: user.id },
        'data.users': { [user.id]: user },
      });
      expect(selected).toEqual(user);
    });

    test('returns an empty object if logged in user data does not exist', () => {
      const selected = getSelected({
        auth: { userId: 'u-999' },
      });
      expect(selected).toEqual({});
    });

    test('returns an empty object if user is not logged in', () => {
      const user = User.build();
      const selected = getSelected({
        auth: { userId: null },
        'data.users': { [user.id]: user },
      });
      expect(selected).toEqual({});
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

    test('returns false if user is not logged in', () => {
      const user = {};
      expect(getSelected(user)).toBe(false);
    });

    test('returns false if user.isStaff is false', () => {
      const user = { id: 'u-1', isStaff: false };
      expect(getSelected(user)).toBe(false);
    });

    test('returns true if user.isStaff is true', () => {
      const user = { id: 'u-1', isStaff: true };
      expect(getSelected(user)).toBe(true);
    });
  });

  describe('isLoggedInSelector', () => {
    function getSelected({ token, userId }) {
      const state = getState({ auth: { token, userId } });
      return isLoggedInSelector(state);
    }

    test('returns false if token is null', () => {
      expect(getSelected({ token: null, userId: 'u-1' })).toBe(false);
    });

    test('returns false if userId is null', () => {
      expect(getSelected({ token: 'mock-token', userId: null })).toBe(false);
    });

    test('returns true if both token and userId are defined', () => {
      expect(getSelected({ token: 'mock-token', userId: 'u-1' })).toBe(true);
    });
  });

  describe('createIsStaffSelector', () => {
    const getMockResource = overrides => ({
      ...Resource.build(),
      ...overrides,
    });
    const mockResourceSelector = overrides => () => getMockResource(overrides);

    test('returns true when the user has unit admin permission for resource', () => {
      const selector = createIsStaffSelector(mockResourceSelector({ userPermissions: { isAdmin: true } }));

      expect(selector()).toEqual(true);
    });

    test('returns true when the user has unit manager permission for resource', () => {
      const selector = createIsStaffSelector(mockResourceSelector({ userPermissions: { isManager: true } }));

      expect(selector()).toEqual(true);
    });
  });
});
