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
import * as calendarUtils from './utils';
import { createNotification } from '../notification/utils';
import { NOTIFICATION_TYPE } from '../notification/constants';

const NEW_RESERVATION = 'NEW_RESERVATION';

moment.tz.setDefault(SETTINGS.TIME_ZONE);
// Re-apply moment-timezone default timezone, cause FullCalendar import have override the import

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
    edittingReservation: PropTypes.object
  };

  state = {
    viewType: 'timeGridWeek',
    selected: calendarUtils.getDefaultSelectedTimeRange(this.props.edittingReservation),
    header: {
      left: 'myPrev,myNext,myToday',
      center: 'title',
      right: 'timeGridDay,timeGridWeek'
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { date } = this.props;
    const { viewType } = this.state;

    const calendarApi = this.calendarRef.current.getApi();

    if (date !== prevProps.date) {
      calendarApi.gotoDate(date);
    }
    if (viewType !== prevState.viewType) {
      calendarApi.changeView(viewType);
    }
  }

  isSelectionValid = (selection) => {
    const { resource } = this.props;

    const events = this.getReservedEvents();
    return resourceUtils.isTimeRangeReservable(resource, selection.start, selection.end, events);
  };

  onChange = (selected) => {
    this.setState({ selected });

    // Invoke select handler callback from props
    this.props.onTimeChange(selected);
  }

  onCancel = () => {
    // Revert to default timerange if cancel
    const defaultSelectedTimeRange = calendarUtils.getDefaultSelectedTimeRange(this.props.edittingReservation);
    this.onChange(defaultSelectedTimeRange);
  }

  onEventRender = (info) => {
    // add cancel button for new selected event
    let duration;

    if (info.event.id === NEW_RESERVATION) {
      const cancelBtn = document.createElement('span');
      cancelBtn.classList.add('app-TimePickerCalendar__cancelEvent');
      cancelBtn.addEventListener('click', () => this.onCancel(), { once: true });
      info.el.append(cancelBtn);
      duration = this.getDurationText(info.event);
    } else if (info.event.id === '') {
      duration = this.getDurationText(info.event);
    }

    if (duration) {
      const eventDuration = document.createElement('span');
      eventDuration.textContent = duration;
      eventDuration.classList.add('app-TimePickerCalendar__maxDuration');
      info.el.append(eventDuration);
    }
  };

  onSelect = (selectionInfo) => {
    const { t } = this.props;

    const calendarApi = this.calendarRef.current.getApi();
    calendarApi.unselect();
    // Clear FullCalendar select tooltip

    const selectable = this.getSelectableTimeRange(selectionInfo);
    // Make sure selected time alway furfill period check.

    const isValid = this.isSelectionValid(selectable);

    if (isValid) {
      this.onChange(selectable);
    } else {
      // Display error notifications if selection is not valid
      createNotification(NOTIFICATION_TYPE.ERROR, t('Notifications.selectTimeToReserve.warning'));
    }
  };

  // Check if event resize allowed
  onEventResize = (selectionInfo) => {
    const { event } = selectionInfo;
    const selectable = this.getSelectableTimeRange(event, selectionInfo);

    this.onChange(selectable);
  }

  onDatesRender = (info) => {
    const { viewType, header } = this.state;
    let view = info.view.type;
    let headerConfig = header;

    // 768
    if (window.innerWidth < 768) {
      // mobile view config
      view = 'timeGridDay';
      headerConfig = {
        left: 'myPrev,myNext,myToday',
        center: 'title',
        right: 'timeGridDay,timeGridWeek'
      };
    }
    if (viewType !== view) {
      this.setState({ viewType: view, header: headerConfig });
    }
  }

  /**
   * To ensure the selected time range will always between min and max period
   * Return a selectable timerange if input timerange is somehow not between min and max period
   * Display info text to user about those changes.
   *
   * @return  {Object}  Normalized selected time range
   */
  getSelectableTimeRange = (selected, eventCallback) => {
    const { resource, isStaff, t } = this.props;

    let selectable = {
      start: selected.start,
      end: selected.end
    };

    const isUnderMinPeriod = calendarUtils.isTimeRangeUnderMinPeriod(
      resource, selectable.start, selectable.end
    );

    const isOverMaxPeriod = calendarUtils.isTimeRangeOverMaxPeriod(
      resource, selectable.start, selectable.end, isStaff
    );

    if (isUnderMinPeriod) {
      const minPeriod = get(resource, 'min_period', null);
      const minPeriodDuration = moment.duration(minPeriod).asHours();

      if (eventCallback) {
        eventCallback.revert();
        createNotification(
          NOTIFICATION_TYPE.INFO, t('TimePickerCalendar.info.minPeriodText', { duration: minPeriodDuration })
        );
      }

      selectable = calendarUtils.getMinPeriodTimeRange(resource, selected.start, selected.end);
      // Make sure selected time will always bigger than min period
    }

    if (isOverMaxPeriod) {
      const maxPeriod = get(resource, 'max_period', null);
      const maxPeriodDuration = moment.duration(maxPeriod).asHours();

      if (eventCallback) {
        eventCallback.revert();
      }

      createNotification(
        NOTIFICATION_TYPE.INFO, t('TimePickerCalendar.info.maxPeriodText', { duration: maxPeriodDuration })
      );

      selectable = calendarUtils.getMaxPeriodTimeRange(
        resource, selectable.start, selectable.end, isStaff
      );
      // Make sure selected time will always smaller than max period
    }

    return selectable;
  }

  getDurationText = (selected) => {
    const { resource } = this.props;
    const start = moment(selected.start);
    const end = moment(selected.end);
    const duration = moment.duration(end.diff(start));

    let maxDurationText = '';

    if (resource.max_period) {
      const maxDuration = get(resource, 'max_period', null);
      const maxDurationSeconds = moment.duration(maxDuration).asSeconds();
      maxDurationText = `(${maxDurationSeconds / 3600}h max)`;
    }

    return `${duration / 3600000}h ${maxDurationText}`;
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

  getCalendarOptions = () => {
    return {
      timeZone: SETTINGS.TIME_ZONE,
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
      dragScroll: true,
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: false,
        meridiem: 'short'
      },
      unselectAuto: false,
      longPressDelay: '500',
      // Almost invoke click event on mobile immediatelly without any delay
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
        durationEditable: !calendarUtils.isTimeRangeOverMaxPeriod(
          resource, selected.start, selected.end, isStaff
        ),
        id: NEW_RESERVATION,
        ...selected,
      });
    }
    return events;
  };

  render() {
    const {
      date,
      onDateChange,
      resource,
      t
    } = this.props;
    const { viewType, header } = this.state;
    const addValue = viewType === 'timeGridWeek' ? 'w' : 'd';
    return (
      <div className="app-TimePickerCalendar">
        <FullCalendar
          {...this.getCalendarOptions()}
          allDaySlot={false}
          businessHours={resourceUtils.getFullCalendarBusinessHours(resource, date)}
          customButtons={{
            myPrev: {
              text: ' ',
              click: () => onDateChange(moment(date).subtract(1, addValue).toDate())
            },
            myNext: {
              text: ' ',
              click: () => onDateChange(moment(date).add(1, addValue).toDate())
            },
            myToday: {
              text: t('TimePickerCalendar.info.today'),
              click: () => onDateChange(this.calendarRef.current.calendar.view.initialNowDate)
            }
          }}
          datesRender={this.onDatesRender}
          defaultDate={date}
          eventDrop={this.onEventResize}
          eventRender={this.onEventRender}
          eventResize={this.onEventResize}
          events={this.getEvents()}
          header={header}
          maxTime={resourceUtils.getFullCalendarMaxTime(resource, date, viewType)}
          minTime={resourceUtils.getFullCalendarMinTime(resource, date, viewType)}
          onDatesRender={this.onDatesRender}
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
