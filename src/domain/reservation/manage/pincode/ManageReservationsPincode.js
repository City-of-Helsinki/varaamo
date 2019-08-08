import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Panel } from 'react-bootstrap';

import { isAccessCodeGenerated, isAccessCodePending } from '../../../../../app/shared/reservation-access-code/helpers';
import TooltipOverlay from '../../../../common/tooltip/TooltipOverlay';
import iconClock from '../../../../../app/assets/icons/clock-o.svg';

class ManageReservationsPincode extends Component {
  renderPincodeField() {
    const { reservation } = this.props;
    if (isAccessCodeGenerated(reservation)) {
      return (
        <TooltipOverlay
          content={(
            <Panel>
              <Panel.Body>
                <Panel.Title><FormattedMessage id="common.accessCodeLabel" /></Panel.Title>
                <p>{reservation.accessCode}</p>
              </Panel.Body>
            </Panel>
          )}
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
          <img alt="reservationAccessCodePending" src={iconClock} />
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

ManageReservationsPincode.propTypes = {
  reservation: PropTypes.object.isRequired
};

export default ManageReservationsPincode;
