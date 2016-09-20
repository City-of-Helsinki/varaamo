import camelCase from 'lodash/camelCase';
import capitalize from 'lodash/capitalize';
import clone from 'lodash/clone';
import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import tail from 'lodash/tail';
import moment from 'moment';

import constants from 'constants/AppConstants';
import { getProperty } from 'utils/translationUtils';

function combineReservations(reservations) {
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
}

function isStaffEvent(reservation, resource) {
  if (!resource || !resource.requiredReservationExtraFields) {
    return false;
  }
  return some(resource.requiredReservationExtraFields, (field) => (
    !reservation[camelCase(field)]
  ));
}

function getAddress(item) {
  if (!item || isEmpty(item)) {
    return '';
  }

  const streetAddress = item.streetAddress ? item.streetAddress.fi : '';
  const zip = item.addressZip;
  const city = capitalize(item.municipality);

  return `${streetAddress}, ${zip} ${city}`;
}

function getAddressWithName(item) {
  const parts = [
    getName(item),
    getAddress(item),
  ];

  return filter(parts, part => part !== '').join(', ');
}

function getAvailableTime(openingHours = {}, reservations = []) {
  const { closes, opens } = openingHours;

  if (!closes || !opens) {
    return '0 tuntia vapaana';
  }

  const nowMoment = moment();
  const opensMoment = moment(opens);
  const closesMoment = moment(closes);

  if (nowMoment > closesMoment) {
    return '0 tuntia vapaana';
  }

  const beginMoment = nowMoment > opensMoment ? nowMoment : opensMoment;
  let total = closesMoment - beginMoment;

  forEach(
    filter(reservations, reservation => (
      reservation.state !== 'cancelled' && moment(reservation.end) > nowMoment
    )),
    (reservation) => {
      const resBeginMoment = moment(reservation.begin);
      const resEndMoment = moment(reservation.end);
      const maxBeginMoment = nowMoment > resBeginMoment ? nowMoment : resBeginMoment;
      total = (total - resEndMoment) + maxBeginMoment;
    }
  );

  const asHours = moment.duration(total).asHours();
  const rounded = Math.ceil(asHours * 2) / 2;

  return rounded === 1 ? `${rounded} tunti vapaana` : `${rounded} tuntia vapaana`;
}

function getCaption(item, language = 'fi') {
  return getProperty(item, 'caption', language);
}

function getCurrentReservation(reservations) {
  const now = moment();
  return find(
    reservations, reservation => moment(reservation.begin) < now && now < moment(reservation.end)
  );
}

function getDescription(item, language = 'fi') {
  return getProperty(item, 'description', language);
}

function getHumanizedPeriod(period) {
  if (!period) {
    return '';
  }
  return `${moment.duration(period).hours()}h`;
}

function getMainImage(images) {
  if (!images || !images.length) {
    return {};
  }

  return find(images, { type: 'main' }) || images[0];
}

function getMissingReservationValues(reservation) {
  const missingValues = {};
  constants.REQUIRED_STAFF_EVENT_FIELDS.forEach((field) => {
    if (!reservation[field]) {
      missingValues[field] = '-';
    }
  });
  return missingValues;
}

function getName(item, language) {
  return getProperty(item, 'name', language);
}

function getNextReservation(reservations) {
  const now = moment();
  const orderedReservations = sortBy(reservations, reservation => moment(reservation.begin));
  return find(orderedReservations, reservation => now < moment(reservation.begin));
}

function getOpeningHours(item) {
  if (item && item.openingHours && item.openingHours.length) {
    return {
      closes: item.openingHours[0].closes,
      opens: item.openingHours[0].opens,
    };
  }

  return {};
}

function getPeopleCapacityString(capacity) {
  if (!capacity) {
    return '';
  }
  return `max ${capacity} hengelle.`;
}

export {
  combineReservations,
  isStaffEvent,
  getAddress,
  getAddressWithName,
  getAvailableTime,
  getCaption,
  getCurrentReservation,
  getDescription,
  getHumanizedPeriod,
  getMainImage,
  getMissingReservationValues,
  getName,
  getNextReservation,
  getOpeningHours,
  getPeopleCapacityString,
};
