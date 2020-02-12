import difference from 'lodash/difference';

import { resourceRoles, resourcePermissionTypes, resourcePermissionsByRole } from './constants';

// Returns the role with the most permissions or null.
export function roleMapper(isAdmin, isManager, isViewer) {
  if (isAdmin) {
    return resourceRoles.UNIT_ADMINISTRATOR;
  }

  if (isManager) {
    return resourceRoles.UNIT_MANAGER;
  }

  if (isViewer) {
    return resourceRoles.UNIT_VIEWER;
  }

  return null;
}

const permissionOptions = Object.values(resourcePermissionTypes);
const allValuesInArray = (subset, superset) => difference(subset, superset).length === 0;

export function hasPermissionForResource(resourceRole, requiredPermissions) {
  // undefined roles don't receive any permissions implicitly
  if (resourceRole === undefined || resourceRole === null) {
    return false;
  }

  if (!Object.values(resourceRoles).includes(resourceRole)) {
    throw Error(`resourceRole needs to be one of: ${Object.values(resourceRoles).join(', ')}.`);
  }

  if (!Array.isArray(requiredPermissions) && typeof requiredPermissions !== 'string') {
    throw Error('requiredPermissions has to be either a string or an array.');
  }

  if (
    Array.isArray(requiredPermissions)
    && !allValuesInArray(requiredPermissions, permissionOptions)
  ) {
    const unknownPermissions = difference(requiredPermissions, permissionOptions);

    // eslint-disable-next-line no-console
    console.warn([
      `Permission asked with unknown permission: ${unknownPermissions.join(', ')}.`,
      `Permission needs to be on of: ${permissionOptions.join(', ')}.`,
    ].join('\n'));
  }

  if (typeof requiredPermissions === 'string' && !permissionOptions.includes(requiredPermissions)) {
    // eslint-disable-next-line no-console
    console.warn([
      `Permission asked with unknown permission: ${requiredPermissions}.`,
      `Permission needs to be on of: ${permissionOptions.join(', ')}.`,
    ].join('\n'));
  }

  const rolePermissions = resourcePermissionsByRole[resourceRole];

  if (Array.isArray(requiredPermissions)) {
    return allValuesInArray(requiredPermissions, rolePermissions);
  }

  return rolePermissions.includes(requiredPermissions);
}
