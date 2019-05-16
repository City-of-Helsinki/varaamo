import React from 'react';
import PropTypes from 'prop-types';

import PendingAccessCode from './PendingAccessCode';
import GeneratedAccessCode from './GeneratedAccessCode';
import { isAccessCodeGenerated, isAccessCodePending } from './helpers';

const ReservationAccessCode = ({ reservation, resource, text }) => {
  if (isAccessCodeGenerated(reservation)) {
    return <GeneratedAccessCode accessCode={reservation.accessCode} text={text} />;
  }
  if (resource && isAccessCodePending(reservation, resource)) {
    return <PendingAccessCode />;
  }
  return <span />;
};

ReservationAccessCode.propTypes = {
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object,
  text: PropTypes.string,
};

export default ReservationAccessCode;
