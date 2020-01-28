import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { isAccessCodeGenerated, isAccessCodePending } from '../../../../../app/shared/reservation-access-code/helpers';
import TooltipOverlay from '../../../../common/tooltip/TooltipOverlay';
import iconClock from '../../../../../app/assets/icons/clock-o.svg';
import PopoverOverlay from '../../../../common/popover/PopoverOverlay';

class ManageReservationsPincode extends Component {
  renderPincodeField() {
    const { reservation } = this.props;
    if (isAccessCodeGenerated(reservation)) {
      return (
        <TooltipOverlay
          content={(
            <p>{reservation.accessCode}</p>
          )}
        >
          <span>****</span>
        </TooltipOverlay>
      );
    }
    if (isAccessCodePending(reservation, reservation.resource)) {
      return (
        <PopoverOverlay
          content={<FormattedMessage id="ReservationAccessCode.pending" />}
        >
          <img alt="reservationAccessCodePending" src={iconClock} />
        </PopoverOverlay>
      );
    }

    return '';
  }

  render() {
    return (
      <div className="app-ManageReservationPincode">
        {this.renderPincodeField()}
      </div>
    );
  }
}

ManageReservationsPincode.propTypes = {
  reservation: PropTypes.object.isRequired,
};

export default ManageReservationsPincode;
