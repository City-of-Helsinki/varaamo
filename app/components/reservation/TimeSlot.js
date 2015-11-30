import classNames from 'classnames';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Glyphicon, Label } from 'react-bootstrap';

import ReservationControls from 'components/reservation/ReservationControls';
import { scrollTo } from 'utils/DOMUtils';

class TimeSlot extends Component {
  constructor(props) {
    super(props);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  componentDidMount() {
    if (this.props.scrollTo) {
      scrollTo(findDOMNode(this));
    }
  }

  handleDeleteClick() {
    const {
      openReservationDeleteModal,
      slot,
      selectReservationToDelete,
    } = this.props;

    selectReservationToDelete(slot.reservation);
    openReservationDeleteModal();
  }

  handleEditClick() {
    const {
      pushState,
      slot,
      resource,
      selectReservationToEdit,
    } = this.props;
    const reservation = slot.reservation;

    selectReservationToEdit({ reservation, minPeriod: resource.minPeriod });
    pushState(
      null,
      `/resources/${reservation.resource}/reservation`,
      {
        date: reservation.begin.split('T')[0],
        time: reservation.begin,
      }
    );
  }

  handleRowClick(disabled) {
    const { addNotification, onClick, slot } = this.props;

    if (disabled) {
      const mockMessage = `
        Lorem ipsum dolor sit amet, id odio ludus torquatos per, eripuit apeirian deseruisse eos no.
        Mel ex aeque oporteat, sit nobis homero sensibus ea. Te eam porro atomorum philosophia.
        Invenire referrentur ei vim. Sed mollis ponderum ullamcorper ea, sit aliquid deseruisse
        incorrupte id, et qui probo consequat constituto.
      `;
      const notification = {
        message: mockMessage,
        type: 'info',
        timeOut: 10000,
      };
      addNotification(notification);
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
      isLoggedIn,
      resource,
      selected,
      slot,
    } = this.props;
    const isPast = moment(slot.end) < moment();
    const disabled = (
      !isLoggedIn ||
      !resource.userPermissions.canMakeReservations ||
      !slot.editing && (slot.reserved || isPast)
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
    const isAdmin = resource.userPermissions.isAdmin;

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
        <td>
          <Label bsStyle={labelBsStyle}>
            {labelText}
          </Label>
        </td>
        {isAdmin && (
          <td>{reservation && slot.reservationStarting && this.renderUserInfo(reservation.user)}</td>
        )}
        {isAdmin && (
          <td>{reservation && slot.reservationStarting && reservation.comments}</td>)}
        {isAdmin && (
          <td>
            {slot.reservationStarting && (
              <ReservationControls
                onDeleteClick={this.handleDeleteClick}
                onEditClick={this.handleEditClick}
                reservation={reservation}
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
  isLoggedIn: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  openReservationDeleteModal: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  scrollTo: PropTypes.bool,
  selected: PropTypes.bool.isRequired,
  selectReservationToDelete: PropTypes.func.isRequired,
  selectReservationToEdit: PropTypes.func.isRequired,
  slot: PropTypes.object.isRequired,
};

export default TimeSlot;
