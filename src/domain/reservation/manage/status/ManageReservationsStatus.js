import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import Label from 'react-bootstrap/lib/Label';

import injectT from '../../../../../app/i18n/injectT';

export const getLabelStyle = (status) => {
  switch (status) {
    case 'cancelled':
      return 'default';
    case 'confirmed':
      return 'success';
    case 'denied':
      return 'danger';
    case 'requested':
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
      <Label bsStyle={getLabelStyle(status)}>
        {getLabelText(status, t)}
      </Label>
    </div>
  );
};

ManageReservationsStatus.propTypes = {
  reservation: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ManageReservationsStatus);
