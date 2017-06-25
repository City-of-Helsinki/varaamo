import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addNotification } from 'actions/notificationsActions';
import {
  cancelReservationEdit,
  clearReservations,
  openConfirmReservationModal,
  toggleTimeSlot,
} from 'actions/uiActions';
import ReservationCancelModal from 'shared/modals/reservation-cancel';
import ReservationInfoModal from 'shared/modals/reservation-info';
import ReservationSuccessModal from 'shared/modals/reservation-success';
import ReservationConfirmation from 'shared/reservation-confirmation';
import recurringReservations from 'state/recurringReservations';
import { injectT } from 'i18n';
import { combine } from 'utils/reservationUtils';
import { reservingIsRestricted } from 'utils/resourceUtils';
import { isPastDate } from 'utils/timeUtils';
import ReservationCalendarControls from './ReservationCalendarControls';
import reservationCalendarSelector from './reservationCalendarSelector';
import ReservingRestrictedText from './ReservingRestrictedText';
import TimeSlots from './time-slots';

export class UnconnectedReservationCalendarContainer extends Component {
  constructor(props) {
    super(props);
    this.handleEditCancel = this.handleEditCancel.bind(this);
    this.handleReserveButtonClick = this.handleReserveButtonClick.bind(this);
  }

  componentWillUnmount() {
    this.props.actions.clearReservations();
  }

  handleEditCancel() {
    this.props.actions.cancelReservationEdit();
  }

  handleReserveButtonClick() {
    const { actions, selected } = this.props;
    const selectedSlots = selected.map((current) => {
      const [begin, end] = current.split('/');
      return { begin, end };
    });
    const baseTime = combine(selectedSlots)[0];
    actions.changeRecurringBaseTime(baseTime);
    actions.openConfirmReservationModal();
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
      isStaff,
      params,
      resource,
      selected,
      t,
      time,
      timeSlots,
    } = this.props;

    const isOpen = Boolean(timeSlots.length);
    const showTimeSlots = isOpen && !reservingIsRestricted(resource, date);
    const showControls = !isPastDate(date) && showTimeSlots;
    return (
      <div className="reservation-calendar">
        {showTimeSlots &&
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
        }
        {!isOpen &&
          <p className="info-text closed-text">{t('TimeSlots.closedMessage')}</p>
        }
        {isOpen && reservingIsRestricted(resource, date) &&
          <ReservingRestrictedText
            reservableBefore={resource.reservableBefore}
            reservableDaysInAdvance={resource.reservableDaysInAdvance}
          />
        }
        {showControls &&
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
            onClick={this.handleReserveButtonClick}
            resource={resource}
          />
        }
        <ReservationCancelModal />
        <ReservationInfoModal />
        <ReservationSuccessModal />
        <ReservationConfirmation
          params={params}
          showTimeControls
          timeSlots={timeSlots}
        />
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
  isStaff: PropTypes.bool.isRequired,
  location: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
    query: PropTypes.object.isRequired,
  }).isRequired,
  params: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
    id: PropTypes.string.isRequired,
  }).isRequired,
  resource: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  time: PropTypes.string,
  timeSlots: PropTypes.array.isRequired,
};
UnconnectedReservationCalendarContainer = injectT(UnconnectedReservationCalendarContainer);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    addNotification,
    cancelReservationEdit,
    changeRecurringBaseTime: recurringReservations.changeBaseTime,
    clearReservations,
    openConfirmReservationModal,
    toggleTimeSlot,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default (
  connect(reservationCalendarSelector, mapDispatchToProps)(UnconnectedReservationCalendarContainer)
);
