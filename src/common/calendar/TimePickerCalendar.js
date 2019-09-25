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
import { selectErrorNotification } from './constants';
import { getDefaultSelectedTimeRange } from './utils';

const NEW_RESERVATION = 'NEW_RESERVATION';

class TimePickerCalendar extends Component {
  calendarRef = React.createRef();

  static propTypes = {
    date: PropTypes.string,
    isStaff: PropTypes.bool.isRequired,
    resource: PropTypes.object.isRequired,
    onDateChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    onTimeChange: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    addNotification: PropTypes.func.isRequired,
    edittingReservation: PropTypes.object
  };

  state = {
    viewType: 'timeGridWeek',
    selected: getDefaultSelectedTimeRange(this.props.edittingReservation)
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

    // Invoke select handler callback from props
    this.props.onTimeChange(selected);
  }

  onCancel = () => {
    const calendarApi = this.calendarRef.current.getApi();
    calendarApi.unselect();
    // Clear FullCalendar select tooltip

    // Revert to default timerange if cancel
    const defaultSelectedTimeRange = getDefaultSelectedTimeRange(this.props.edittingReservation);
    this.onChange(defaultSelectedTimeRange);
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
    const {
      resource, isStaff
    } = this.props;
    const { selected } = this.state;

    const events = this.getReservedEvents();

    if (selected) {
      events.push({
        classNames: [
          'app-TimePickerCalendar__event',
          'app-TimePickerCalendar__newReservation',
        ],
        editable: true,
        durationEditable: resourceUtils.isFullCalendarEventDurationEditable(
          resource, isStaff
        ),
        id: NEW_RESERVATION,
        ...selected,
      });
    }
    return events;
  };

  /**
   * isSelectionValid();
   * @param start {Date}
   * @param end {Date}
   * @returns {boolean}
   */
  isSelectionValid = (start, end) => {
    const { resource, isStaff } = this.props;

    const events = this.getReservedEvents();
    return resourceUtils.isTimeRangeReservable(resource, start, end, isStaff, events);
  };

  onEventRender = (info) => {
    // add cancel button for new selected event
    if (info.event.id === NEW_RESERVATION) {
      const cancelBtn = document.createElement('span');
      cancelBtn.classList.add('app-TimePickerCalendar__cancelEvent');
      cancelBtn.addEventListener('click', () => this.onCancel(), { once: true });
      info.el.append(cancelBtn);
    }
  }

  onSelect = (selectionInfo) => {
    const { addNotification, t, resource } = this.props;

    const minPeriodEndTime = resourceUtils.getMinPeriodEndTime(
      resource,
      selectionInfo.start, selectionInfo.end
    );
    // Make sure selected time alway > min_period

    const isValid = this.isSelectionValid(
      selectionInfo.start, minPeriodEndTime
    );

    if (isValid) {
      this.onChange({
        start: selectionInfo.start,
        end: minPeriodEndTime
      });
    } else {
      // Display error notifications if selection is not valid
      addNotification(selectErrorNotification(t));
    }
  };

  onEventResize = (eventResizeInfo) => {
    const { event } = eventResizeInfo;

    this.onSelect(event);
  }

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

  getReservedEvents = () => {
    const { resource, date } = this.props;

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
    return events;
  }

  render() {
    const { resource, date } = this.props;
    const { viewType } = this.state;

    return (
      <div className="app-Calendar">
        <FullCalendar
          {...this.getCalendarOptions()}
          allDaySlot={false}
          businessHours={resourceUtils.getFullCalendarBusinessHours(resource, date)}
          datesRender={this.onDatesRender}
          defaultDate={date}
          eventDrop={this.onEventResize}
          eventRender={this.onEventRender}
          eventResize={this.onEventResize}
          events={this.getEvents()}
          maxTime={resourceUtils.getFullCalendarMaxTime(resource, date, viewType)}
          minTime={resourceUtils.getFullCalendarMinTime(resource, date, viewType)}
          ref={this.calendarRef}
          select={this.onSelect}
          slotDuration={resourceUtils.getFullCalendarSlotDuration(resource, date, viewType)}
          slotLabelInterval={resourceUtils.getFullCalendarSlotLabelInterval(resource)}
        />
      </div>
    );
  }
}

export default injectT(TimePickerCalendar);
