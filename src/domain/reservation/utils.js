import moment from 'moment';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import clone from 'lodash/clone';
import tail from 'lodash/tail';
import last from 'lodash/last';
import merge from 'lodash/merge';

import client from '../../common/api/client';
import { getLinkString } from '../../common/url/utils';

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
 * Returns a reservation page url with the given query params.
 * @param reservation {object} Reservation object.
 * @param query {object}
 * @returns {string}
 */
export const getReservationPageLink = (reservation, query) => {
  return getLinkString(`/resources/${reservation.id}`, query);
};


// HTTP Utils

/**
 * Edit existing reservation API helper
 * @param {Object} reservation Original reservation data
 * @param {Object} fields Edit fields object
 * @memberof ManageReservationsPage
 * @returns {Promise}
 */
export const putReservation = (reservation, fields) => {
  return client.put(`reservation/${reservation.id}`, merge(reservation, fields), { include: 'resource_detail' });
};
/**
 * Delete/Cancel reservation
 *
 * @param {Object} reservation
 * @returns {Promise}
 */
export const cancelReservation = (reservation) => {
  return client.delete(`reservation/${reservation.id}`);
};

/**
 * Get reservation detail by reservation id
 *
 * @param {Object} reservationId Filters
 * @returns {Promise}
 */
export const getReservationById = (reservationId) => {
  return client.get(`reservation/${reservationId}`);
};
