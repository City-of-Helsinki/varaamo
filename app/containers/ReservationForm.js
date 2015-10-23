import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { postReservation } from 'actions/reservationActions';
import { fetchResource } from 'actions/resourceActions';
import {
  changeReservationDate,
  closeConfirmReservationModal,
  openConfirmReservationModal,
  toggleTimeSlot,
} from 'actions/uiActions';
import DateHeader from 'components/common/DateHeader';
import ConfirmReservationModal from 'components/reservation/ConfirmReservationModal';
import TimeSlots from 'components/reservation/TimeSlots';
import { reservationFormSelectors } from 'selectors/reservationFormSelectors';
import { getDateStartAndEndTimes } from 'utils/TimeUtils';

export class UnconnectedReservationForm extends Component {
  constructor(props) {
    super(props);
    this.handleReservation = this.handleReservation.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(newDate) {
    const { actions, id } = this.props;
    const fetchParams = getDateStartAndEndTimes(newDate);

    actions.changeReservationDate(newDate);
    actions.fetchResource(id, fetchParams);
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
      selected,
      selectedReservations,
      timeSlots,
    } = this.props;

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
        <Button
          block
          bsStyle="primary"
          disabled={!selected.length || isMakingReservations}
          onClick={actions.openConfirmReservationModal}
        >
          {isMakingReservations ? 'Varaamassa...' : 'Varaa'}
        </Button>
        <ConfirmReservationModal
          isMakingReservations={isMakingReservations}
          onClose={actions.closeConfirmReservationModal}
          onConfirm={this.handleReservation}
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
  selected: PropTypes.array.isRequired,
  selectedReservations: PropTypes.array.isRequired,
  timeSlots: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    changeReservationDate,
    closeConfirmReservationModal,
    fetchResource,
    postReservation,
    openConfirmReservationModal,
    toggleTimeSlot,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationFormSelectors, mapDispatchToProps)(UnconnectedReservationForm);
