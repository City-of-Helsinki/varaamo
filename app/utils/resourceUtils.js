import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import moment from 'moment';
import queryString from 'query-string';

import constants from 'constants/AppConstants';
import { getCurrentReservation, getNextAvailableTime } from 'utils/reservationUtils';
import { getProperty } from 'utils/translationUtils';

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
    return { text: 'Suljettu', bsStyle: 'danger' };
  }

  const nowMoment = moment();
  const opensMoment = moment(opens);
  const closesMoment = moment(closes);
  const beginMoment = nowMoment > opensMoment ? nowMoment : opensMoment;
  const currentReservation = getCurrentReservation(reservations);

  if (nowMoment > closesMoment) {
    return { text: 'Suljettu', bsStyle: 'danger' };
  }

  if (currentReservation || nowMoment < opensMoment) {
    const nextAvailableTime = getNextAvailableTime(reservations, beginMoment);
    if (nextAvailableTime < closesMoment) {
      return {
        text: `Vapautuu klo ${nextAvailableTime.format(constants.TIME_FORMAT)}`,
        bsStyle: 'danger',
      };
    }
    return { text: 'Varattu koko päivän', bsStyle: 'danger' };
  }

  return { text: 'Heti vapaa', bsStyle: 'success' };
}

function getAvailabilityDataForWholeDay(resource = {}) {
  const { closes, opens } = getOpeningHours(resource);
  const reservations = getOpenReservations(resource);

  if (!closes || !opens) {
    return { text: 'Suljettu', bsStyle: 'danger' };
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
    return { text: 'Varattu koko päivän', bsStyle: 'danger' };
  }

  return {
    text: rounded === 1 ? `Vapaata ${rounded} tunti` : `Vapaata ${rounded} tuntia`,
    bsStyle: 'success',
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
  const genericTerms = getProperty(resource, 'genericTerms');
  const specificTerms = getProperty(resource, 'specificTerms');

  if (genericTerms && specificTerms) {
    return `${specificTerms}\n\n${genericTerms}`;
  }
  return `${specificTerms}${genericTerms}`;
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
};
