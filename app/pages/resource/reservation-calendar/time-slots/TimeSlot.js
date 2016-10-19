import classNames from 'classnames';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Label from 'react-bootstrap/lib/Label';

import ReservationAccessCode from 'shared/reservation-access-code';
import ReservationControls from 'shared/reservation-controls';
import { scrollTo } from 'utils/domUtils';

export function getLabelData({ isOwnReservation, isPast, slot }) {
  let data = {};

  if (slot.editing) {
    data = { bsStyle: 'info', text: 'Muokataan' };
  } else if (slot.reserved) {
    data = {
      bsStyle: isOwnReservation ? 'info' : 'danger',
      text: isOwnReservation ? 'Oma varaus' : 'Varattu',
    };
  } else {
    data = { bsStyle: 'success', text: 'Vapaa' };
  }

  return isPast ? { bsStyle: 'default', text: data.text } : data;
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

  getReservationInfoMessage(isLoggedIn, resource, slot) {
    if (moment(slot.end) < moment() || slot.reserved) {
      return null;
    }

    if (!isLoggedIn && resource.reservable) {
      return 'Kirjaudu sisään tehdäksesi varauksen tähän tilaan.';
    }
    return resource.reservationInfo;
  }

  handleRowClick(disabled) {
    const {
      addNotification,
      isLoggedIn,
      onClick,
      resource,
      slot,
    } = this.props;

    if (disabled) {
      const message = this.getReservationInfoMessage(isLoggedIn, resource, slot);
      if (message) {
        const notification = {
          message,
          type: 'info',
          timeOut: 10000,
        };
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
      text: labelText,
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
          <Label bsStyle={labelBsStyle}>
            {labelText}
          </Label>
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
};

export default TimeSlot;
