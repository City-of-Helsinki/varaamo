import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import PropTypes from 'prop-types';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import interactionPlugin from '@fullcalendar/interaction';
import enLocale from '@fullcalendar/core/locales/en-gb';
import svLocale from '@fullcalendar/core/locales/sv';
import fiLocale from '@fullcalendar/core/locales/fi';
import moment from 'moment';
import get from 'lodash/get';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import * as resourceUtils from '../../domain/resource/utils';
import constants from '../../../app/constants/AppConstants';
import injectT from '../../../app/i18n/injectT';
import { periodToMinute } from '../../../app/utils/timeUtils';

const NEW_RESERVATION = 'NEW_RESERVATION';

class TimePickerCalendar extends Component {
  calendarRef = React.createRef();

  static propTypes = {
    date: PropTypes.string,
    resource: PropTypes.object.isRequired,
    onDateChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    onTimeChange: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    defaultSelected: PropTypes.object,
  };

  static getDerivedStateFromProps(props, prevState) {
    if (isEmpty(prevState.selected) && props.defaultSelected) {
      return {
        selected: props.defaultSelected
      };
    }

    return null;
  }

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

  onChange = (selected) => {
    this.setState({ selected });

    this.props.onTimeChange(selected);
  }

  getCalendarOptions = () => {
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
      locale: this.props.locale,
      locales: [enLocale, svLocale, fiLocale],
      nowIndicator: true,
      plugins: [timeGridPlugin, momentTimezonePlugin, interactionPlugin],
      selectable: true,
      selectOverlap: false,
      selectConstraint: 'businessHours',
      selectMirror: true,
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
      return classNames('app-TimePickerCalendar__event', {
        'app-TimePickerCalendar__event--reserved': !isOwn,
      });
    };
    // Add the resources reservations as normal FullCalendar events.
    const reservations = get(resource, 'reservations', []);

    const events = isEmpty(reservations) ? [] : reservations.map(reservation => ({
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
            'app-TimePickerCalendar__backgroundEvent',
            'app-TimePickerCalendar__restrictedDate',
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
          'app-TimePickerCalendar__event',
          'app-TimePickerCalendar__newReservation',
        ],
        editable: true,
        durationEditable: resourceUtils.isFullCalendarEventDurationEditable(resource, selected.start, selected.end),
        id: NEW_RESERVATION,
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
    const activeEnd = moment(info.view.activeEnd).subtract(1, 'day');

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
    return resourceUtils.isTimeRangeReservable(resource, start, end);
  };

  onEventDrop = (eventDropInfo) => {
    const { event } = eventDropInfo;

    this.onChange({
      start: event.start,
      end: event.end,
    });
  };

  onEventResize = (eventResizeInfo) => {
    const { event } = eventResizeInfo;

    this.onChange({
      start: event.start,
      end: event.end,
    });
  };

  onEventRender = (info) => {
    if (info.event.id === NEW_RESERVATION) {
      const cancelBtn = document.createElement('span');
      cancelBtn.classList.add('app-TimePickerCalendar__cancelEvent');
      cancelBtn.addEventListener('click', () => this.onChange(null), { once: true });
      info.el.append(cancelBtn);
    }
  }

  onSelect = (selectionInfo) => {
    const { resource } = this.props;

    let selectionEnd = selectionInfo.end;

    if (resource.min_period) {
      const minPeriodInMinutes = periodToMinute(resource.min_period);

      selectionEnd = moment(selectionEnd).add(minPeriodInMinutes, 'minutes').toDate();
    }
    this.onChange({
      start: selectionInfo.start,
      end: selectionEnd,
    });

    // Hide the FullCalendar selection widget/indicator.
    const calendarApi = this.calendarRef.current.getApi();
    calendarApi.unselect();
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
    const { t, resource } = this.props;
    const { selected } = this.state;

    if (selected) {
      const start = moment(selected.start);
      const end = moment(selected.end);
      const price = resourceUtils.getReservationPrice(selected.start, selected.end, resource);

      const tVariables = {
        date: start.format('dd D.M.Y'),
        start: start.format('HH:mm'),
        end: end.format('HH:mm'),
        duration: this.getDurationText(),
        price,
      };

      if (price) {
        return t('TimePickerCalendar.selectedDateValueWithPrice', tVariables);
      }

      return t('TimePickerCalendar.selectedDateValue', tVariables);
    }

    return '';
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

  render() {
    const { resource, date } = this.props;
    const { viewType } = this.state;

    return (
      <div className="app-Calendar">
        <FullCalendar
          {...this.getCalendarOptions()}
          allDaySlot={false}
          businessHours={resourceUtils.getFullCalendarBusinessHours(resource, date)}
          dateClick={this.onDateClick}
          datesRender={this.onDatesRender}
          defaultDate={date}
          eventAllow={this.onEventAllow}
          eventDrop={this.onEventDrop}
          eventRender={this.onEventRender}
          eventResize={this.onEventResize}
          events={this.getEvents()}
          maxTime={resourceUtils.getFullCalendarMaxTime(resource, date, viewType)}
          minTime={resourceUtils.getFullCalendarMinTime(resource, date, viewType)}
          ref={this.calendarRef}
          select={this.onSelect}
          selectAllow={this.onSelectAllow}
          slotDuration={resourceUtils.getFullCalendarSlotDuration(resource, date, viewType)}
          slotLabelInterval={resourceUtils.getFullCalendarSlotLabelInterval(resource)}
        />
      </div>
    );
  }
}

export default injectT(TimePickerCalendar);
