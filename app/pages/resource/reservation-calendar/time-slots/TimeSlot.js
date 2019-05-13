import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';

import { injectT } from 'i18n';
import { scrollTo } from 'utils/domUtils';
import { padLeft } from 'utils/timeUtils';

class TimeSlot extends PureComponent {
  static propTypes = {
    addNotification: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
    isAdmin: PropTypes.bool.isRequired,
    showClear: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isSelectable: PropTypes.bool.isRequired,
    isUnderMinPeriod: PropTypes.bool.isRequired,
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

  static defaultProps = {
    isDisabled: false,
  }

  constructor(props) {
    super(props);
    this.timeSlotRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.scrollTo) {
      scrollTo(this.timeSlotRef.current);
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

  /**
   * Render notification warning message when user
   * trying to select a timeslot that are able to shorter than reservation minPeriod.
   *
   * For example: last reservation close at 3pm, minPeriod = 3h, warn user when
   * select time slot later on 12am
   *
   * @memberof TimeSlot
   */
  renderMinPeriodWarning = () => {
    const { t, addNotification } = this.props;

    addNotification({
      message: t('Notifications.selectTimeToReserve.warning'),
      type: 'info',
      timeOut: 10000,
    });
  }

  handleClick = (disabled) => {
    const {
      addNotification, isLoggedIn, onClick, resource, slot, t, isUnderMinPeriod
    } = this.props;

    if (disabled) {
      const notification = this.getReservationInfoNotification(isLoggedIn, resource, slot, t);
      if (notification && notification.message) {
        addNotification(notification);
      }
    } else if (isUnderMinPeriod) {
      this.renderMinPeriodWarning();
    } else {
      onClick({
        begin: slot.start,
        end: slot.end,
        resource,
      });
    }
  };

  render() {
    const {
      isDisabled,
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
    const disabled = isDisabled
      || !isLoggedIn
      || (!isSelectable && !selected)
      || !resource.userPermissions.canMakeReservations
      || isReservable
      || (!slot.editing && (slot.reserved || isPast));
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
          'app-TimeSlot--reservation-starting': slot.reservationStarting,
          'app-TimeSlot--reservation-ending': slot.reservationEnding,
          'app-TimeSlot--reserved': slot.reserved,
          'app-TimeSlot--selected': selected,
          'app-TimeSlot--highlight': isHighlighted,
        })}
        ref={this.timeSlotRef}
      >
        <button
          className="app-TimeSlot__action"
          onClick={() => this.handleClick(disabled)}
          onMouseEnter={() => !disabled && onMouseEnter(slot)}
          onMouseLeave={() => !disabled && onMouseLeave()}
          type="button"
        >
          <span className="app-TimeSlot__icon" />
          <time dateTime={slot.asISOString}>{startTime}</time>
        </button>
        {showClear && (
          <button className="app-TimeSlot__clear" onClick={onClear} type="button">
            <span className="app-TimeSlot__clear-icon" />
          </button>
        )}
      </div>
    );
  }
}

export default injectT(TimeSlot);
