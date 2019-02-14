function getServiceMapUrl(unit) {
  if (!unit || !unit.id) {
    return '';
  }
  const unitIdSplit = unit ? unit.id.split(':') : [];
  const unitId = unitIdSplit.length === 2 ? unitIdSplit[1] : '';
  return `https://palvelukartta.hel.fi/unit/${unitId}#!route-details`;
}

export {
  getServiceMapUrl,
};
