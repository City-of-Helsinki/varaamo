import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { isAccessCodeGenerated, isAccessCodePending } from '../../../../../app/shared/reservation-access-code/helpers';
import TooltipOverlay from '../../../../common/tooltip/TooltipOverlay';
import IconClock from '../../../../../app/assets/icons/clock-o.svg';

class ManageReservationPincode extends Component {
  renderPincodeField = () => {
    const { reservation } = this.props;
    if (isAccessCodeGenerated(reservation)) {
      return (
        <TooltipOverlay
          content={<span>{reservation.accessCode}</span>}
        >
          <span>****</span>
        </TooltipOverlay>
      );
    }
    if (isAccessCodePending(reservation, reservation.resource)) {
      return (
        <TooltipOverlay
          content={<FormattedMessage id="ReservationAccessCode.pending" />}
        >
          <IconClock />
        </TooltipOverlay>
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

ManageReservationPincode.propTypes = {
  reservation: PropTypes.object.isRequired
};

export default ManageReservationPincode;
