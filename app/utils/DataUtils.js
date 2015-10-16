import _ from 'lodash';

import { PURPOSE_MAIN_TYPES, SUPPORTED_SEARCH_FILTERS } from 'constants/AppConstants';

export default {
  combineReservations,
  getAddress,
  getAddressWithName,
  getDateStartAndEndTimes,
  getDescription,
  getName,
  getOpeningHours,
  getPeopleCapacityString,
  humanizeMainType,
  pickSupportedFilters,
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

function getDateStartAndEndTimes(date) {
  if (!date) {
    return {};
  }

  const start = `${date}T00:00:00Z`;
  const end = `${date}T23:59:59Z`;

  return { start, end };
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

function pickSupportedFilters(filters) {
  return _.pick(filters, SUPPORTED_SEARCH_FILTERS);
}
