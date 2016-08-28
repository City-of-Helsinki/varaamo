import classNames from 'classnames';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Label from 'react-bootstrap/lib/Label';

import ReservationControls from 'containers/ReservationControls';
import { scrollTo } from 'utils/DOMUtils';

class TimeSlot extends Component {
  constructor(props) {
    super(props);
    this.handleRowClick = this.handleRowClick.bind(this);
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
      isStaff,
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
    let labelBsStyle;
    let labelText;
    if (isPast) {
      labelBsStyle = 'default';
    } else {
      labelBsStyle = slot.reserved ? 'danger' : 'success';
    }
    if (slot.editing) {
      labelBsStyle = 'info';
      labelText = 'Muokataan';
    } else {
      labelText = slot.reserved ? 'Varattu' : 'Vapaa';
    }
    const reservation = slot.reservation;

    return (
      <tr
        className={classNames({
          disabled,
          'is-admin': isAdmin,
          editing: slot.editing,
          past: isPast,
          'reservation-starting': isAdmin && slot.reservationStarting,
          'reservation-ending': isAdmin && slot.reservationEnding,
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
        {isAdmin && (
          <td className="user-cell">{reservation && slot.reservationStarting && this.renderUserInfo(reservation.user)}</td>
        )}
        {isAdmin && (
          <td className="comments-cell">{reservation && slot.reservationStarting && reservation.comments}</td>)}
        {isAdmin && (
          <td className="controls-cell">
            {reservation && slot.reservationStarting && !isEditing && (
              <ReservationControls
                isAdmin={isAdmin}
                isStaff={isStaff}
                reservation={reservation}
                resource={resource}
              />
            )}
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
