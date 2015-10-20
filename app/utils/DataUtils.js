import _ from 'lodash';
import moment from 'moment';

import { PURPOSE_MAIN_TYPES } from 'constants/AppConstants';

export default {
  combineReservations,
  getAddress,
  getAddressWithName,
  getAvailableTime,
  getDescription,
  getName,
  getOpeningHours,
  getPeopleCapacityString,
  humanizeMainType,
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

  return parts.filter(part => part !== '').join(', ');
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
    reservations.filter(reservation => moment(reservation.end) > nowMoment),
    (reservation) => {
      total = total - moment(reservation.end) + moment(reservation.begin);
    }
  );

  const asHours = moment.duration(total).asHours();

  return asHours === 1 ? `${asHours} tunti` : `${asHours} tuntia`;
}

function getDescription(item) {
  const hasDescription = item && item.description && item.description.fi;

  return hasDescription ? item.description.fi : '';
}

function getName(item) {
  const hasName = item && item.name && item.name.fi;

  return hasName ? item.name.fi : '';
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

function humanizeMainType(mainType) {
  if (!mainType) {
    return '';
  }

  return mainType in PURPOSE_MAIN_TYPES ? PURPOSE_MAIN_TYPES[mainType] : mainType;
}
