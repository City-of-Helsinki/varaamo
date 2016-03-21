import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';

class ReservationControls extends Component {
  constructor(props) {
    super(props);
    this.buttons = {
      accept: (
        <Button
          bsSize="xsmall"
          bsStyle="success"
          key="acceptButton"
        >
          Hyväksy
        </Button>
      ),
      adminCancel: (
        <Button
          bsSize="xsmall"
          bsStyle="danger"
          key="adminCalcelButton"
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
      decline: (
        <Button
          bsSize="xsmall"
          bsStyle="danger"
          key="declineButton"
        >
          Hylkää
        </Button>
      ),
      delete: (
        <Button
          bsSize="xsmall"
          bsStyle="danger"
          key="deleteButton"
          onClick={props.onDeleteClick}
        >
          Poista
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
    };
  }

  renderButtons(buttons, isAdmin, status) {
    switch (status) {

    case 'accepted':
      return isAdmin ? [buttons.adminCancel] : [buttons.cancel];

    case 'canceled':
      return isAdmin ? null : null;

    case 'declined':
      return isAdmin ? null : null;

    case 'pending':
      return isAdmin ? [buttons.accept, buttons.decline] : [buttons.edit, buttons.cancel];

    default:
      return isAdmin ? [buttons.edit, buttons.delete] : [buttons.edit, buttons.delete];

    }
  }

  render() {
    const { isAdmin, reservation } = this.props;

    if (!reservation || moment() > moment(reservation.end)) {
      return null;
    }

    return (
      <div className="buttons">
        {this.renderButtons(this.buttons, isAdmin, reservation.status)}
      </div>
    );
  }
}

ReservationControls.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  reservation: PropTypes.object,
};

export default ReservationControls ;
