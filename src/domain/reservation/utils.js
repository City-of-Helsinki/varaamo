import moment from 'moment';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import clone from 'lodash/clone';
import tail from 'lodash/tail';
import last from 'lodash/last';

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
