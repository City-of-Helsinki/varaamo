import React, { PropTypes } from 'react';
import Label from 'react-bootstrap/lib/Label';

import constants from 'constants/AppConstants';
import { injectT } from 'i18n';

function ReservationStateLabel({ reservation, t }) {
  if (!reservation.needManualConfirmation && reservation.state !== 'cancelled') {
    return <span />;
  }
  const { labelBsStyle, labelTextId } = constants.RESERVATION_STATE_LABELS[reservation.state];

  return (
    <div className="reservation-state-label-container">
      <Label bsStyle={labelBsStyle}>{t(labelTextId)}</Label>
    </div>
  );
}

ReservationStateLabel.propTypes = {
  reservation: PropTypes.shape({
    needManualConfirmation: PropTypes.bool.isRequired,
    state: PropTypes.string.isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ReservationStateLabel);
