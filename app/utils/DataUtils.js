import _ from 'lodash';

import { PURPOSE_MAIN_TYPES } from 'constants/AppConstants';

export default {
  getAddress,
  getAddressWithName,
  getDescription,
  humanizeMainType,
  getName,
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

function getPeopleCapacityString(capacity) {
  if (!capacity) {
    return '';
  }
  return `max ${capacity} hengelle.`;
}
