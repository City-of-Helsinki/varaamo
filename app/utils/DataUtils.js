import _ from 'lodash';
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
  getTranslatedProperty,
};

function combineReservations(reservations) {
  if (!reservations || !reservations.length) {
    return [];
  }

  const sorted = _.sortBy(reservations, 'begin');
  const initialValue = [_.clone(sorted[0])];

  return _.rest(sorted).reduce((previous, current) => {
    if (current.begin === _.last(previous).end) {
      _.last(previous).end = current.end;
    } else {
      previous.push(_.clone(current));
    }
    return previous;
  }, initialValue);
}

function getAddress(item) {
  if (!item || _.isEmpty(item)) {
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

  return _.filter(parts, part => part !== '').join(', ');
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

  _.forEach(
    _.filter(reservations, reservation => moment(reservation.end) > nowMoment),
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

  return _.find(images, { type: 'main' }) || images[0];
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

function getTranslatedProperty(item, property, language = 'fi') {
  if (item && item[property] && item[property][language]) {
    return item[property][language];
  }
  return '';
}
