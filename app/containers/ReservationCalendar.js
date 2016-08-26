import includes from 'lodash/includes';
import forEach from 'lodash/forEach';
import tail from 'lodash/tail';
import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-date-picker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePath } from 'redux-simple-router';

import { addNotification } from 'actions/notificationsActions';
import {
  deleteReservation,
  postReservation,
  putReservation,
} from 'actions/reservationActions';
import {
  cancelReservationEdit,
  clearReservations,
  closeConfirmReservationModal,
  openConfirmReservationModal,
  toggleTimeSlot,
} from 'actions/uiActions';
import DateHeader from 'components/common/DateHeader';
import ConfirmReservationModal from 'components/reservation/ConfirmReservationModal';
import ReservationCalendarControls from 'components/reservation/ReservationCalendarControls';
import TimeSlots from 'components/reservation/TimeSlots';
import ReservationCancelModal from 'containers/ReservationCancelModal';
import ReservationInfoModal from 'containers/ReservationInfoModal';
import ReservationSuccessModal from 'containers/ReservationSuccessModal';
import reservationCalendarSelector from 'selectors/containers/reservationCalendarSelector';

export class UnconnectedReservationCalendar extends Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleEditCancel = this.handleEditCancel.bind(this);
    this.handleReservation = this.handleReservation.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  componentWillUnmount() {
    this.props.actions.clearReservations();
  }

  onDateChange(newDate) {
    const { actions, id } = this.props;
    actions.updatePath(`/resources/${id}/reservation?date=${newDate}`);
  }

  handleEdit(values = {}) {
    const {
      actions,
      reservationsToEdit,
      selectedReservations,
    } = this.props;

    if (selectedReservations.length) {
      // Edit the first selected reservation.
      actions.putReservation(Object.assign(
        {},
        selectedReservations[0],
        values,
        { url: reservationsToEdit[0].url }
      ));

      // Add new reservations if needed.
      // FIXME: This is very hacky and not bulletproof but use cases where user splits
      // one reservation into multiple reservations should be pretty rare.
      // Try to use something sequential in the future.
      // Use timeout to allow the PUT request to go through first and possibly free previously
      // reserved time slots.
      setTimeout(() => {
        forEach(tail(selectedReservations), (reservation) => {
          actions.postReservation(
            Object.assign({}, reservation, values)
          );
        });
      }, 800);
    } else {
      // Delete the edited reservation if no time slots were selected.
      forEach(reservationsToEdit, (reservation) => {
        actions.deleteReservation(reservation);
      });
    }
  }

  handleEditCancel() {
    this.props.actions.cancelReservationEdit();
  }

  handleReservation(values = {}) {
    const { actions, selectedReservations } = this.props;

    selectedReservations.forEach(reservation => {
      actions.postReservation(
        Object.assign({}, reservation, values)
      );
    });
  }

  render() {
    const {
      actions,
      confirmReservationModalIsOpen,
      date,
      isFetchingResource,
      isLoggedIn,
      isMakingReservations,
      reservationsToEdit,
      resource,
      selected,
      selectedReservations,
      staffUnits,
      time,
      timeSlots,
      urlHash,
    } = this.props;

    const isAdmin = resource.userPermissions.isAdmin;
    const isEditing = Boolean(reservationsToEdit.length);
    const isStaff = includes(staffUnits, resource.unit);

    return (
      <div>
        <DatePicker
          date={date}
          hideFooter
          gotoSelectedText="Mene valittuun"
          onChange={this.onDateChange}
          style={{ height: 210 }}
          todayText="Tänään"
        />
        <DateHeader
          date={date}
          onChange={this.onDateChange}
          scrollTo={urlHash === '#date-header'}
        />
        <TimeSlots
          addNotification={actions.addNotification}
          isAdmin={isAdmin}
          isEditing={isEditing}
          isFetching={isFetchingResource}
          isLoggedIn={isLoggedIn}
          isStaff={isStaff}
          onClick={actions.toggleTimeSlot}
          resource={resource}
          selected={selected}
          slots={timeSlots}
          time={time}
        />
        <ReservationCalendarControls
          addNotification={actions.addNotification}
          disabled={(
            !isLoggedIn ||
            !resource.userPermissions.canMakeReservations ||
            !selected.length ||
            isMakingReservations
          )}
          isEditing={isEditing}
          isLoggedIn={isLoggedIn}
          isMakingReservations={isMakingReservations}
          onCancel={this.handleEditCancel}
          onClick={actions.openConfirmReservationModal}
          resource={resource}
        />
        <ConfirmReservationModal
          isAdmin={isAdmin}
          isEditing={isEditing}
          isMakingReservations={isMakingReservations}
          isPreliminaryReservation={resource.needManualConfirmation}
          isStaff={isStaff}
          onClose={actions.closeConfirmReservationModal}
          onConfirm={isEditing ? this.handleEdit : this.handleReservation}
          reservationsToEdit={reservationsToEdit}
          resource={resource}
          selectedReservations={selectedReservations}
          show={confirmReservationModalIsOpen}
        />
        <ReservationCancelModal />
        <ReservationInfoModal />
        <ReservationSuccessModal />
      </div>
    );
  }
}

UnconnectedReservationCalendar.propTypes = {
  actions: PropTypes.object.isRequired,
  confirmReservationModalIsOpen: PropTypes.bool.isRequired,
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isFetchingResource: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  reservationsToEdit: PropTypes.array.isRequired,
  resource: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  selectedReservations: PropTypes.array.isRequired,
  time: PropTypes.string,
  timeSlots: PropTypes.array.isRequired,
  staffUnits: PropTypes.array.isRequired,
  urlHash: PropTypes.string.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    addNotification,
    cancelReservationEdit,
    clearReservations,
    closeConfirmReservationModal,
    deleteReservation,
    openConfirmReservationModal,
    postReservation,
    updatePath,
    putReservation,
    toggleTimeSlot,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationCalendarSelector, mapDispatchToProps)(UnconnectedReservationCalendar);
