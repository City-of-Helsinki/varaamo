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

  render() {
    const {
      isLoggedIn,
      onClick,
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
          editing: slot.editing,
          'past': isPast,
          reserved: slot.reserved,
          selected,
        })}
        onClick={() => !disabled && onClick(slot.asISOString)}
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
        {isAdmin && <td>{reservation && reservation.user}</td>}
        {isAdmin && (
          <td>
            <ReservationControls
              onDeleteClick={this.handleDeleteClick}
              onEditClick={this.handleEditClick}
              reservation={reservation}
            />
          </td>
        )}
      </tr>
    );
  }
}

TimeSlot.propTypes = {
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
