import React from 'react';
import Label from 'react-bootstrap/lib/Label';

import { RESERVATION_STATE_LABELS } from 'constants/AppConstants';


function renderReservationStateLabel(reservation) {
  if (!reservation.needManualConfirmation && reservation.state !== 'cancelled') {
    return null;
  }

  const { labelBsStyle, labelText } = RESERVATION_STATE_LABELS[reservation.state];

  return (
    <div className="state">
      <Label bsStyle={labelBsStyle}>{labelText}</Label>
    </div>
  );
}

export default {
  renderReservationStateLabel,
};
