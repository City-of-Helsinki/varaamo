import includes from 'lodash/collection/includes';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';

class ReservationControls extends Component {
  render() {
    const {
      onCancelClick,
      onDeleteClick,
      onEditClick,
      reservation,
    } = this.props;

    if (!reservation || moment() > moment(reservation.end)) {
      return null;
    }

    return (
      <div className="buttons">
        {!includes(['accepted', 'canceled', 'declined'], reservation.status) && (
          <Button
            bsSize="xsmall"
            bsStyle="primary"
            onClick={onEditClick}
            >
            Muokkaa
          </Button>
        )}
        {includes(['accepted', 'pending'], reservation.status) && (
          <Button
            bsSize="xsmall"
            bsStyle="default"
            onClick={onCancelClick}
          >
            Peru
          </Button>
        )}
        {!reservation.status && (
          <Button
            bsSize="xsmall"
            bsStyle="danger"
            onClick={onDeleteClick}
          >
            Poista
          </Button>
        )}
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
