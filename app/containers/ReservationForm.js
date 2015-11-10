import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-date-picker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';

import {
  deleteReservation,
  postReservation,
  putReservation,
} from 'actions/reservationActions';
import { fetchResource } from 'actions/resourceActions';
import {
  cancelReservationEdit,
  clearReservations,
  closeConfirmReservationModal,
  openConfirmReservationModal,
  toggleTimeSlot,
} from 'actions/uiActions';
import DateHeader from 'components/common/DateHeader';
import ConfirmReservationModal from 'components/reservation/ConfirmReservationModal';
import ReservationFormControls from 'components/reservation/ReservationFormControls';
import TimeSlots from 'components/reservation/TimeSlots';
import reservationFormSelector from 'selectors/containers/reservationFormSelector';
import { getDateStartAndEndTimes } from 'utils/TimeUtils';

export class UnconnectedReservationForm extends Component {
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
    const fetchParams = getDateStartAndEndTimes(newDate);

    actions.pushState(null, `/resources/${id}/reservation`, { date: newDate });
    actions.fetchResource(id, fetchParams);
  }

  handleEdit() {
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
        { url: reservationsToEdit[0].url }
      ));

      // Add new reservations if needed.
      _.forEach(_.rest(selectedReservations), (reservation) => {
        actions.postReservation(reservation);
      });
    } else {
      // Delete the edited reservation if no time slots were selected.
      _.forEach(reservationsToEdit, (reservation) => {
        actions.deleteReservation(reservation);
      });
    }

    actions.pushState(null, '/my-reservations');
  }

  handleEditCancel() {
    this.props.actions.cancelReservationEdit();
    this.props.actions.pushState(null, '/my-reservations');
  }

  handleReservation() {
    const { actions, selectedReservations } = this.props;

    selectedReservations.forEach(reservation => {
      actions.postReservation(reservation);
    });
  }

  render() {
    const {
      actions,
      confirmReservationModalIsOpen,
      date,
      isFetchingResource,
      isMakingReservations,
      reservationsToEdit,
      selected,
      selectedReservations,
      timeSlots,
    } = this.props;
    const isEditing = Boolean(reservationsToEdit.length);

    return (
      <div>
        <DatePicker
          date={date}
          hideFooter
          gotoSelectedText="Mene valittuun"
          onChange={this.onDateChange}
          todayText="Tänään"
        />
        <DateHeader
          date={date}
          onChange={this.onDateChange}
        />
        <TimeSlots
          isFetching={isFetchingResource}
          onClick={actions.toggleTimeSlot}
          selected={selected}
          slots={timeSlots}
        />
        <ReservationFormControls
          disabled={!selected.length || isMakingReservations}
          isEditing={isEditing}
          isMakingReservations={isMakingReservations}
          onCancel={this.handleEditCancel}
          onClick={actions.openConfirmReservationModal}
        />
        <ConfirmReservationModal
          isEditing={isEditing}
          isMakingReservations={isMakingReservations}
          onClose={actions.closeConfirmReservationModal}
          onConfirm={isEditing ? this.handleEdit : this.handleReservation}
          reservationsToEdit={reservationsToEdit}
          selectedReservations={selectedReservations}
          show={confirmReservationModalIsOpen}
        />
      </div>
    );
  }
}

UnconnectedReservationForm.propTypes = {
  actions: PropTypes.object.isRequired,
  confirmReservationModalIsOpen: PropTypes.bool.isRequired,
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isFetchingResource: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  reservationsToEdit: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  selectedReservations: PropTypes.array.isRequired,
  timeSlots: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    cancelReservationEdit,
    clearReservations,
    closeConfirmReservationModal,
    deleteReservation,
    fetchResource,
    pushState,
    postReservation,
    putReservation,
    openConfirmReservationModal,
    toggleTimeSlot,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationFormSelector, mapDispatchToProps)(UnconnectedReservationForm);
