import round from 'lodash/round';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import moment from 'moment';

import * as urlUtils from '../../common/url/utils';
import * as dataUtils from '../../common/data/utils';
import * as reservationUtils from '../reservation/utils';
import constants from '../../../app/constants/AppConstants';


/**
 * Getter for resource page link.
 * Returns a resource page url with the given query params.
 * @param resource
 * @param query
 * @returns {string}
 */
export const getResourcePageLink = (resource, query) => {
  return urlUtils.getLinkString(`/resources/${resource.id}`, query);
};

/**
 * Getter for formatted unit address string.
 * @param unit
 * @param locale
 * @returns {string}
 */
export const getUnitAddress = (unit, locale) => {
  let postal;
  const streetAddress = dataUtils.getLocalizedFieldValue(unit.street_address, locale);
  if (unit && unit.address_zip) {
    postal = unit.address_zip;
  }
  if (unit && unit.municipality) {
    postal = postal ? `${postal} ${unit.municipality}` : unit.municipality;
  }

  return `${streetAddress}${postal ? ` ${postal}` : ''}`;
};

/**
 * Getter for formatted resource distance string.
 * @param resource
 * @returns {string}
 */
export const getResourceDistance = (resource) => {
  const km = resource.distance / 1000;
  return km ? `${round(km, km < 10 ? 1 : null)} km` : '';
};

/**
 * Getter for price string used in resource cards.
 * @param resource
 * @param t
 * @returns {string|*}
 */
export const getPrice = (resource, t) => {
  const minPricePerHour = resource.min_price_per_hour;
  const maxPricePerHour = resource.max_price_per_hour;

  if (!(minPricePerHour || maxPricePerHour)) {
    return t('ResourceIcons.free');
  }

  if (minPricePerHour && maxPricePerHour && minPricePerHour !== maxPricePerHour) {
    return `${Number(minPricePerHour)} - ${Number(maxPricePerHour)} €/h`;
  }

  const priceString = maxPricePerHour || minPricePerHour;
  const price = priceString !== 0 ? Number(priceString) : 0;
  if (price === 0) {
    return t('ResourceIcons.free');
  }

  return price ? `${price} €/h` : null;
};

export const isFree = (resource) => {
  const minPricePerHour = resource.min_price_per_hour;
  const maxPricePerHour = resource.max_price_per_hour;

  if (!(minPricePerHour || maxPricePerHour)) {
    return true;
  }

  if (minPricePerHour && maxPricePerHour && minPricePerHour !== maxPricePerHour) {
    return false;
  }

  const priceString = maxPricePerHour || minPricePerHour;
  const price = priceString !== 0 ? Number(priceString) : 0;

  return price === 0;
};

export const getOpeningHours = (resource, date = null) => {
  if (!resource) {
    return null;
  }

  const openingHours = get(resource, 'opening_hours', []);
  if (!openingHours.length) {
    return null;
  }

  const index = date ? findIndex(openingHours, item => item.date === date) : 0;
  return {
    closes: get(openingHours, `[${index}].closes`),
    opens: get(openingHours, `[${index}].opens`),
  };
};

/**
 * getOpeningHoursForWeek();
 * @param resource
 * @param date
 * @returns {[]}
 */
export const getOpeningHoursForWeek = (resource, date = null) => {
  let momentDate = moment(date)
    .startOf('week');

  const openingHours = [];
  for (let i = 0; i < 7; i++) {
    openingHours.push({
      date: momentDate.format(constants.DATE_FORMAT),
      ...getOpeningHours(resource, momentDate.format(constants.DATE_FORMAT)),
    });
    momentDate = momentDate.add(1, 'day');
  }

  return openingHours;
};

/**
 * getFullCalendarBusinessHours();
 * @param resource
 * @param date
 * @returns {[]}
 */
export const getFullCalendarBusinessHours = (resource, date = null) => {
  const openingHours = getOpeningHoursForWeek(resource, date);
  const businessHours = [];

  openingHours.forEach((item) => {
    if (item) {
      const dayNumber = Number(moment(item.date).format('E'));
      businessHours.push({
        daysOfWeek: [dayNumber < 7 ? dayNumber : 0],
        startTime: item.opens ? moment(item.opens).format('HH:mm') : '00:00',
        endTime: item.closes ? moment(item.closes).format('HH:mm') : '00:00',
      });
    }
  });

  return businessHours;
};

/**
 * getFullCalendarMinTime();
 * @param resource {object}
 * @param date {string}
 * @param view {string}
 * @param buffer {number} buffer in hours.
 * @returns {string}
 */
export const getFullCalendarMinTime = (resource, date, view, buffer = 1) => {
  const defaultMin = '07:00:00';
  let openingHours = null;
  switch (view) {
    case 'timeGridDay':
      openingHours = [getOpeningHours(resource, date)];
      break;
    case 'timeGridWeek':
      openingHours = getOpeningHoursForWeek(resource, date);
      break;
    default:
      openingHours = null;
  }

  if (!openingHours) {
    return defaultMin;
  }

  let min;
  openingHours.forEach((item) => {
    if (item.opens) {
      const opens = moment(item.opens);

      if (!min || (opens.minutes() + opens.hours() * 60) < (min.minutes() + min.hours() * 60)) {
        min = opens;
      }
    }
  });

  if (min) {
    return min
      .subtract(buffer, 'hour')
      .format('HH:mm:ss');
  }

  return defaultMin;
};

/**
 * getFullCalendarMaxTime();
 * @param resource {object}
 * @param date {string}
 * @param view {string}
 * @param buffer {number} buffer in hours.
 * @returns {string}
 */
export const getFullCalendarMaxTime = (resource, date, view, buffer = 1) => {
  const defaultMax = '17:00:00';
  let openingHours = null;
  switch (view) {
    case 'timeGridDay':
      openingHours = [getOpeningHours(resource, date)];
      break;
    case 'timeGridWeek':
      openingHours = getOpeningHoursForWeek(resource, date);
      break;
    default:
      openingHours = null;
  }

  if (!openingHours) {
    return defaultMax;
  }

  let max;
  openingHours.forEach((item) => {
    if (item.closes) {
      const closes = moment(item.closes);

      if (!max || (closes.minutes() + closes.hours() * 60) > (max.minutes() + max.hours() * 60)) {
        max = closes;
      }
    }
  });

  if (max) {
    return max
      .add(buffer, 'hour')
      .format('HH:mm:ss');
  }

  return defaultMax;
};

/**
 * isDateReservable();
 * @param resource {object} A Resource object from the API.
 * @param date {string} A date string that can be parsed as moment object.
 * @returns {boolean}
 */
export const isDateReservable = (resource, date) => {
  if (!resource || !date) {
    return false;
  }

  const reservableAfter = get(resource, 'reservable_after', null);
  const reservableBefore = get(resource, 'reservable_before', null);

  const isAdmin = get(resource, 'user_permissions.is_admin', false);
  const isBefore = reservableBefore && moment(date).isSameOrBefore(moment(reservableBefore), 'day');
  const isAfter = reservableAfter && moment(date).isSameOrAfter(moment(reservableAfter), 'day');

  return isAdmin || (isBefore && isAfter);
};

/**
 * reservingIsRestricted();
 * @param resource {object}
 * @param date {string}
 * @returns {boolean}
 */
export const reservingIsRestricted = (resource, date) => {
  if (!date) {
    return false;
  }

  const isAdmin = get(resource, 'user_permissions.is_admin', false);
  const isLimited = resource.reservable_before && moment(resource.reservable_before).isBefore(moment(date), 'day');

  return isLimited && !isAdmin;
};

export const getOpenReservations = (resource) => {
  return filter(resource.reservations, (reservation) => {
    return reservation.state !== 'cancelled' && reservation.state !== 'denied';
  });
};

export const getAvailabilityDataForNow = (resource, date) => {
  const openingHours = getOpeningHours(resource, date);
  const reservations = getOpenReservations(resource);

  if (!openingHours || !openingHours.closes || !openingHours.opens) {
    return { status: 'closed', bsStyle: 'danger' };
  }

  const nowMoment = moment();
  const opensMoment = moment(openingHours.opens);
  const closesMoment = moment(openingHours.closes);
  const beginMoment = nowMoment > opensMoment ? nowMoment : opensMoment;

  if (nowMoment > closesMoment) {
    return { status: 'closed', bsStyle: 'danger' };
  }

  const currentReservation = reservationUtils.getCurrentReservation(reservations);
  if (currentReservation || nowMoment < opensMoment) {
    const nextAvailableTime = reservationUtils.getNextAvailableTime(reservations, beginMoment);
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
};

export const getAvailabilityDataForWholeDay = (resource, date) => {
  const openingHours = getOpeningHours(resource, date);

  if (!openingHours || !openingHours.closes || !openingHours.opens) {
    return { status: 'closed', bsStyle: 'danger' };
  }

  if (reservingIsRestricted(resource, date)) {
    return { status: 'reservingRestricted', bsStyle: 'danger' };
  }

  const reservations = getOpenReservations(resource);

  const opensMoment = moment(openingHours.opens);
  const closesMoment = moment(openingHours.closes);

  let total = closesMoment - opensMoment;
  forEach(reservations, (reservation) => {
    const resBeginMoment = moment(reservation.begin);
    if (!resBeginMoment.isSame(opensMoment, 'd')) {
      return;
    }

    const resEndMoment = moment(reservation.end);
    total -= resEndMoment;
    total += resBeginMoment;
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
};
