import { hasPermissionForResource, getUnitRoleFromResource, getIsUnitStaff } from '../utils';
import { resourceRoles, resourcePermissionTypes } from '../constants';

describe('domain resource permission utility functions', () => {
  describe('hasPermissionForResource', () => {
    test('should return false when resourceRole is undefined or null', () => {
      expect(hasPermissionForResource(null)).toEqual(false);
      expect(hasPermissionForResource(undefined)).toEqual(false);
    });

    test('throws an error when resourceRole is not supported', () => {
      expect(() => {
        hasPermissionForResource('IMAGINARY_ROLE');
      }).toThrowErrorMatchingSnapshot();
    });

    test('throws an error when requiredPermissions is not one of string or array', () => {
      expect(() => {
        hasPermissionForResource(resourceRoles.UNIT_ADMINISTRATOR, 0);
      }).toThrowErrorMatchingSnapshot();
    });

    test('warns when the permissions targeted with requiredPermissions are unknown', () => {
    // eslint-disable-next-line no-console
      const originalWarn = global.console.warn;
      let lastCall = null;
      const mockWarn = jest.fn((...args) => {
        lastCall = args;
      });
      // eslint-disable-next-line no-console
      global.console.warn = mockWarn;

      hasPermissionForResource(resourceRoles.UNIT_ADMINISTRATOR, 'IMAGINARY_PERMISSION');

      expect(lastCall).toMatchSnapshot();

      hasPermissionForResource(resourceRoles.UNIT_ADMINISTRATOR, ['IMAGINARY_PERMISSION_0', 'IMAGINARY_PERMISSION_1']);

      expect(lastCall).toMatchSnapshot();

      // eslint-disable-next-line no-console
      global.console.warn = originalWarn;
    });

    test('should work with a supported role and a known permission string', () => {
      const consoleWarnSpy = jest.spyOn(global.console, 'warn');
      const admin = resourceRoles.UNIT_ADMINISTRATOR;
      const viewer = resourceRoles.UNIT_VIEWER;
      const canIgnoreOpeningHours = resourcePermissionTypes.CAN_IGNORE_OPENING_HOURS;

      // Should return true because admin has this permission
      expect(hasPermissionForResource(admin, canIgnoreOpeningHours)).toEqual(true);
      // Should return false because viewer does not have this permission
      expect(hasPermissionForResource(viewer, canIgnoreOpeningHours)).toEqual(false);

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    test('should work with a supported role and an array of known permission strings', () => {
      const consoleWarnSpy = jest.spyOn(global.console, 'warn');
      const admin = resourceRoles.UNIT_ADMINISTRATOR;
      const viewer = resourceRoles.UNIT_VIEWER;
      const canIgnoreOpeningHoursAndModifyReservations = [
        resourcePermissionTypes.CAN_IGNORE_OPENING_HOURS, resourcePermissionTypes.CAN_MODIFY_RESERVATIONS,
      ];

      // Should return true because admin has all the permissions
      expect(hasPermissionForResource(admin, canIgnoreOpeningHoursAndModifyReservations)).toEqual(true);
      // Should return false because viewer does not have one of the permission
      expect(hasPermissionForResource(viewer, canIgnoreOpeningHoursAndModifyReservations)).toEqual(false);

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('getUnitRoleFromResource', () => {
    const doTestCases = (caseType) => {
      const isSnake = caseType === 'snake_case';
      const caseMap = {
        userPermissions: isSnake ? 'user_permissions' : 'userPermissions',
        isAdmin: isSnake ? 'is_admin' : 'isAdmin',
        isManager: isSnake ? 'is_manager' : 'isManager',
        isViewer: isSnake ? 'is_viewer' : 'isViewer',
      };
      const getTestResource = (isAdmin, isManager, isViewer) => {
        return {
          [caseMap.userPermissions]: {
            [caseMap.isAdmin]: isAdmin,
            [caseMap.isManager]: isManager,
            [caseMap.isViewer]: isViewer,
          },
        };
      };

      test(`returns null when ${caseMap.userPermissions} is not found`, () => {
        expect(getUnitRoleFromResource({})).toEqual(null);
      });

      test(`returns UNIT_ADMINISTRATOR when ${caseMap.isAdmin} is true`, () => {
        expect(getUnitRoleFromResource(getTestResource(true)))
          .toEqual(resourceRoles.UNIT_ADMINISTRATOR);
      });

      test(`returns UNIT_MANAGER when ${caseMap.isAdmin} is falsy and ${caseMap.isManager} is true`, () => {
        expect(getUnitRoleFromResource(getTestResource(false, true)))
          .toEqual(resourceRoles.UNIT_MANAGER);
      });

      // eslint-disable-next-line max-len
      test(`returns UNIT_MANAGER when ${caseMap.isAdmin} is falsy, ${caseMap.isManager} is falsy and ${caseMap.isViewer} is true`, () => {
        expect(getUnitRoleFromResource(getTestResource(false, false, true)))
          .toEqual(resourceRoles.UNIT_VIEWER);
      });

      test('returns null otherwise', () => {
        expect(getUnitRoleFromResource(getTestResource(false, false, false)))
          .toEqual(null);
      });
    };

    describe('when using snake_case', () => {
      doTestCases('snake_case');
    });

    describe('when using camelCase', () => {
      doTestCases('camelCase');
    });
  });

  describe('getIsUnitStaff', () => {
    test('returns true for UNIT_ADMINISTRATOR, UNIT_MANAGER, UNIT_VIEWER', () => {
      expect(getIsUnitStaff(resourceRoles.UNIT_ADMINISTRATOR)).toEqual(true);
      expect(getIsUnitStaff(resourceRoles.UNIT_MANAGER)).toEqual(true);
      expect(getIsUnitStaff(resourceRoles.UNIT_VIEWER)).toEqual(true);
    });

    test('returns false otherwise', () => {
      expect(getIsUnitStaff('UNIT_RESERVER')).toEqual(false);
      expect(getIsUnitStaff(null)).toEqual(false);
      expect(getIsUnitStaff(undefined)).toEqual(false);
      expect(getIsUnitStaff(0)).toEqual(false);
    });
  });
});
