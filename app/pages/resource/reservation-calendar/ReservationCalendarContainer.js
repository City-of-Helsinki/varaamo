import includes from 'lodash/includes';
import React, { Component, PropTypes } from 'react';
import { Calendar } from 'react-date-picker';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';

import { addNotification } from 'actions/notificationsActions';
import {
  cancelReservationEdit,
  clearReservations,
  openConfirmReservationModal,
  toggleTimeSlot,
} from 'actions/uiActions';
import DateHeader from 'shared/date-header';
import ReservationCancelModal from 'shared/modals/reservation-cancel';
import ReservationInfoModal from 'shared/modals/reservation-info';
import ReservationSuccessModal from 'shared/modals/reservation-success';
import { getResourcePageUrl } from 'utils/resourceUtils';
import { addToDate } from 'utils/timeUtils';
import ReservationCalendarControls from './ReservationCalendarControls';
import reservationCalendarSelector from './reservationCalendarSelector';
import TimeSlots from './time-slots';

export class UnconnectedReservationCalendarContainer extends Component {
  constructor(props) {
    super(props);
    this.decreaseDate = this.decreaseDate.bind(this);
    this.increaseDate = this.increaseDate.bind(this);
    this.handleEditCancel = this.handleEditCancel.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  componentWillUnmount() {
    this.props.actions.clearReservations();
  }

  onDateChange(newDate) {
    const { resource } = this.props;
    browserHistory.push(getResourcePageUrl(resource, newDate));
  }

  decreaseDate() {
    this.onDateChange(addToDate(this.props.date, -1));
  }

  increaseDate() {
    this.onDateChange(addToDate(this.props.date, 1));
  }

  handleEditCancel() {
    this.props.actions.cancelReservationEdit();
  }

  render() {
    const {
      actions,
      date,
      isAdmin,
      isEditing,
      isFetchingResource,
      isLoggedIn,
      isMakingReservations,
      resource,
      selected,
      staffUnits,
      time,
      timeSlots,
      urlHash,
    } = this.props;

    const isStaff = includes(staffUnits, resource.unit);

    return (
      <div>
        <Calendar
          date={date}
          onChange={this.onDateChange}
        />
        <DateHeader
          date={date}
          onDecreaseDateButtonClick={this.decreaseDate}
          onIncreaseDateButtonClick={this.increaseDate}
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
        <ReservationCancelModal />
        <ReservationInfoModal />
        <ReservationSuccessModal />
      </div>
    );
  }
}

UnconnectedReservationCalendarContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isFetchingResource: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  location: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
    hash: PropTypes.string.isRequired,
  }).isRequired,
  params: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
    id: PropTypes.string.isRequired,
  }).isRequired,
  resource: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  staffUnits: PropTypes.array.isRequired,
  time: PropTypes.string,
  timeSlots: PropTypes.array.isRequired,
  urlHash: PropTypes.string.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    addNotification,
    cancelReservationEdit,
    clearReservations,
    openConfirmReservationModal,
    toggleTimeSlot,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default (
  connect(reservationCalendarSelector, mapDispatchToProps)(UnconnectedReservationCalendarContainer)
);
