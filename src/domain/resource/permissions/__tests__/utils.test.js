import { hasPermissionForResource, roleMapper } from '../utils';
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

  describe('roleMapper', () => {
    test('returns UNIT_ADMINISTRATOR when isAdmin is true', () => {
      expect(roleMapper(true)).toEqual(resourceRoles.UNIT_ADMINISTRATOR);
    });

    test('returns UNIT_MANAGER when isAdmin is falsy and isManager is true', () => {
      expect(roleMapper(false, true)).toEqual(resourceRoles.UNIT_MANAGER);
    });

    test('returns UNIT_MANAGER when isAdmin is falsy, isManager is falsy and isViewer is true', () => {
      expect(roleMapper(false, false, true)).toEqual(resourceRoles.UNIT_VIEWER);
    });

    test('returns null when all parameters are falsy', () => {
      expect(roleMapper(false, false, false)).toEqual(null);
    });
  });
});
