import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import Label from '../../label';
import injectT from '../../../i18n/injectT';
import { getAvailabilityDataForNow, getAvailabilityDataForWholeDay } from '../../../utils/resourceUtils';

function ResourceAvailability({ date, resource, t }) {
  const { externalReservationUrl } = resource;
  const now = moment();
  if (moment(date).isBefore(now, 'day') || !!externalReservationUrl) {
    return <span />;
  }

  const availabilityData = moment(date).isSame(now, 'day')
    ? getAvailabilityDataForNow(resource, date)
    : getAvailabilityDataForWholeDay(resource, date);

  const bsStyle = availabilityData.bsStyle;
  const status = availabilityData.status;
  const values = availabilityData.values;

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
