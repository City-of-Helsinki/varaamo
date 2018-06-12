import classNames from 'classnames';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import { injectT } from 'i18n';
import { scrollTo } from 'utils/domUtils';

class TimeSlot extends Component {
  static propTypes = {
    addNotification: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isSelectable: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    resource: PropTypes.object.isRequired,
    scrollTo: PropTypes.bool,
    selected: PropTypes.bool.isRequired,
    slot: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (this.props.scrollTo) {
      scrollTo(findDOMNode(this));
    }
  }

  getReservationInfoNotification(isLoggedIn, resource, slot, t) {
    if (moment(slot.end) < moment() || slot.reserved) {
      return null;
    }

    if (!isLoggedIn && resource.reservable) {
      return {
        message: t('Notifications.loginToReserve'),
        type: 'info',
        timeOut: 10000,
      };
    }
    return {
      message: resource.reservationInfo,
      type: 'info',
      timeOut: 10000,
    };
  }

  handleClick = (disabled) => {
    const {
      addNotification,
      isLoggedIn,
      onClick,
      resource,
      slot,
      t,
    } = this.props;

    if (disabled) {
      const notification = this.getReservationInfoNotification(isLoggedIn, resource, slot, t);
      if (notification && notification.message) {
        addNotification(notification);
      }
    } else {
      onClick({
        begin: slot.start,
        end: slot.end,
        resource: resource.id,
      });
    }
  }

  render() {
    const {
      isAdmin,
      isLoggedIn,
      isSelectable,
      resource,
      selected,
      slot,
    } = this.props;
    const isPast = moment(slot.end) < moment();
    const disabled = (
      !isLoggedIn ||
      (!isSelectable && !selected) ||
      !resource.userPermissions.canMakeReservations ||
      (!slot.editing && (slot.reserved || isPast))
    );
    const reservation = slot.reservation;
    const isOwnReservation = reservation && reservation.isOwn;
    return (
      <button
        className={classNames('app-TimeSlot', {
          'app-TimeSlot--disabled': disabled,
          'app-TimeSlot--is-admin': isAdmin,
          'app-TimeSlot--editing': slot.editing,
          'app-TimeSlot--past': isPast,
          'app-TimeSlot--own-reservation': isOwnReservation,
          'app-TimeSlot--reservation-starting': (isAdmin || isOwnReservation) && slot.reservationStarting,
          'app-TimeSlot--reservation-ending': (isAdmin || isOwnReservation) && slot.reservationEnding,
          'app-TimeSlot--reserved': slot.reserved,
          'app-TimeSlot--selected': selected,
        })}
        onClick={() => this.handleClick(disabled)}
      >
        <span className="app-TimeSlot--icon" />
        <time dateTime={slot.asISOString}>
          {moment(slot.start).format('HH:mm')}
        </time>
      </button>
    );
  }
}

export default injectT(TimeSlot);
