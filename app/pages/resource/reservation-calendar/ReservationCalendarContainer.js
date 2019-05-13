import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import moment from 'moment';

import { addNotification } from 'actions/notificationsActions';
import { createDaysSlots, clearTimeSlotSelection, selectTimeSlot } from 'actions/timeSlotActions';
import {
  cancelReservationEdit,
  openConfirmReservationModal,
  selectReservationSlot,
} from 'actions/uiActions';
import ReservationCancelModal from 'shared/modals/reservation-cancel';
import ReservationInfoModal from 'shared/modals/reservation-info';
import ReservationSuccessModal from 'shared/modals/reservation-success';
import ReservationConfirmation from 'shared/reservation-confirmation';
import recurringReservations from 'state/recurringReservations';
import { injectT } from 'i18n';
import { getEditReservationUrl } from 'utils/reservationUtils';
import { hasMaxReservations, reservingIsRestricted } from 'utils/resourceUtils';
import reservationCalendarSelector from './reservationCalendarSelector';
import ReservingRestrictedText from './ReservingRestrictedText';
import TimeSlots from './time-slots';
import { getTimeDiff } from 'utils/timeUtils';

export class UnconnectedReservationCalendarContainer extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isFetchingResource: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isStaff: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    params: PropTypes.shape({
      // eslint-disable-line react/no-unused-prop-types
      id: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.object.isRequired,

    resource: PropTypes.object.isRequired,
    startSlot: PropTypes.object,
    endSlot: PropTypes.object,
    t: PropTypes.func.isRequired,
    time: PropTypes.string,
    resourceDates: PropTypes.array,
    reservationToEdit: PropTypes.array,
    daySlots: PropTypes.array.isRequired
  };

  componentDidMount() {
    const { actions, resourceDates, reservationToEdit } = this.props;

    actions.createDaysSlots({ resourceDates, reservationToEdit });
  }

  getDateTimeText = (slot, returnDate) => {
    const { t } = this.props;
    const time = moment(slot).format('HH:mm');
    const timeText = t('TimeSlots.selectedTime', { time });

    if (returnDate) {
      const dateText = moment(slot).format('dd D.M.Y');
      return `${dateText} ${timeText}`;
    }

    return `${timeText}`;
  };

  getSelectedTimeText = (startSlot) => {
    if (!startSlot) {
      return '';
    }

    const beginText = this.getDateTimeText(startSlot.start, true);
    const endText = this.getDateTimeText(startSlot.end, false);
    const duration = moment.duration(getTimeDiff(startSlot.end, startSlot.start));
    const durationText = this.getDurationText(duration);

    return `${beginText} - ${endText} (${durationText})`;
  };

  getDurationText = (duration) => {
    const hours = duration.hours();
    const mins = duration.minutes();
    return `${hours > 0 ? `${hours}h ` : ''}${mins}min`;
  }

  handleEditCancel = () => {
    this.props.actions.cancelReservationEdit();
  };

  handleReserveClick = () => {
    const {
      actions, isAdmin, resource, startSlot, t, history, endSlot
    } = this.props;
    if (!isAdmin && hasMaxReservations(resource)) {
      actions.addNotification({
        message: t('TimeSlots.maxReservationsPerUser'),
        type: 'error',
        timeOut: 10000,
      });
    } else {
      const nextUrl = getEditReservationUrl({ start: startSlot.start, end: endSlot.end });

      history.push(nextUrl);
    }
  };


  render() {
    const {
      actions,
      date,
      isAdmin,
      isEditing,
      isFetchingResource,
      isLoggedIn,
      isStaff,
      params,
      resource,
      t,
      time,
      daySlots,
      startSlot,
      endSlot
    } = this.props;

    const isOpen = Boolean(daySlots.length);
    const showTimeSlots = isOpen && !reservingIsRestricted(resource, date);

    return (
      <div className="reservation-calendar">
        {showTimeSlots && (
          <TimeSlots
            addNotification={actions.addNotification}
            endSlot={endSlot}
            isAdmin={isAdmin}
            isEditing={isEditing}
            isFetching={isFetchingResource}
            isLoggedIn={isLoggedIn}
            isStaff={isStaff}
            onClear={actions.clearTimeSlotSelection}
            onClick={actions.selectTimeSlot}
            resource={resource}
            selectedDate={date}
            slots={daySlots}
            startSlot={startSlot}
            time={time}
          />
        )}
        {showTimeSlots && startSlot && (
          <Row className="reservation-calendar-reserve-info">
            <Col xs={8}>
              <strong>
                {t('TimeSlots.selectedDate')}
                {' '}
              </strong>
              {this.getSelectedTimeText(startSlot)}
            </Col>
            <Col xs={4}>
              <Button
                bsStyle="primary"
                className="reservation-calendar__reserve-button"
                onClick={this.handleReserveClick}
              >
                {t('TimeSlots.reserveButton')}
              </Button>
            </Col>
          </Row>
        )}
        {!isOpen && <p className="info-text closed-text">{t('TimeSlots.closedMessage')}</p>}
        {isOpen && reservingIsRestricted(resource, date) && (
          <ReservingRestrictedText
            reservableBefore={resource.reservableBefore}
            reservableDaysInAdvance={resource.reservableDaysInAdvance}
          />
        )}
        <ReservationCancelModal />
        <ReservationInfoModal />
        <ReservationSuccessModal />
        <ReservationConfirmation
          params={params}
          // selectedReservations={selected}
          showTimeControls
          // timeSlots={selectedDateSlots}
        />
      </div>
    );
  }
}

UnconnectedReservationCalendarContainer = injectT(UnconnectedReservationCalendarContainer); // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    addNotification,
    cancelReservationEdit,
    changeRecurringBaseTime: recurringReservations.changeBaseTime,
    openConfirmReservationModal,
    selectReservationSlot,
    createDaysSlots,
    clearTimeSlotSelection,
    selectTimeSlot
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(
  reservationCalendarSelector,
  mapDispatchToProps
)(UnconnectedReservationCalendarContainer);
