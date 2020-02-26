export const resourcePermissionTypes = Object.freeze({
  CAN_MAKE_RESERVATIONS: 'can_make_reservations',
  CAN_MODIFY_RESERVATIONS: 'can_modify_reservations',
  CAN_IGNORE_OPENING_HOURS: 'can_ignore_opening_hours',
  CAN_VIEW_RESERVATIONS_ACCESS_CODE: 'can_view_reservation_access_code',
  CAN_VIEW_RESERVATION_EXTRA_FIELDS: 'can_view_reservation_extra_fields',
  CAN_VIEW_RESERVATION_USER: 'can_view_reservation_user',
  CAN_ACCESS_RESERVATION_COMMENTS: 'can_access_reservation_comments',
  CAN_COMMENT_RESERVATIONS: 'can_comment_reservations',
  CAN_VIEW_RESERVATION_CATERING_ORDERS: 'can_view_reservation_catering_orders',
  CAN_BYPASS_PAYMENT: 'can_bypass_payment',
});

export const resourceRoles = Object.freeze({
  UNIT_ADMINISTRATOR: 'UNIT_ADMINISTRATOR',
  UNIT_MANAGER: 'UNIT_MANAGER',
  UNIT_VIEWER: 'UNIT_VIEWER',
});

const UNIT_ADMINISTRATOR_PERMISSIONS = [
  resourcePermissionTypes.CAN_MAKE_RESERVATIONS,
  resourcePermissionTypes.CAN_MODIFY_RESERVATIONS,
  resourcePermissionTypes.CAN_IGNORE_OPENING_HOURS,
  resourcePermissionTypes.CAN_VIEW_RESERVATIONS_ACCESS_CODE,
  resourcePermissionTypes.CAN_VIEW_RESERVATION_EXTRA_FIELDS,
  resourcePermissionTypes.CAN_VIEW_RESERVATION_USER,
  resourcePermissionTypes.CAN_ACCESS_RESERVATION_COMMENTS,
  resourcePermissionTypes.CAN_COMMENT_RESERVATIONS,
  resourcePermissionTypes.CAN_VIEW_RESERVATION_CATERING_ORDERS,
  resourcePermissionTypes.CAN_BYPASS_PAYMENT,
];
const UNIT_MANAGER_PERMISSIONS = [
  resourcePermissionTypes.CAN_MAKE_RESERVATIONS,
  resourcePermissionTypes.CAN_MODIFY_RESERVATIONS,
  resourcePermissionTypes.CAN_IGNORE_OPENING_HOURS,
  resourcePermissionTypes.CAN_VIEW_RESERVATIONS_ACCESS_CODE,
  resourcePermissionTypes.CAN_VIEW_RESERVATION_EXTRA_FIELDS,
  resourcePermissionTypes.CAN_VIEW_RESERVATION_USER,
  resourcePermissionTypes.CAN_ACCESS_RESERVATION_COMMENTS,
  resourcePermissionTypes.CAN_COMMENT_RESERVATIONS,
  resourcePermissionTypes.CAN_VIEW_RESERVATION_CATERING_ORDERS,
  resourcePermissionTypes.CAN_BYPASS_PAYMENT,
];
const UNIT_VIEWER_PERMISSIONS = [
  resourcePermissionTypes.CAN_MODIFY_RESERVATIONS,
  resourcePermissionTypes.CAN_VIEW_RESERVATIONS_ACCESS_CODE,
  resourcePermissionTypes.CAN_VIEW_RESERVATION_EXTRA_FIELDS,
  resourcePermissionTypes.CAN_VIEW_RESERVATION_USER,
  resourcePermissionTypes.CAN_ACCESS_RESERVATION_COMMENTS,
  resourcePermissionTypes.CAN_COMMENT_RESERVATIONS,
];
export const resourcePermissionsByRole = Object.freeze({
  [resourceRoles.UNIT_ADMINISTRATOR]: UNIT_ADMINISTRATOR_PERMISSIONS,
  [resourceRoles.UNIT_MANAGER]: UNIT_MANAGER_PERMISSIONS,
  [resourceRoles.UNIT_VIEWER]: UNIT_VIEWER_PERMISSIONS,
});
