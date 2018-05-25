import moment from 'moment';
import React, { PropTypes } from 'react';
import Label from 'react-bootstrap/lib/Label';

import { injectT } from 'i18n';
import { getAvailabilityDataForNow, getAvailabilityDataForWholeDay } from 'utils/resourceUtils';

function ResourceAvailability({ date, resource, t }) {
  let status;
  let bsStyle;
  let values;

  const now = moment();
  if (moment(date).isBefore(now, 'day')) {
    return <span />;
  }

  if (moment(date).isSame(now, 'day')) {
    const availabilityData = getAvailabilityDataForNow(resource, date);
    bsStyle = availabilityData.bsStyle;
    status = availabilityData.status;
    values = availabilityData.values;
  }

  if (moment(date).isAfter(now, 'day')) {
    const availabilityData = getAvailabilityDataForWholeDay(resource, date);
    bsStyle = availabilityData.bsStyle;
    status = availabilityData.status;
    values = availabilityData.values;
  }

  return (
    <Label bsStyle={bsStyle} className="resource-availability">
      {t(`ResourceAvailability.${status}`, values)}
    </Label>
  );
}

ResourceAvailability.propTypes = {
  date: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ResourceAvailability);
