import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
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
import ResourceCalendar from 'shared/resource-calendar';
import recurringReservations from 'state/recurringReservations';
import { injectT } from 'i18n';
import { combine } from 'utils/reservationUtils';
import { getResourcePageUrl, reservingIsRestricted } from 'utils/resourceUtils';
import { addToDate, isPastDate } from 'utils/timeUtils';
import ReservationCalendarControls from './ReservationCalendarControls';
import reservationCalendarSelector from './reservationCalendarSelector';
import ReservingRestrictedText from './ReservingRestrictedText';
import TimeSlots from './time-slots';

export class UnconnectedReservationCalendarContainer extends Component {
  constructor(props) {
    super(props);
    this.decreaseDate = this.decreaseDate.bind(this);
    this.increaseDate = this.increaseDate.bind(this);
    this.handleEditCancel = this.handleEditCancel.bind(this);
    this.handleReserveButtonClick = this.handleReserveButtonClick.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  componentWillUnmount() {
    this.props.actions.clearReservations();
  }

  onDateChange(newDate) {
    const { resource } = this.props;
    const day = newDate.toISOString().substring(0, 10);
    browserHistory.push(getResourcePageUrl(resource, day));
  }

  decreaseDate() {
    this.onDateChange(new Date(addToDate(this.props.date, -1)));
  }

  increaseDate() {
    this.onDateChange(new Date(addToDate(this.props.date, 1)));
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

  renderCalendar() {
    return (
      <ResourceCalendar
        onDateChange={this.onDateChange}
        resourceId={this.props.resource.id}
        selectedDate={this.props.date}
      />
    );
  }

  renderTimeSlots() {
    const {
      actions,
      date,
      isAdmin,
      isEditing,
      isFetchingResource,
      isLoggedIn,
      isMakingReservations,
      isStaff,
      resource,
      selected,
      t,
      time,
      timeSlots,
      urlHash,
    } = this.props;

    const isOpen = Boolean(timeSlots.length);
    const showTimeSlots = isOpen && !reservingIsRestricted(resource, date);
    const showControls = !isPastDate(date) && showTimeSlots;
    return (
      <div>
        <DateHeader
          date={date}
          onDecreaseDateButtonClick={this.decreaseDate}
          onIncreaseDateButtonClick={this.increaseDate}
          scrollTo={urlHash === '#date-header'}
        />
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
      </div>
    );
  }

  render() {
    return (
      this.props.isAdmin ?
        <div className="reservation-calendar">
          <h3 id="resource-calendar-header">{this.props.t('ReservationCalendar.header')}</h3>
          {this.renderCalendar()}
          {this.renderTimeSlots()}
        </div> :
          <Row className="reservation-calendar">
            <Col sm={4} xs={12}>
              <h3 id="resource-calendar-header">{this.props.t('ReservationCalendar.header')}</h3>
              {this.renderCalendar()}
            </Col>
            <Col sm={8} xs={12}>
              {this.renderTimeSlots()}
            </Col>
          </Row>
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
    hash: PropTypes.string.isRequired,
  }).isRequired,
  params: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
    id: PropTypes.string.isRequired,
  }).isRequired,
  resource: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  time: PropTypes.string,
  timeSlots: PropTypes.array.isRequired,
  urlHash: PropTypes.string.isRequired,
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
