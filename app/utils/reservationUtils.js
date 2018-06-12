import camelCase from 'lodash/camelCase';
import clone from 'lodash/clone';
import find from 'lodash/find';
import last from 'lodash/last';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import tail from 'lodash/tail';
import moment from 'moment';

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
  return some(resource.requiredReservationExtraFields, field => (
    !reservation[camelCase(field)]
  ));
}

function getCurrentReservation(reservations) {
  const now = moment();
  return find(
    reservations, reservation => moment(reservation.begin) < now && now < moment(reservation.end)
  );
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

function getNextAvailableTime(reservations, fromMoment = moment()) {
  const combinedReservations = combine(reservations);
  if (!combinedReservations.length || fromMoment < moment(combinedReservations[0].begin)) {
    return fromMoment;
  }
  const ongoingReservation = find(combinedReservations, reservation => (
    moment(reservation.begin) <= fromMoment && fromMoment < moment(reservation.end)
  ));
  return ongoingReservation ? moment(ongoingReservation.end) : fromMoment;
}

function getNextReservation(reservations) {
  const now = moment();
  const orderedReservations = sortBy(reservations, reservation => moment(reservation.begin));
  return find(orderedReservations, reservation => now < moment(reservation.begin));
}

function getEditReservationUrl(reservation) {
  const { begin, end, id, resource } = reservation;
  const date = moment(begin).format('YYYY-MM-DD');
  const beginStr = moment(begin).format('HH:mm');
  const endStr = moment(end).format('HH:mm');

  return `/reservation?begin=${beginStr}&date=${date}&end=${endStr}&id=${id || ''}&resource=${resource}`;
}

export {
  combine,
  isStaffEvent,
  getCurrentReservation,
  getEditReservationUrl,
  getMissingValues,
  getNextAvailableTime,
  getNextReservation,
};
