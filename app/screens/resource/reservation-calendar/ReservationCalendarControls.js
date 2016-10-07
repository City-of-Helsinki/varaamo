import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

class ReservationCalendarControls extends Component {
  constructor(props) {
    super(props);
    this.handleMainClick = this.handleMainClick.bind(this);
  }

  getButtonText(isEditing, isMakingReservations) {
    if (isEditing) {
      return isMakingReservations ? 'Tallennetaan...' : 'Vahvista muutokset';
    }
    return isMakingReservations ? 'Varataan...' : 'Varaa';
  }

  getReservationInfoMessage(resource, isLoggedIn) {
    if (resource.reservable) {
      if (isLoggedIn) {
        return 'Valitse aika, jolle haluat tehdä varauksen.';
      }
      return 'Kirjaudu sisään tehdäksesi varauksen tähän tilaan.';
    }
    return resource.reservationInfo;
  }

  handleMainClick() {
    const {
      addNotification,
      disabled,
      isLoggedIn,
      onClick,
      resource,
    } = this.props;

    if (disabled) {
      const message = this.getReservationInfoMessage(resource, isLoggedIn);
      if (message) {
        const notification = {
          message,
          type: 'info',
          timeOut: 10000,
        };
        addNotification(notification);
      }
    } else {
      onClick();
    }
  }

  render() {
    const {
      disabled,
      isEditing,
      isMakingReservations,
      onCancel,
    } = this.props;

    return (
      <div>
        <ButtonGroup style={{ width: '100%' }}>
          <Button
            bsStyle="primary"
            className={classNames({ disabled })}
            onClick={this.handleMainClick}
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
              Takaisin
            </Button>
          )}
        </ButtonGroup>
      </div>
    );
  }
}

ReservationCalendarControls.propTypes = {
  addNotification: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
};

export default ReservationCalendarControls;
