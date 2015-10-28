import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

class ReservationFormControls extends Component {
  getButtonText(isEditing, isMakingReservations) {
    if (isEditing) {
      return isMakingReservations ? 'Tallennetaan...' : 'Vahvista muutokset';
    }
    return isMakingReservations ? 'Varataan...' : 'Varaa';
  }

  render() {
    const {
      disabled,
      isEditing,
      isMakingReservations,
      onCancel,
      onClick,
    } = this.props;

    return (
      <div>
        <ButtonGroup style={{ width: '100%' }}>
          <Button
            bsStyle="primary"
            disabled={disabled}
            onClick={onClick}
            style={{ width: isEditing ? '50%' : '100%' }}
          >
            {this.getButtonText(isEditing, isMakingReservations)}
          </Button>
          {isEditing && (
            <Button
              bsStyle="default"
              onClick={onCancel}
              style={{ width: '50%' }}
            >
              Peruuta
            </Button>
          )}
        </ButtonGroup>
      </div>
    );
  }
}

ReservationFormControls.propTypes = {
  disabled: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ReservationFormControls;
