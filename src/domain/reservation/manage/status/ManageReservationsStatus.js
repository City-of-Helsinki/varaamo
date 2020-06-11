import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import Label from 'react-bootstrap/lib/Label';

import injectT from '../../../../../app/i18n/injectT';
import { RESERVATION_STATE } from '../../../../constants/ReservationState';

export const getLabelStyle = (status) => {
  switch (status) {
    case RESERVATION_STATE.CANCELLED:
      return 'default';
    case RESERVATION_STATE.CONFIRMED:
      return 'success';
    case RESERVATION_STATE.DENIED:
      return 'danger';
    case RESERVATION_STATE.REQUESTED:
      return 'warning';
    default:
      return '';
  }
};

export const getLabelText = (status, t) => {
  return t(`Reservation.stateLabel${capitalize(status)}`);
};

const ManageReservationsStatus = ({ reservation, t }) => {
  const status = get(reservation, 'state', '');

  if (!status) {
    return null;
  }

  return (
    <div className="app-ManageReservationsStatus">
      <Label bsStyle={getLabelStyle(status)}>{getLabelText(status, t)}</Label>
    </div>
  );
};

ManageReservationsStatus.propTypes = {
  reservation: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ManageReservationsStatus);
