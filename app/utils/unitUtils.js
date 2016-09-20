import capitalize from 'lodash/capitalize';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';

import { getProperty } from 'utils/translationUtils';

function getAddress(unit) {
  if (!unit || isEmpty(unit)) {
    return '';
  }

  const streetAddress = unit.streetAddress ? unit.streetAddress.fi : '';
  const zip = unit.addressZip;
  const city = capitalize(unit.municipality);

  return `${streetAddress}, ${zip} ${city}`;
}

function getAddressWithName(unit) {
  const parts = [
    getProperty(unit, 'name'),
    getAddress(unit),
  ];

  return filter(parts, part => part !== '').join(', ');
}

export {
  getAddress,
  getAddressWithName,
};
