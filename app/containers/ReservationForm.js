import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-date-picker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';

import { postReservation } from 'actions/reservationActions';
import { fetchResource } from 'actions/resourceActions';
import {
  cancelReservationEdit,
  changeReservationDate,
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

    actions.changeReservationDate(newDate);
    actions.fetchResource(id, fetchParams);
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
          onChange={actions.toggleTimeSlot}
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
          onConfirm={this.handleReservation}
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
    changeReservationDate,
    clearReservations,
    closeConfirmReservationModal,
    fetchResource,
    pushState,
    postReservation,
    openConfirmReservationModal,
    toggleTimeSlot,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationFormSelector, mapDispatchToProps)(UnconnectedReservationForm);
