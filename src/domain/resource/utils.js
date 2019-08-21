import round from 'lodash/round';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import moment from 'moment';

import * as urlUtils from '../../common/url/utils';
import * as dataUtils from '../../common/data/utils';
import * as reservationUtils from '../reservation/utils';
import constants from '../../../app/constants/AppConstants';


/**
 * getResourcePageLink();
 * Returns a resource page url with the given query params.
 * @param resource {object} Resource object.
 * @param query {object}
 * @returns {string}
 */
export const getResourcePageLink = (resource, query) => {
  return urlUtils.getLinkString(`/resources/${resource.id}`, query);
};

/**
 * getUnitAddress();
 * @param unit {object} Unit object.
 * @param locale {string} Language code (e.g. fi, en, sv).
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
 * @param resource {object} Resource object.
 * @param t {function}
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

/**
 * isFree();
 * @param resource {object} Resource object.
 * @returns {boolean}
 */
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

/**
 * getOpeningHours();
 * @param resource {object} Resource object.
 * @param date Date string that can be parsed as moment object.
 * @returns {null|{opens: *, closes: *}}
 */
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
 * @param date Date string that can be parsed as moment object.
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
 * @param date Date string that can be parsed as moment object.
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
 * getFullCalendarBusinessHoursForDate();
 * @param resource Resource object.
 * @param date Date string that can be parsed as moment object.
 */
export const getFullCalendarBusinessHoursForDate = (resource, date) => {
  const businessHoursForWeek = getFullCalendarBusinessHours(resource, date);
  let dayNumber = Number(moment(date).format('E'));
  dayNumber = dayNumber < 7 ? dayNumber : 0;

  return find(businessHoursForWeek, item => item.daysOfWeek[0] === dayNumber);
};

/**
 * getFullCalendarMinTime();
 * @param resource {object}
 * @param date {string} Date string that can be parsed as moment object.
 * @param viewType {string} Type of a FullCalendar View Object (https://fullcalendar.io/docs/view-object).
 * @param buffer {number} buffer in hours.
 * @returns {string}
 */
export const getFullCalendarMinTime = (resource, date, viewType, buffer = 1) => {
  const defaultMin = '07:00:00';
  let openingHours = null;
  switch (viewType) {
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
    // Subtract the buffer from the min value.
    min.subtract(buffer, 'hour');

    // Make sure that the min value is an even hour.
    if (min.minutes() > 0) {
      min.minutes(0);
      min.subtract(1, 'hour');
    }

    return min
      .format('HH:mm:ss');
  }

  return defaultMin;
};

/**
 * getFullCalendarMaxTime();
 * @param resource {object}
 * @param date {string} Date string that can be parsed as moment object.
 * @param viewType {string} Type of a FullCalendar View Object (https://fullcalendar.io/docs/view-object).
 * @param buffer {number} buffer in hours.
 * @returns {string}
 */
export const getFullCalendarMaxTime = (resource, date, viewType, buffer = 1) => {
  const defaultMax = '17:00:00';
  let openingHours = null;
  switch (viewType) {
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
    // Add the buffer into the max value.
    max.add(buffer, 'hour');

    // Make sure that the max value is an even hour.
    if (max.minutes() > 0) {
      max.minutes(0);
      max.add(1, 'hour');
    }

    return max
      .format('HH:mm:ss');
  }

  return defaultMax;
};

/**
 * getFullCalendarSlotLabelInterval();
 * @param resource {object} Resource object.
 * @returns {string}
 */
export const getFullCalendarSlotLabelInterval = (resource) => {
  const slotSize = get(resource, 'slot_size', null);

  if (slotSize === '00:15:00') {
    return '00:30:00';
  }

  return '01:00:00';
};

/**
 * getFullCalendarSlotDuration();
 * @param resource {object} Resource object.
 * @param date {string} Date string that can be parsed as moment object.
 * @param viewType {string} Type of a FullCalendar View Object (https://fullcalendar.io/docs/view-object).
 * @returns {string}
 */
export const getFullCalendarSlotDuration = (resource, date, viewType) => {
  const slotSize = get(resource, 'slot_size', null);
  const slotSizeDuration = moment.duration(slotSize);
  let durationMinutes = slotSizeDuration.hours() * 60 + slotSizeDuration.minutes();

  const businessHours = viewType === 'timeGridWeek'
    ? getFullCalendarBusinessHours(resource, date)
    : [getFullCalendarBusinessHoursForDate(resource, date)];

  // Make sure that slot duration is not bigger than business hour minutes.
  // (e.g. it's not possible to reserve the last 30 minutes
  // if slot size is 01:00:00 and business hours is 07:00 - 20:30).
  let minutes = 60;
  businessHours.forEach((item) => {
    const startTimeMinutes = moment.duration(item.startTime).minutes();
    const endTimeMinutes = moment.duration(item.endTime).minutes();

    if (startTimeMinutes > 0) {
      minutes = Math.min(minutes, startTimeMinutes);
    }

    if (endTimeMinutes > 0) {
      minutes = Math.min(minutes, endTimeMinutes);
    }
  });

  if (minutes < 60) {
    durationMinutes = minutes;
  }

  let duration = '01:00:00';
  if (durationMinutes < 30) {
    duration = '00:15:00';
  } else if (durationMinutes < 60) {
    duration = '00:30:00';
  }

  return duration;
};

/**
 * isDateReservable();
 * @param resource {object} Resource object from the API.
 * @param date {string} Date string that can be parsed as moment object.
 * @returns {boolean}
 */
export const isDateReservable = (resource, date) => {
  if (!resource || !date) {
    return false;
  }

  const reservableAfter = get(resource, 'reservable_after', null);
  const reservableBefore = get(resource, 'reservable_before', null);

  const isAdmin = get(resource, 'user_permissions.is_admin', false);
  const isBefore = reservableBefore ? moment(date).isSameOrBefore(moment(reservableBefore), 'day') : true;
  const isAfter = reservableAfter ? moment(date).isSameOrAfter(moment(reservableAfter), 'day') : true;

  return isAdmin || (isBefore && isAfter);
};

/**
 * isTimeRangeReservable();
 * @param resource {object} Resource object.
 * @param start {Date|string} Either a Date object or date string that can be parsed as moment object.
 * @param end {Date|string} Either a Date object or date string that can be parsed as moment object.
 * @returns {boolean}
 */
export const isTimeRangeReservable = (resource, start, end) => {
  const now = moment();
  const startMoment = moment(start);
  const endMoment = moment(end);

  // Reservation cannot be shorter than the resources min period if min period is set.
  const minPeriod = get(resource, 'min_period', null);
  if (minPeriod) {
    const minPeriodDuration = moment.duration(minPeriod);
    const minDuration = minPeriodDuration.hours() * 60 + minPeriodDuration.minutes();

    if (endMoment.diff(startMoment, 'minutes') < minDuration) {
      return false;
    }
  }

  // Reservation cannot be longer than the resources max period if max period is set.
  const maxPeriod = get(resource, 'max_period', null);
  if (maxPeriod) {
    const maxPeriodDuration = moment.duration(maxPeriod);
    const maxDuration = maxPeriodDuration.hours() * 60 + maxPeriodDuration.minutes();

    if (endMoment.diff(startMoment, 'minutes') > maxDuration) {
      return false;
    }
  }

  if (!isDateReservable(resource, startMoment.format(constants.DATE_FORMAT))
    || !isDateReservable(resource, endMoment.format(constants.DATE_FORMAT))) {
    return false;
  }

  // Check if the given event times are inside opening hours.
  const dateString = startMoment.format(constants.DATE_FORMAT);
  const openingHours = getOpeningHours(resource, dateString);
  const opens = moment(openingHours.opens);
  const closes = moment(openingHours.closes);

  if (startMoment.isBefore(opens) || endMoment.isAfter(closes)) {
    return false;
  }

  // Prevent selecting times from past.
  return startMoment.isAfter(now);
};


export const isFullCalendarEventDurationEditable = (resource, start, end) => {
  const slotSize = get(resource, 'slot_size', null);
  const minPeriod = get(resource, 'min_period', null);
  const maxPeriod = get(resource, 'max_period', null);

  if (!minPeriod || !maxPeriod) {
    return true;
  }

  return !(slotSize === minPeriod && minPeriod === maxPeriod);
};

/**
 * reservingIsRestricted();
 * @param resource {object}
 * @param date {string} Date string that can be parsed as moment object.
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

/**
 * getOpenReservations();
 * @param resource {object} Resource object.
 * @returns {Array}
 */
export const getOpenReservations = (resource) => {
  return filter(resource.reservations, (reservation) => {
    return reservation.state !== 'cancelled' && reservation.state !== 'denied';
  });
};

/**
 * getAvailabilityDataForNow();
 * @param resource {object} Resource object.
 * @param date {string} Date string that can be parsed as moment object.
 * @returns {object}
 */
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

/**
 * getAvailabilityDataForWholeDay();
 * @param resource {object} Resource object.
 * @param date {string} Date string that can be parsed as moment object.
 * @returns {object}
 */
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

/**
 * getSlotSizeInMinutes();
 * @param resource {object} Resource object.
 * @returns {number} Slot size in minutes.
 */
export const getSlotSizeInMinutes = (resource) => {
  const slotSize = get(resource, 'slot_size', null);

  if (slotSize) {
    const slotSizeDuration = moment.duration(slotSize);
    return slotSizeDuration.hours() * 60 + slotSizeDuration.minutes();
  }

  return 30;
};

/**
 * getReservationPrice();
 * @param start {Date|string} Either a Date object or date string that can be parsed as moment object.
 * @param end {Date|string} Either a Date object or date string that can be parsed as moment object.
 * @param resource {object} Resource object.
 * @returns {number}
 */
export const getReservationPrice = (start, end, resource) => {
  const products = get(resource, 'products', []);

  if (!products.length) {
    return 0;
  }

  const startMoment = moment(start);
  const endMoment = moment(end);

  const currentProduct = products[0];
  const timeDiff = endMoment.diff(startMoment, 'hours', true);

  // TODO: Replace those getter with generic data when price
  // not only by hours and product is more than 1.

  if (currentProduct.priceType === 'per_hour' && currentProduct.price) {
    return timeDiff * currentProduct.price;
  }

  return 0;
};
