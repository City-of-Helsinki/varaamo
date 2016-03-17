import last from 'lodash/array/last';
import rest from 'lodash/array/rest';
import filter from 'lodash/collection/filter';
import find from 'lodash/collection/find';
import forEach from 'lodash/collection/forEach';
import sortBy from 'lodash/collection/sortBy';
import clone from 'lodash/lang/clone';
import isEmpty from 'lodash/lang/isEmpty';
import moment from 'moment';

export default {
  combineReservations,
  getAddress,
  getAddressWithName,
  getAvailableTime,
  getCaption,
  getDescription,
  getMainImage,
  getName,
  getOpeningHours,
  getPeopleCapacityString,
  getReservationStatus,
  getTranslatedProperty,
};

function combineReservations(reservations) {
  if (!reservations || !reservations.length) {
    return [];
  }

  const sorted = sortBy(reservations, 'begin');
  const initialValue = [clone(sorted[0])];

  return rest(sorted).reduce((previous, current) => {
    if (current.begin === last(previous).end) {
      last(previous).end = current.end;
    } else {
      previous.push(clone(current));
    }
    return previous;
  }, initialValue);
}

function getAddress(item) {
  if (!item || isEmpty(item)) {
    return '';
  }

  const streetAddress = item.streetAddress ? item.streetAddress.fi : '';
  const zip = item.addressZip;
  const city = 'Helsinki';

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
    return '0 tuntia';
  }

  const nowMoment = moment();
  const opensMoment = moment(opens);
  const closesMoment = moment(closes);

  if (nowMoment > closesMoment) {
    return '0 tuntia';
  }

  const beginMoment = nowMoment > opensMoment ? nowMoment : opensMoment;
  let total = closesMoment - beginMoment;

  forEach(
    filter(reservations, reservation => moment(reservation.end) > nowMoment),
    (reservation) => {
      const resBeginMoment = moment(reservation.begin);
      const resEndMoment = moment(reservation.end);
      const maxBeginMoment = nowMoment > resBeginMoment ? nowMoment : resBeginMoment;
      total = total - resEndMoment + maxBeginMoment;
    }
  );

  const asHours = moment.duration(total).asHours();
  const rounded = Math.ceil(asHours * 2) / 2;

  return rounded === 1 ? `${rounded} tunti` : `${rounded} tuntia`;
}

function getCaption(item, language = 'fi') {
  return getTranslatedProperty(item, 'caption', language);
}

function getDescription(item, language = 'fi') {
  return getTranslatedProperty(item, 'description', language);
}

function getMainImage(images) {
  if (!images || !images.length) {
    return {};
  }

  return find(images, { type: 'main' }) || images[0];
}

function getName(item, language) {
  return getTranslatedProperty(item, 'name', language);
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

function getReservationStatus(reservation) {
  const statuses = ['pending', 'canceled', 'declined', 'accepted', null];
  return reservation ? statuses[reservation.id % 5] : null;
}

function getTranslatedProperty(item, property, language = 'fi') {
  if (item && item[property] && item[property][language]) {
    return item[property][language];
  }
  return '';
}
