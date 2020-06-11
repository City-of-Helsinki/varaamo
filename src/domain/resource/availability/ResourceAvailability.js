import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import Label from '../../../../app/shared/label/Label';
import injectT from '../../../../app/i18n/injectT';
import * as resourceUtils from '../utils';

const ResourceAvailability = ({ date, resource, t }) => {
  const now = moment();
  if (
    moment(date).isBefore(now, 'day') ||
    !!resource.external_reservation_url
  ) {
    return <span />;
  }

  const availabilityData = moment(date).isSame(now, 'day')
    ? resourceUtils.getAvailabilityDataForNow(resource, date)
    : resourceUtils.getAvailabilityDataForWholeDay(resource, date);

  return (
    <Label bsStyle={availabilityData.bsStyle} className="resource-availability">
      {t(
        `ResourceAvailability.${availabilityData.status}`,
        availabilityData.values
      )}
    </Label>
  );
};

ResourceAvailability.propTypes = {
  date: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ResourceAvailability);
