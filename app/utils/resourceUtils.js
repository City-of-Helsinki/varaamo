import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import moment from 'moment';
import queryString from 'query-string';

import constants from 'constants/AppConstants';
import { getCurrentReservation, getNextAvailableTime } from 'utils/reservationUtils';

function isOpenNow(resource) {
  const { closes, opens } = getOpeningHours(resource);
  const now = moment();
  if (now >= moment(opens) && now <= moment(closes)) {
    return true;
  }
  return false;
}

function getAvailabilityDataForNow(resource = {}) {
  const { closes, opens } = getOpeningHours(resource);
  const reservations = getOpenReservations(resource);

  if (!closes || !opens) {
    return { status: 'closed', bsStyle: 'danger' };
  }

  const nowMoment = moment();
  const opensMoment = moment(opens);
  const closesMoment = moment(closes);
  const beginMoment = nowMoment > opensMoment ? nowMoment : opensMoment;
  const currentReservation = getCurrentReservation(reservations);

  if (nowMoment > closesMoment) {
    return { status: 'closed', bsStyle: 'danger' };
  }

  if (currentReservation || nowMoment < opensMoment) {
    const nextAvailableTime = getNextAvailableTime(reservations, beginMoment);
    if (nextAvailableTime < closesMoment) {
      return {
        status: 'availableAt',
        bsStyle: 'danger',
        values: { time: nextAvailableTime.format(constants.TIME_FORMAT) },
      };
    }
    return { status: 'reserved', bsStyle: 'danger' };
  }

  return { status: 'available', bsStyle: 'success' };
}

function getAvailabilityDataForWholeDay(resource = {}, date = null) {
  const { closes, opens } = getOpeningHours(resource);
  const reservations = getOpenReservations(resource);

  if (!closes || !opens) {
    return { status: 'closed', bsStyle: 'danger' };
  }

  if (reservingIsRestricted(resource, date)) {
    return { status: 'reservingRestricted', bsStyle: 'danger' };
  }

  const opensMoment = moment(opens);
  const closesMoment = moment(closes);
  let total = closesMoment - opensMoment;

  forEach(reservations, (reservation) => {
    const resBeginMoment = moment(reservation.begin);
    const resEndMoment = moment(reservation.end);
    total = (total - resEndMoment) + resBeginMoment;
  });

  const asHours = moment.duration(total).asHours();
  const rounded = Math.ceil(asHours * 2) / 2;

  if (rounded === 0) {
    return { status: 'reserved', bsStyle: 'danger' };
  }

  return {
    status: 'availableTime',
    bsStyle: 'success',
    values: { hours: rounded },
  };
}

function getHumanizedPeriod(period) {
  if (!period) {
    return '';
  }
  return `${moment.duration(period).hours()} h`;
}

function getOpeningHours(resource) {
  if (resource && resource.openingHours && resource.openingHours.length) {
    return {
      closes: resource.openingHours[0].closes,
      opens: resource.openingHours[0].opens,
    };
  }

  return {};
}

function getOpenReservations(resource) {
  return filter(resource.reservations, reservation => (
    reservation.state !== 'cancelled' && reservation.state !== 'denied'
  ));
}

function getResourcePageUrl(resource, date, time) {
  if (!resource || !resource.id) {
    return '';
  }
  const pathname = `/resources/${resource.id}`;
  const query = queryString.stringify({
    date: date ? date.split('T')[0] : undefined,
    time,
  });
  return query ? `${pathname}?${query}` : pathname;
}

function getTermsAndConditions(resource = {}) {
  const genericTerms = resource.genericTerms || '';
  const specificTerms = resource.specificTerms || '';

  if (genericTerms && specificTerms) {
    return `${specificTerms}\n\n${genericTerms}`;
  }
  return `${specificTerms}${genericTerms}`;
}

function reservingIsRestricted(resource, date) {
  if (!date) {
    return false;
  }
  const isAdmin = resource.userPermissions && resource.userPermissions.isAdmin;
  const isLimited = (
    resource.reservableBefore &&
    moment(resource.reservableBefore).isBefore(moment(date), 'day')
  );
  return Boolean(isLimited && !isAdmin);
}

export {
  isOpenNow,
  getAvailabilityDataForNow,
  getAvailabilityDataForWholeDay,
  getHumanizedPeriod,
  getOpeningHours,
  getOpenReservations,
  getResourcePageUrl,
  getTermsAndConditions,
  reservingIsRestricted,
};
