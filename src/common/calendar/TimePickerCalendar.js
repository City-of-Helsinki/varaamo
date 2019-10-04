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
      left: 'prev,next today',
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
    let maxPeriod;
    let duration;

    if (info.event.id === NEW_RESERVATION) {
      // Add cancel button for new selected event.
      const cancelBtn = document.createElement('span');
      cancelBtn.classList.add('app-TimePickerCalendar__cancelEvent');
      cancelBtn.addEventListener('click', () => this.onCancel(), { once: true });
      info.el.append(cancelBtn);

      maxPeriod = get(info.event.extendedProps, 'maxPeriod', null);
      duration = get(info.event.extendedProps, 'duration', null);
    } else if (info.event.id === '') {
      // While event is being resized, before user is finished dragging.
      maxPeriod = this.getMaxLengthText(info.event);
      // FullCalendar gives us same start and en time, we can use min time:
      duration = this.getDurationText(this.getSelectableTimeRange(info.event));
    }

    if (duration) {
      const eventDuration = document.createElement('span');
      eventDuration.textContent = duration;
      eventDuration.classList.add('app-TimePickerCalendar__eventDuration');
      info.el.append(eventDuration);
    }

    if (maxPeriod) {
      const eventMaxLength = document.createElement('span');
      eventMaxLength.classList.add('app-TimePickerCalendar__eventDuration--max');
      eventMaxLength.textContent = ` (${maxPeriod})`;
      info.el.append(eventMaxLength);
    }
  }

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

    if (window.innerWidth < 768) {
      // mobile view config
      view = 'timeGridDay';
      headerConfig = {
        left: 'today,prev',
        center: 'title',
        right: 'next,timeGridDay,timeGridWeek'
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

  getMaxLengthText = () => {
    const { t, resource } = this.props;
    const maxPeriod = resource.max_period;
    return resourceUtils.getMaxPeriodText(t, { maxPeriod });
  }

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
        extendedProps: {
          maxPeriod: this.getMaxLengthText(),
          duration: this.getDurationText(selected),
        },
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
    const { resource, date } = this.props;
    const { viewType, header } = this.state;

    return (
      <div className="app-TimePickerCalendar">
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
