import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

import { injectT } from 'i18n';

class ReservationCalendarControls extends Component {
  constructor(props) {
    super(props);
    this.handleMainClick = this.handleMainClick.bind(this);
  }

  getButtonText(t, isEditing, isMakingReservations) {
    if (isEditing) {
      return isMakingReservations ?
        t('ReservationCalendarControls.saving') :
        t('ReservationCalendarControls.confirmChanges');
    }
    return isMakingReservations ?
      t('ReservationCalendarControls.reserving') :
      t('ReservationCalendarControls.reserve');
  }

  getReservationInfoNotification(t, resource, isLoggedIn) {
    if (resource.reservable) {
      if (isLoggedIn) {
        return {
          message: t('Notifications.selectTimeToReserve'),
          type: 'info',
          timeout: 10000,
        };
      }
      return {
        message: t('Notifications.loginToReserve'),
        type: 'info',
        timeout: 10000,
      };
    }
    return {
      message: resource.reservationInfo,
      type: 'info',
      timeout: 10000,
    };
  }

  handleMainClick() {
    const {
      addNotification,
      disabled,
      isLoggedIn,
      onClick,
      resource,
      t,
    } = this.props;

    if (disabled) {
      const notification = this.getReservationInfoNotification(t, resource, isLoggedIn);
      if (notification && notification.message) {
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
      t,
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
            {this.getButtonText(t, isEditing, isMakingReservations)}
          </Button>
          {isEditing && (
            <Button
              bsStyle="default"
              onClick={onCancel}
              style={{ width: '50%' }}
            >
              {t('ReservationCalendarControls.goBack')}
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
  t: PropTypes.func.isRequired,
};

export default injectT(ReservationCalendarControls);
