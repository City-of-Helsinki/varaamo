import React, { PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { injectT } from 'i18n';
import { getHumanizedPeriod, getHourlyPrice } from 'utils/resourceUtils';

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
