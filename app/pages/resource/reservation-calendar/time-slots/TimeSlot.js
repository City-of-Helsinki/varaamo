import classNames from 'classnames';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Label from 'react-bootstrap/lib/Label';
import { findDOMNode } from 'react-dom';

import ReservationAccessCode from 'shared/reservation-access-code';
import ReservationControls from 'shared/reservation-controls';
import { injectT } from 'i18n';
import { scrollTo } from 'utils/domUtils';

export function getLabelData({ isOwnReservation, isPast, slot }) {
  let data = {};

  if (slot.editing) {
    data = {
      bsStyle: 'info',
      messageId: 'TimeSlot.editing',
    };
  } else if (slot.reserved) {
    data = {
      bsStyle: isOwnReservation ? 'info' : 'danger',
      messageId: isOwnReservation ? 'TimeSlot.ownReservation' : 'TimeSlot.reserved',
    };
  } else {
    data = {
      bsStyle: 'success',
      messageId: 'TimeSlot.available',
    };
  }

  return isPast ? { bsStyle: 'default', messageId: data.messageId } : data;
}

class TimeSlot extends Component {
  constructor(props) {
    super(props);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.renderReservationControls = this.renderReservationControls.bind(this);
  }

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

  handleRowClick(disabled) {
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
      onClick(slot.asISOString);
    }
  }

  renderReservationControls() {
    const {
      isAdmin,
      isStaff,
      resource,
      slot,
    } = this.props;

    return (
      <ReservationControls
        isAdmin={isAdmin}
        isStaff={isStaff}
        reservation={slot.reservation}
        resource={resource}
      />
    );
  }

  renderUserInfo(user) {
    if (!user) {
      return null;
    }

    return (
      <span>{user.displayName} - {user.email}</span>
    );
  }

  render() {
    const {
      isAdmin,
      isEditing,
      isLoggedIn,
      resource,
      selected,
      slot,
      t,
    } = this.props;
    const isPast = moment(slot.end) < moment();
    const disabled = (
      !isLoggedIn ||
      !resource.userPermissions.canMakeReservations ||
      (!slot.editing && (slot.reserved || isPast))
    );
    const checked = selected || (slot.reserved && !slot.editing);
    const reservation = slot.reservation;
    const isOwnReservation = reservation && reservation.isOwn;
    const reservationIsStarting = reservation && slot.reservationStarting;
    const showReservationControls = reservationIsStarting && !isEditing;
    const {
      bsStyle: labelBsStyle,
      messageId: labelMessageId,
    } = getLabelData({ isOwnReservation, isPast, slot });

    return (
      <tr // eslint-disable-line jsx-a11y/no-static-element-interactions
        className={classNames({
          disabled,
          'is-admin': isAdmin,
          editing: slot.editing,
          past: isPast,
          'own-reservation': isOwnReservation,
          'reservation-starting': (isAdmin || isOwnReservation) && slot.reservationStarting,
          'reservation-ending': (isAdmin || isOwnReservation) && slot.reservationEnding,
          reserved: slot.reserved,
          selected,
        })}
        onClick={() => this.handleRowClick(disabled)}
      >
        <td className="checkbox-cell">
          <Glyphicon glyph={checked ? 'check' : 'unchecked'} />
        </td>
        <td className="time-cell">
          <time dateTime={slot.asISOString}>
            {slot.asString}
          </time>
        </td>
        <td className="status-cell">
          <Label bsStyle={labelBsStyle}>{t(labelMessageId)}</Label>
        </td>
        {!isAdmin && (
          <td className="controls-cell">
            {showReservationControls && isOwnReservation && this.renderReservationControls()}
          </td>
        )}
        {isAdmin && (
          <td className="user-cell">
            {reservationIsStarting && this.renderUserInfo(reservation.user)}
            {reservationIsStarting && <ReservationAccessCode reservation={reservation} />}
          </td>
        )}
        {isAdmin && (
          <td className="comments-cell">
            {reservationIsStarting && reservation.comments}
          </td>
        )}
        {isAdmin && (
          <td className="controls-cell">
            {showReservationControls && this.renderReservationControls()}
          </td>
        )}
      </tr>
    );
  }
}

TimeSlot.propTypes = {
  addNotification: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  scrollTo: PropTypes.bool,
  selected: PropTypes.bool.isRequired,
  slot: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(TimeSlot);
