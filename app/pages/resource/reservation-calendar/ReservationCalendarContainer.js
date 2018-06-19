import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import moment from 'moment';
import { first, last, orderBy } from 'lodash';

import { addNotification } from 'actions/notificationsActions';
import {
  cancelReservationEdit,
  openConfirmReservationModal,
  selectReservationSlot,
  toggleTimeSlot,
} from 'actions/uiActions';
import constants from 'constants/AppConstants';
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

export class UnconnectedReservationCalendarContainer extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isFetchingResource: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
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

  getSelectedDateSlots = (timeSlots, selected) => {
    if (timeSlots && selected.length) {
      const firstSelected = first(selected);
      const selectedDate = moment(firstSelected.begin).format(constants.DATE_FORMAT);
      const dateSlot = timeSlots.find((slot) => {
        if (slot && slot.length) {
          const slotDate = moment(slot[0].start).format(constants.DATE_FORMAT);
          return selectedDate === slotDate;
        }
        return false;
      });
      return dateSlot || [];
    }
    return [];
  }

  getSelectedTimeText = (selected) => {
    if (!selected.length) {
      return '';
    }
    const orderedSelected = orderBy(selected, 'begin');
    const beginSlot = first(orderedSelected);
    const endSlot = last(orderedSelected);
    const beginText = this.getDateTimeText(beginSlot.begin, true);
    const endText = this.getDateTimeText(endSlot.end, false);
    return `${beginText} - ${endText}`;
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
  }

  handleEditCancel = () => {
    this.props.actions.cancelReservationEdit();
  }

  handleReserveClick = () => {
    const { actions, isAdmin, resource, selected, t } = this.props;
    if (!isAdmin && hasMaxReservations(resource)) {
      actions.addNotification({
        message: t('TimeSlots.maxReservationsPerUser'),
        type: 'error',
        timeOut: 10000,
      });
    } else {
      const orderedSelected = orderBy(selected, 'begin');
      const { end } = last(orderedSelected);
      const reservation = Object.assign({}, first(orderedSelected), { end });
      const nextUrl = getEditReservationUrl(reservation);

      browserHistory.push(nextUrl);
    }
  }

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
      selected,
      t,
      time,
      timeSlots,
    } = this.props;

    const isOpen = Boolean(timeSlots.length);
    const showTimeSlots = isOpen && !reservingIsRestricted(resource, date);
    const selectedDateSlots = this.getSelectedDateSlots(timeSlots, selected);

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
            selectedDate={date}
            slots={timeSlots}
            time={time}
          />
        }
        {showTimeSlots && selected.length > 0 &&
          <div className="reservation-calendar-reserve-info">
            <Col xs={8}>
              <b>{t('TimeSlots.selectedDate')} </b>
              {this.getSelectedTimeText(selected)}
            </Col>
            <Col xs={4}>
              <Button
                bsStyle="primary"
                onClick={this.handleReserveClick}
              >
                {t('TimeSlots.reserveButton')}
              </Button>
            </Col>
          </div>
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
        <ReservationCancelModal />
        <ReservationInfoModal />
        <ReservationSuccessModal />
        <ReservationConfirmation
          params={params}
          selectedReservations={selected}
          showTimeControls
          timeSlots={selectedDateSlots}
        />
      </div>
    );
  }
}

UnconnectedReservationCalendarContainer = injectT(UnconnectedReservationCalendarContainer);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    addNotification,
    cancelReservationEdit,
    changeRecurringBaseTime: recurringReservations.changeBaseTime,
    openConfirmReservationModal,
    selectReservationSlot,
    toggleTimeSlot,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default (
  connect(reservationCalendarSelector, mapDispatchToProps)(UnconnectedReservationCalendarContainer)
);
