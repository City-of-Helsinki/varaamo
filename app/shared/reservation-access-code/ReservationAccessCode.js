import React from 'react';
import PropTypes from 'prop-types';

import PendingAccessCode from './PendingAccessCode';
import GeneratedAccessCode from './GeneratedAccessCode';
import { isAccessCodeGenerated, isAccessCodePending, isReservationCancelled } from './helpers';

const ReservationAccessCode = ({ reservation, resource, text }) => {
  if (isReservationCancelled(reservation)) {
    return <span />;
  }
  if (isAccessCodeGenerated(reservation)) {
    return <GeneratedAccessCode accessCode={reservation.access_code} text={text} />;
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
