import React, { PropTypes } from 'react';
import Label from 'react-bootstrap/lib/Label';

import constants from 'constants/AppConstants';

function ReservationStateLabel({ reservation }) {
  if (!reservation.needManualConfirmation && reservation.state !== 'cancelled') {
    return <span />;
  }
  const { labelBsStyle, labelText } = constants.RESERVATION_STATE_LABELS[reservation.state];

  return (
    <div className="reservation-state-label-container">
      <Label bsStyle={labelBsStyle}>{labelText}</Label>
    </div>
  );
}

ReservationStateLabel.propTypes = {
  reservation: PropTypes.shape({
    needManualConfirmation: PropTypes.bool.isRequired,
    state: PropTypes.string.isRequired,
  }).isRequired,
};

export default ReservationStateLabel;
