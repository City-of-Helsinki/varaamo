import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import interactionPlugin from '@fullcalendar/interaction';
import enLocale from '@fullcalendar/core/locales/en-gb';
import svLocale from '@fullcalendar/core/locales/sv';
import fiLocale from '@fullcalendar/core/locales/fi';
import moment from 'moment';
import get from 'lodash/get';
import classNames from 'classnames';
import Button from 'react-bootstrap/lib/Button';

import constants from '../../../../app/constants/AppConstants';
import * as resourceUtils from '../utils';
import injectT from '../../../../app/i18n/injectT';

class ResourceReservationCalendar extends React.Component {
  calendarRef = React.createRef();

  static propTypes = {
    date: PropTypes.string,
    intl: intlShape,
    resource: PropTypes.object.isRequired,
    onDateChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {
    selected: null,
    viewType: 'timeGridWeek',
  };

  componentDidUpdate(prevProps) {
    const { date } = this.props;

    if (date !== prevProps.date) {
      const calendarApi = this.calendarRef.current.getApi();
      calendarApi.gotoDate(date);
    }
  }

  getCalendarOptions = () => {
    const { intl } = this.props;

    return {
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridDay,timeGridWeek'
      },
      height: 'auto',
      editable: true,
      eventConstraint: 'businessHours',
      eventOverlap: false,
      firstDay: 1,
      locale: intl.locale,
      locales: [enLocale, svLocale, fiLocale],
      nowIndicator: true,
      plugins: [timeGridPlugin, momentTimezonePlugin, interactionPlugin],
      // selectable: true,
      selectOverlap: false,
      selectConstraint: 'businessHours',
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: false,
        meridiem: 'short'
      },
      unselectAuto: false,
    };
  };

  getEvents = () => {
    const { resource, date } = this.props;
    const { selected } = this.state;

    const getClassNames = (reservation) => {
      const isOwn = get(reservation, 'is_own', false);
      return classNames('app-ResourceReservationCalendar__event', {
        'app-ResourceReservationCalendar__event--reserved': !isOwn,
      });
    };

    // Add the resources reservations as normal FullCalendar events.
    const events = get(resource, 'reservations', []).map(reservation => ({
      classNames: [getClassNames(reservation)],
      editable: false,
      id: reservation.id,
      start: moment(reservation.begin).toDate(),
      end: moment(reservation.end).toDate(),
    }));

    // Check resources reservation rules and disable days if needed.
    const now = moment();
    const momentDate = moment(date)
      .startOf('week');

    for (let i = 0; i < 7; i++) {
      if (
        momentDate.isBefore(now, 'date')
        || !resourceUtils.isDateReservable(resource, momentDate.format(constants.DATE_FORMAT))
      ) {
        events.push({
          allDay: true,
          classNames: [
            'app-ResourceReservationCalendar__backgroundEvent',
            'app-ResourceReservationCalendar__restrictedDate',
          ],
          id: momentDate.format(constants.DATE_FORMAT),
          start: momentDate.toDate(),
          end: momentDate.toDate(),
          rendering: 'background',
        });
      }

      momentDate.add(1, 'day');
    }

    // Add the selected time range into calendar as an event.
    if (selected) {
      events.push({
        classNames: [
          'app-ResourceReservationCalendar__event',
          'app-ResourceReservationCalendar__newReservation',
        ],
        editable: true,
        id: 'newReservation',
        ...selected,
      });
    }

    return events;
  };

  onDatesRender = (info) => {
    const {
      date,
      onDateChange,
    } = this.props;

    const momentDate = moment(date);
    const activeStart = moment(info.view.activeStart);

    // For some weird reason the activeEnd date is always last day of the day/week view + 1
    // (e.g. for a week view it's always the next weeks monday);
    const activeEnd = moment(info.view.activeEnd).subtract(1);

    if (momentDate.isBefore(activeStart, 'day') || momentDate.isAfter(activeEnd, 'day')) {
      onDateChange(activeStart.format(constants.DATE_FORMAT));
    }

    const {
      viewType,
    } = this.state;

    if (viewType !== info.view.type) {
      this.setState({
        viewType: info.view.type,
      });
    }
  };

  onDateClick = (dateClickInfo) => {
    const { resource } = this.props;
    const slotSize = resourceUtils.getSlotSizeInMinutes(resource);

    const start = moment(dateClickInfo.date);
    const end = start.clone().add(slotSize, 'minutes');

    if (this.isEventValid(start.toDate(), end.toDate())) {
      const calendarApi = this.calendarRef.current.getApi();
      calendarApi.select({
        start: start.toDate(),
        end: end.toDate(),
      });
    }
  };

  onSelect = (selectionInfo) => {
    this.setState({
      selected: {
        start: selectionInfo.start,
        end: selectionInfo.end,
      },
    });

    // Hide the FullCalendar selection widget/indicator.
    const calendarApi = this.calendarRef.current.getApi();
    calendarApi.unselect();
  };

  onEventAllow = (dropInfo) => {
    return this.isEventValid(dropInfo.start, dropInfo.end);
  };

  onSelectAllow = (selectInfo) => {
    return this.isEventValid(selectInfo.start, selectInfo.end);
  };

  /**
   * isEventValid();
   * @param start {Date}
   * @param end {Date}
   * @returns {boolean}
   */
  isEventValid = (start, end) => {
    const { resource } = this.props;

    const now = moment();
    const startMoment = moment(start);
    const endMoment = moment(end);

    // Reservation cannot be longer than the resources max period if max period is set.
    const maxPeriod = get(resource, 'max_period', null);
    if (maxPeriod) {
      const maxPeriodDuration = moment.duration(maxPeriod);
      const maxDuration = maxPeriodDuration.hours() * 60 + maxPeriodDuration.minutes();

      if (endMoment.diff(startMoment, 'minutes') > maxDuration) {
        return false;
      }
    }

    if (!resourceUtils.isDateReservable(resource, startMoment.format(constants.DATE_FORMAT))
      || !resourceUtils.isDateReservable(resource, endMoment.format(constants.DATE_FORMAT))) {
      return false;
    }

    // Check if the given event times are inside opening hours.
    const dateString = startMoment.format(constants.DATE_FORMAT);
    const openingHours = resourceUtils.getOpeningHours(resource, dateString);
    const opens = moment(openingHours.opens);
    const closes = moment(openingHours.closes);

    if (startMoment.isBefore(opens) || endMoment.isAfter(closes)) {
      return false;
    }

    // Prevent selecting times from past.
    return startMoment.isAfter(now);
  };

  onEventDrop = (eventDropInfo) => {
    const { event } = eventDropInfo;

    this.setState({
      selected: {
        start: event.start,
        end: event.end,
      },
    });
  };

  onEventResize = (eventResizeInfo) => {
    const { event } = eventResizeInfo;

    this.setState({
      selected: {
        start: event.start,
        end: event.end,
      },
    });
  };

  onReserveButtonClick = () => {

  };

  getDurationText = () => {
    const { selected } = this.state;
    const start = moment(selected.start);
    const end = moment(selected.end);
    const duration = moment.duration(end.diff(start));
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

    let text = '';
    if (days) {
      text = `${days}d`;
    }

    if (hours) {
      text += `${hours}h`;
    }

    if (minutes) {
      text += `${minutes}min`;
    }

    return text;
  };

  getSelectedDateText = () => {
    const { t } = this.props;
    const { selected } = this.state;

    if (selected) {
      const start = moment(selected.start);
      const end = moment(selected.end);

      return t('ResourceReservationCalendar.selectedDateValue', {
        date: start.format('dd D.M.Y'),
        start: start.format('HH:mm'),
        end: end.format('HH:mm'),
        duration: this.getDurationText(),
      });
    }

    return '';
  };

  render() {
    const {
      date,
      resource,
      t,
    } = this.props;

    const {
      viewType,
      selected,
    } = this.state;

    return (
      <div className="app-ResourceReservationCalendar">
        <p>Slot size: {resource.slot_size}</p>
        <p>Min & max period: {resource.min_period} - {resource.max_period}</p>

        <FullCalendar
          allDaySlot={false}
          businessHours={resourceUtils.getFullCalendarBusinessHours(resource, date)}
          dateClick={this.onDateClick}
          datesRender={this.onDatesRender}
          defaultDate={date}
          eventAllow={this.onEventAllow}
          eventDrop={this.onEventDrop}
          eventResize={this.onEventResize}
          events={this.getEvents()}
          ref={this.calendarRef}
          select={this.onSelect}
          selectAllow={this.onSelectAllow}
          slotDuration={resourceUtils.getFullCalendarSlotDuration(resource, date, viewType)}
          slotLabelInterval={resourceUtils.getFullCalendarSlotLabelInterval(resource)}
          {...this.getCalendarOptions()}
          maxTime={resourceUtils.getFullCalendarMaxTime(resource, date, viewType)}
          minTime={resourceUtils.getFullCalendarMinTime(resource, date, viewType)}
        />

        {selected && (
          <div className="app-ResourceReservationCalendar__selectedInfo">
            <div className="app-ResourceReservationCalendar__selectedDate">
              <strong className="app-ResourceReservationCalendar__selectedDateLabel">
                {t('ResourceReservationCalendar.selectedDateLabel')}
              </strong>
              {' '}
              <span className="app-ResourceReservationCalendar__selectedDateValue">
                {this.getSelectedDateText()}
              </span>
            </div>
            <Button
              bsStyle="primary"
              className="app-ResourceReservationCalendar__reserveButton"
              onClick={() => this.onReserveButtonClick()}
            >
              {t('ResourceReservationCalendar.reserveButton')}
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default injectT(injectIntl(ResourceReservationCalendar));
