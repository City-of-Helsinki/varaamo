import React, { PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { injectT } from 'i18n';
import { getHumanizedPeriod } from 'utils/resourceUtils';

function renderIcon(glyph, text) {
  if (!text) {
    return null;
  }

  return (
    <span>
      <Glyphicon glyph={glyph} />
      <span className="text">{text}</span>
    </span>
  );
}

function getHourlyPrice(t, { minPricePerHour, maxPricePerHour }) {
  if (!(minPricePerHour || maxPricePerHour)) {
    return null;
  }
  if ((minPricePerHour && maxPricePerHour) && (minPricePerHour !== maxPricePerHour)) {
    return `${Number(minPricePerHour)} - ${Number(maxPricePerHour)} €/h`;
  }
  const priceString = maxPricePerHour || minPricePerHour;
  const price = priceString !== 0 ? Number(priceString) : null;
  if (price === 0) {
    return t('ResourceIcons.free');
  }
  return price ? `${price} €/h` : null;
}

function ResourceIcons({ resource, t }) {
  return (
    <div className="resource-icons">
      {renderIcon('user', resource.peopleCapacity)}
      {renderIcon('time', getHumanizedPeriod(resource.maxPeriod))}
      {renderIcon('euro', getHourlyPrice(t, resource))}
    </div>
  );
}

ResourceIcons.propTypes = {
  resource: PropTypes.shape({
    peopleCapacity: PropTypes.number,
    maxPeriod: PropTypes.string,
    minPricePerHour: PropTypes.string,
    maxPricePerHour: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ResourceIcons);
