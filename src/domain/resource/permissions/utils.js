import difference from 'lodash/difference';
import get from 'lodash/get';

import {
  resourceRoles,
  resourcePermissionTypes,
  resourcePermissionsByRole,
  UI_UNIT_STAFF_ROLES,
} from './constants';

const permissionOptions = Object.values(resourcePermissionTypes);
const allValuesInArray = (subset, superset) =>
  difference(subset, superset).length === 0;

export function hasPermissionForResource(resourceRole, requiredPermissions) {
  // undefined roles don't receive any permissions implicitly
  if (!resourceRole) {
    return false;
  }

  if (!Object.values(resourceRoles).includes(resourceRole)) {
    throw Error(
      `resourceRole needs to be one of: ${Object.values(resourceRoles).join(
        ', '
      )}.`
    );
  }

  if (
    !Array.isArray(requiredPermissions) &&
    typeof requiredPermissions !== 'string'
  ) {
    throw Error('requiredPermissions has to be either a string or an array.');
  }

  if (
    Array.isArray(requiredPermissions) &&
    !allValuesInArray(requiredPermissions, permissionOptions)
  ) {
    const unknownPermissions = difference(
      requiredPermissions,
      permissionOptions
    );

    // eslint-disable-next-line no-console
    console.warn(
      [
        `Permission asked with unknown permission: ${unknownPermissions.join(
          ', '
        )}.`,
        `Permission needs to be on of: ${permissionOptions.join(', ')}.`,
      ].join('\n')
    );
  }

  if (
    typeof requiredPermissions === 'string' &&
    !permissionOptions.includes(requiredPermissions)
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      [
        `Permission asked with unknown permission: ${requiredPermissions}.`,
        `Permission needs to be on of: ${permissionOptions.join(', ')}.`,
      ].join('\n')
    );
  }

  const rolePermissions = resourcePermissionsByRole[resourceRole];

  if (Array.isArray(requiredPermissions)) {
    return allValuesInArray(requiredPermissions, rolePermissions);
  }

  return rolePermissions.includes(requiredPermissions);
}

const getUserPermissions = (resource) =>
  get(resource, 'user_permissions', false) ||
  get(resource, 'userPermissions', undefined);

// Returns the role with the most permissions or null.
export function getUnitRoleFromResource(resource) {
  const userPermissions = getUserPermissions(resource);

  if (!userPermissions) {
    return null;
  }

  if (userPermissions.is_admin || userPermissions.isAdmin) {
    return resourceRoles.UNIT_ADMINISTRATOR;
  }

  if (userPermissions.is_manager || userPermissions.isManager) {
    return resourceRoles.UNIT_MANAGER;
  }

  if (userPermissions.is_viewer || userPermissions.isViewer) {
    return resourceRoles.UNIT_VIEWER;
  }

  return null;
}

export function getIsUnitStaff(unitRole) {
  return UI_UNIT_STAFF_ROLES.includes(unitRole);
}
