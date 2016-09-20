import camelCase from 'lodash/camelCase';
import clone from 'lodash/clone';
import last from 'lodash/last';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import tail from 'lodash/tail';

import constants from 'constants/AppConstants';

function combine(reservations) {
  if (!reservations || !reservations.length) {
    return [];
  }

  const sorted = sortBy(reservations, 'begin');
  const initialValue = [clone(sorted[0])];

  return tail(sorted).reduce((previous, current) => {
    if (current.begin === last(previous).end) {
      last(previous).end = current.end;
    } else {
      previous.push(clone(current));
    }
    return previous;
  }, initialValue);
}

function isStaffEvent(reservation, resource) {
  if (!resource || !resource.requiredReservationExtraFields) {
    return false;
  }
  return some(resource.requiredReservationExtraFields, (field) => (
    !reservation[camelCase(field)]
  ));
}

function getMissingValues(reservation) {
  const missingValues = {};
  constants.REQUIRED_STAFF_EVENT_FIELDS.forEach((field) => {
    if (!reservation[field]) {
      missingValues[field] = '-';
    }
  });
  return missingValues;
}

export {
  combine,
  isStaffEvent,
  getMissingValues,
};
