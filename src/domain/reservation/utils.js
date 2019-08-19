import moment from 'moment';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import clone from 'lodash/clone';
import tail from 'lodash/tail';
import last from 'lodash/last';
import merge from 'lodash/merge';

import client from '../../common/api/client';

export const combineReservations = (reservations) => {
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
};

export const getNextAvailableTime = (reservations, fromMoment = moment()) => {
  const combinedReservations = combineReservations(reservations);
  if (!combinedReservations.length || fromMoment < moment(combinedReservations[0].begin)) {
    return fromMoment;
  }

  const ongoingReservation = find(combinedReservations, reservation => (
    moment(reservation.begin) <= fromMoment && fromMoment < moment(reservation.end)
  ));

  return ongoingReservation ? moment(ongoingReservation.end) : fromMoment;
};

export const getCurrentReservation = (reservations) => {
  const now = moment();
  return find(reservations, (reservation) => {
    return moment(reservation.begin) < now && now < moment(reservation.end);
  });
};

/**
 * Edit existing reservation API helper
 * @param {Object} reservation Original reservation data
 * @param {Object} fields Edit fields object
 * @memberof ManageReservationsPage
 * @returns {Promise}
 */
export const putReservation = (reservation, fields) => {
  client.put('reservation', merge(reservation, fields));
};

/**
 * Generate reservation edit URL from reservation data.
 *
 * @param {*} reservation
 * @returns {string} Reservation URL
 */
export const getEditReservationUrl = (reservation) => {
  const {
    begin, end, id, resource
  } = reservation;
  const date = moment(begin).format('YYYY-MM-DD');
  const beginStr = moment(begin).format('HH:mm');
  const endStr = moment(end).format('HH:mm');

  return `/reservation?begin=${beginStr}&date=${date}&end=${endStr}&id=${id || ''}&resource=${resource.id}`;
};
