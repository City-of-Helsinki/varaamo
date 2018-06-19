import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import moment from 'moment';
import queryString from 'query-string';

import constants from 'constants/AppConstants';
import { getCurrentReservation, getNextAvailableTime } from 'utils/reservationUtils';

function hasMaxReservations(resource) {
  let isMaxReservations = false;
  if (resource.maxReservationsPerUser && resource.reservations) {
    const ownReservations = filter(resource.reservations, { isOwn: true });
    let reservationCounter = 0;
    forEach(ownReservations, (reservation) => {
      if (moment(reservation.end).isAfter(moment())) {
        reservationCounter += 1;
      }
    });
    isMaxReservations = reservationCounter >= resource.maxReservationsPerUser;
  }
  return isMaxReservations;
}

function isOpenNow(resource) {
  const { closes, opens } = getOpeningHours(resource);
  const now = moment();
  if (now >= moment(opens) && now <= moment(closes)) {
    return true;
  }
  return false;
}

function getAvailabilityDataForNow(resource = {}, date = null) {
  const { closes, opens } = getOpeningHours(resource, date);
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
  const { closes, opens } = getOpeningHours(resource, date);
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
    if (!resBeginMoment.isSame(opensMoment, 'd')) {
      return;
    }
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

function getHourlyPrice(t, { minPricePerHour, maxPricePerHour }) {
  if (!(minPricePerHour || maxPricePerHour)) {
    return t('ResourceIcons.free');
  }
  if ((minPricePerHour && maxPricePerHour) && (minPricePerHour !== maxPricePerHour)) {
    return `${Number(minPricePerHour)} - ${Number(maxPricePerHour)} €/h`;
  }
  const priceString = maxPricePerHour || minPricePerHour;
  const price = priceString !== 0 ? Number(priceString) : 0;
  if (price === 0) {
    return t('ResourceIcons.free');
  }
  return price ? `${price} €/h` : null;
}

function getHumanizedPeriod(period) {
  if (!period) {
    return '';
  }
  return `${moment.duration(period).hours()} h`;
}

function getMaxPeriodText(t, { maxPeriod }) {
  const hours = moment.duration(maxPeriod).asHours();
  const days = parseInt(moment.duration(maxPeriod).asDays(), 10);
  if (days > 0) {
    return t('ResourceHeader.maxPeriodDays', { days });
  }
  return t('ResourceHeader.maxPeriodHours', { hours });
}

function getOpeningHours(resource, selectedDate) {
  if (resource && resource.openingHours && resource.openingHours.length) {
    if (selectedDate) {
      const openingHours = find(resource.openingHours, ({ date }) => date === selectedDate);
      return openingHours ? {
        closes: openingHours.closes,
        opens: openingHours.opens,
      } : {};
    }
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
  hasMaxReservations,
  isOpenNow,
  getAvailabilityDataForNow,
  getAvailabilityDataForWholeDay,
  getHourlyPrice,
  getHumanizedPeriod,
  getMaxPeriodText,
  getOpeningHours,
  getOpenReservations,
  getResourcePageUrl,
  getTermsAndConditions,
  reservingIsRestricted,
};
