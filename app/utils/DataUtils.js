export default {
  getAddress,
  getAddressWithName,
  getDescription,
  getName,
  getPeopleCapacityString,
};

function getAddress(item) {
  if (!item) {
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
