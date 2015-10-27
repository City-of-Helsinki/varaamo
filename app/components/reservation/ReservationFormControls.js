import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';

class ReservationFormControls extends Component {
  render() {
    const {
      disabled,
      isMakingReservations,
      onClick,
    } = this.props;

    return (
      <div>
        <Button
          block
          bsStyle="primary"
          disabled={disabled}
          onClick={onClick}
        >
          {isMakingReservations ? 'Varataan...' : 'Varaa'}
        </Button>
      </div>
    );
  }
}

ReservationFormControls.propTypes = {
  disabled: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ReservationFormControls;
