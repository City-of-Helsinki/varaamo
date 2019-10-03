import moment from 'moment';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import clone from 'lodash/clone';
import tail from 'lodash/tail';
import last from 'lodash/last';
import merge from 'lodash/merge';
import get from 'lodash/get';

import client from '../../common/api/client';
import { RESERVATION_STATE } from '../../constants/ReservationState';

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

/**
 * Check if current user (logged in user) have
 * permission to modify selected reservation.
 *
 * Reservation which in canceled state can not be changed to something else.
 *
 * @param {Object} reservation
 * @returns {Boolean} False by default
 */
export const canUserModifyReservation = (reservation) => {
  if (get(reservation, 'user_permissions.can_modify', false)
      && reservation.state !== RESERVATION_STATE.CANCELLED) {
    return true;
  }

  return false;
};

/**
 * Check if current user (logged in user) have
 * permission to cancel (delete) selected reservation.
 *
 * Reservation which in canceled state can not be changed to something else.
 *
 * @param {Object} reservation
 * @returns {Boolean} False by default
 */
export const canUserCancelReservation = (reservation) => {
  if (get(reservation, 'user_permissions.can_delete', false)
      && reservation.state !== RESERVATION_STATE.CANCELLED) {
    return true;
  }

  return false;
};
