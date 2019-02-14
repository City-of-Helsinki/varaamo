import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';

import { injectT } from 'i18n';
import { scrollTo } from 'utils/domUtils';
import { padLeft } from 'utils/timeUtils';

class TimeSlot extends PureComponent {
  static propTypes = {
    addNotification: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    showClear: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isSelectable: PropTypes.bool.isRequired,
    onClear: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
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
    if (new Date(slot.end) < new Date() || slot.reserved) {
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
    const { addNotification, isLoggedIn, onClick, resource, slot, t } = this.props;

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
  };

  render() {
    const {
      isAdmin,
      showClear,
      isHighlighted,
      isLoggedIn,
      isSelectable,
      onClear,
      onMouseEnter,
      onMouseLeave,
      resource,
      selected,
      slot,
    } = this.props;
    const isPast = new Date(slot.end) < new Date();
    const isReservable = (resource.reservableAfter
      && moment(slot.start).isBefore(resource.reservableAfter));
    const disabled =
      !isLoggedIn ||
      (!isSelectable && !selected) ||
      !resource.userPermissions.canMakeReservations ||
      isReservable ||
      (!slot.editing && (slot.reserved || isPast));
    const reservation = slot.reservation;
    const isOwnReservation = reservation && reservation.isOwn;
    const start = new Date(slot.start);
    const startTime = `${padLeft(start.getHours())}:${padLeft(start.getMinutes())}`;

    return (
      <div
        className={classNames('app-TimeSlot', {
          'app-TimeSlot--disabled': disabled,
          'app-TimeSlot--is-admin': isAdmin,
          'app-TimeSlot--editing': slot.editing,
          'app-TimeSlot--past': isPast,
          'app-TimeSlot--own-reservation': isOwnReservation,
          'app-TimeSlot--reservation-starting':
            (isAdmin || isOwnReservation) && slot.reservationStarting,
          'app-TimeSlot--reservation-ending':
            (isAdmin || isOwnReservation) && slot.reservationEnding,
          'app-TimeSlot--reserved': slot.reserved,
          'app-TimeSlot--selected': selected,
          'app-TimeSlot--highlight': isHighlighted,
        })}
      >
        <button
          className="app-TimeSlot__action"
          onClick={() => this.handleClick(disabled)}
          onMouseEnter={() => !disabled && onMouseEnter(slot)}
          onMouseLeave={() => !disabled && onMouseLeave()}
        >
          <span className="app-TimeSlot__icon" />
          <time dateTime={slot.asISOString}>{startTime}</time>
        </button>
        {showClear && (
          <button className="app-TimeSlot__clear" onClick={onClear}>
            <span className="app-TimeSlot__clear-icon" />
          </button>
        )}
      </div>
    );
  }
}

export default injectT(TimeSlot);
