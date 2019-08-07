import round from 'lodash/round';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import find from 'lodash/find';
import moment from 'moment';

import * as urlUtils from '../../common/url/utils';
import * as dataUtils from '../../common/data/utils';
import * as reservationUtils from '../reservation/utils';
import constants from '../../../app/constants/AppConstants';
import forEach from "lodash/forEach";


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

const reservingIsRestricted = (resource, date) => {
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
