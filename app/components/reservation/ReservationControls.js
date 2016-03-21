import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';

class ReservationControls extends Component {
  constructor(props) {
    super(props);
    this.buttons = {
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

  renderButtons(buttons, status) {
    switch (status) {
    case 'accepted':
      return [buttons.cancel];
    case 'canceled':
      return null;
    case 'declined':
      return null;
    case 'pending':
      return [buttons.edit, buttons.cancel];
    default:
      return [buttons.edit, buttons.delete];
    }
  }

  render() {
    const { reservation } = this.props;

    if (!reservation || moment() > moment(reservation.end)) {
      return null;
    }

    return (
      <div className="buttons">
        {this.renderButtons(this.buttons, reservation.status)}
      </div>
    );
  }
}

ReservationControls.propTypes = {
  onCancelClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  reservation: PropTypes.object,
};

export default ReservationControls ;
