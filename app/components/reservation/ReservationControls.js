import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';

class ReservationControls extends Component {
  constructor(props) {
    super(props);
    this.buttons = {
      adminCancel: (
        <Button
          bsSize="xsmall"
          bsStyle="danger"
          key="adminCalcelButton"
          onClick={props.onCancelClick}
        >
          Peru
        </Button>
      ),
      cancel: (
        <Button
          bsSize="xsmall"
          bsStyle="default"
          key="calcelButton"
          onClick={props.onCancelClick}
        >
          Peru
        </Button>
      ),
      confirm: (
        <Button
          bsSize="xsmall"
          bsStyle="success"
          key="confirmButton"
          onClick={props.onConfirmClick}
        >
          Hyväksy
        </Button>
      ),
      delete: (
        <Button
          bsSize="xsmall"
          bsStyle="danger"
          key="deleteButton"
          onClick={props.onDeleteClick}
        >
          Peru
        </Button>
      ),
      deny: (
        <Button
          bsSize="xsmall"
          bsStyle="danger"
          key="denyButton"
          onClick={this.props.onDenyClick}
        >
          Hylkää
        </Button>
      ),
      edit: (
        <Button
          bsSize="xsmall"
          bsStyle="primary"
          key="editButton"
          onClick={props.onEditClick}
        >
          Muokkaa
        </Button>
      ),
      info: (
        <Button
          bsSize="xsmall"
          bsStyle="default"
          key="infoButton"
          onClick={props.onInfoClick}
        >
          Tiedot
        </Button>
      ),
    };
  }

  renderButtons(buttons, isAdmin, reservation) {
    if (!reservation.needManualConfirmation) {
      if (reservation.state === 'cancelled') {
        return null;
      }
      return isAdmin ?
        [buttons.edit, buttons.delete] :
        [buttons.edit, buttons.delete];
    }

    switch (reservation.state) {

    case 'cancelled':
      return isAdmin ?
        [buttons.info] :
        null;

    case 'confirmed':
      return isAdmin ?
        [buttons.info, buttons.adminCancel, buttons.edit] :
        [buttons.cancel];

    case 'denied':
      return isAdmin ?
        [buttons.info] :
        null;

    case 'requested':
      return isAdmin ?
        [buttons.info, buttons.confirm, buttons.deny, buttons.edit] :
        [buttons.edit, buttons.cancel];

    default:
      return null;

    }
  }

  render() {
    const { isAdmin, reservation } = this.props;

    if (!reservation || moment() > moment(reservation.end)) {
      return null;
    }

    return (
      <div className="buttons">
        {this.renderButtons(this.buttons, isAdmin, reservation)}
      </div>
    );
  }
}

ReservationControls.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onDenyClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onInfoClick: PropTypes.func.isRequired,
  reservation: PropTypes.object,
};

export default ReservationControls ;
