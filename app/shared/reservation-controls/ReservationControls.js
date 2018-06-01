import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';

import { injectT } from 'i18n';

class ReservationControls extends Component {
  constructor(props) {
    super(props);
    this.buttons = {
      cancel: (
        <Button
          bsStyle="danger"
          key="cancelButton"
          onClick={props.onCancelClick}
        >
          {props.t('ReservationControls.cancel')}
        </Button>
      ),
      confirm: (
        <Button
          bsStyle="success"
          key="confirmButton"
          onClick={props.onConfirmClick}
        >
          {props.t('ReservationControls.confirm')}
        </Button>
      ),
      deny: (
        <Button
          bsStyle="danger"
          key="denyButton"
          onClick={this.props.onDenyClick}
        >
          {props.t('ReservationControls.deny')}
        </Button>
      ),
      edit: (
        <Button
          bsStyle="primary"
          key="editButton"
          onClick={props.onEditClick}
        >
          {props.t('ReservationControls.edit')}
        </Button>
      ),
      info: (
        <Button
          bsStyle="default"
          key="infoButton"
          onClick={props.onInfoClick}
        >
          {props.t('ReservationControls.info')}
        </Button>
      ),
    };
  }

  renderButtons(buttons, isAdmin, isStaff, reservation) {
    if (!reservation.needManualConfirmation) {
      if (reservation.state === 'cancelled') {
        return null;
      }
      return isAdmin ?
        [buttons.edit, buttons.cancel] :
        [buttons.edit, buttons.cancel];
    }

    switch (reservation.state) {

      case 'cancelled': {
        return isAdmin ?
          [buttons.info] :
          [buttons.info];
      }

      case 'confirmed': {
        if (isAdmin) {
          return isStaff ?
            [buttons.info, buttons.cancel, buttons.edit] :
            [buttons.info, buttons.cancel];
        }
        return [buttons.info, buttons.cancel];
      }

      case 'denied': {
        return isAdmin ?
          [buttons.info] :
          [buttons.info];
      }

      case 'requested': {
        if (isAdmin) {
          return isStaff ?
            [buttons.info, buttons.confirm, buttons.deny, buttons.edit] :
            [buttons.info, buttons.edit];
        }
        return [buttons.info, buttons.edit, buttons.cancel];
      }

      default: {
        return null;
      }

    }
  }

  render() {
    const { isAdmin, isStaff, reservation } = this.props;

    if (!reservation || moment() > moment(reservation.end)) {
      return null;
    }

    return (
      <div className="buttons">
        {this.renderButtons(this.buttons, isAdmin, isStaff, reservation)}
      </div>
    );
  }
}

ReservationControls.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
  onDenyClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onInfoClick: PropTypes.func.isRequired,
  reservation: PropTypes.object,
  t: PropTypes.func.isRequired,
};

export default injectT(ReservationControls) ;
