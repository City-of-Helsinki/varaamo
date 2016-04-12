import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';

class ReservationControls extends Component {
  render() {
    const {
      onDeleteClick,
      onEditClick,
      onInfoClick,
      reservation,
    } = this.props;

    if (reservation.needManualConfirmation) {
      return (
        <Button
          bsSize="xsmall"
          bsStyle="default"
          className="info-button"
          onClick={onInfoClick}
        >
          Tiedot
        </Button>
      );
    }

    if (!reservation || moment() > moment(reservation.end)) {
      return null;
    }

    return (
      <div className="buttons">
        <Button
          bsSize="xsmall"
          bsStyle="primary"
          onClick={onEditClick}
        >
          Muokkaa
        </Button>
        <Button
          bsSize="xsmall"
          bsStyle="danger"
          onClick={onDeleteClick}
        >
          Peru
        </Button>
      </div>
    );
  }
}

ReservationControls.propTypes = {
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onInfoClick: PropTypes.func.isRequired,
  reservation: PropTypes.object,
};

export default ReservationControls ;
