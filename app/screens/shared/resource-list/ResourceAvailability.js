import moment from 'moment';
import React, { PropTypes } from 'react';
import Label from 'react-bootstrap/lib/Label';

import { getAvailabilityDataForNow, getAvailabilityDataForWholeDay } from 'utils/resourceUtils';

function ResourceAvailability({ date, resource }) {
  let availabilityText;
  let bsStyle;

  const now = moment();
  if (moment(date).isBefore(now, 'day')) {
    return <span />;
  }

  if (moment(date).isSame(now, 'day')) {
    const availabilityData = getAvailabilityDataForNow(resource);
    availabilityText = availabilityData.text;
    bsStyle = availabilityData.bsStyle;
  }

  if (moment(date).isAfter(now, 'day')) {
    const availabilityData = getAvailabilityDataForWholeDay(resource);
    availabilityText = availabilityData.text;
    bsStyle = availabilityData.bsStyle;
  }

  return (
    <Label bsStyle={bsStyle} className="resource-availability">{availabilityText}</Label>
  );
}

ResourceAvailability.propTypes = {
  date: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired,
};

export default ResourceAvailability;
