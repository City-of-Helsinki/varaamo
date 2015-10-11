import _ from 'lodash';

import { PURPOSE_MAIN_TYPES, SUPPORTED_SEARCH_FILTERS } from 'constants/AppConstants';

export default {
  getAddress,
  getAddressWithName,
  getDescription,
  pickSupportedFilters,
  humanizeMainType,
  getName,
  getOpeningHours,
  getPeopleCapacityString,
};

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

function getDescription(item) {
  const hasDescription = item && item.description && item.description.fi;

  return hasDescription ? item.description.fi : '';
}

function humanizeMainType(mainType) {
  if (!mainType) {
    return '';
  }

  return mainType in PURPOSE_MAIN_TYPES ? PURPOSE_MAIN_TYPES[mainType] : mainType;
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

function pickSupportedFilters(filters) {
  return _.pick(filters, SUPPORTED_SEARCH_FILTERS);
}
