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
    view: 'timeGridWeek',
  };

  componentDidUpdate(prevProps) {
    const { date } = this.props;

    if (date !== prevProps.date) {
      const calendarApi = this.calendarRef.current.getApi();
      calendarApi.gotoDate(date);
    }
  }

  getCalendarOptions = () => {
    const { intl, resource } = this.props;
    const slotSize = get(resource, 'slot_size', null);

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
      selectable: true,
      slotDuration: slotSize,
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

    // Add check resources reservation rules and disable days if needed.
    const momentDate = moment(date)
      .startOf('week');

    for (let i = 0; i < 7; i++) {
      if (!resourceUtils.isDateReservable(resource, momentDate.format(constants.DATE_FORMAT))) {
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

  getSlotLabelInterval = () => {
    const { resource } = this.props;
    const slotSize = get(resource, 'slot_size', null);

    if (slotSize === '00:15:00') {
      return '00:30:00';
    }

    return '01:00:00';
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
      view,
    } = this.state;

    if (view !== info.view.type) {
      this.setState({
        view: info.view.type,
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
    return this.isEventValid(dropInfo);
  };

  onSelectAllow = (selectInfo) => {
    return this.isEventValid(selectInfo);
  };

  isEventValid = (eventInfo) => {
    const { resource } = this.props;

    const now = moment();
    const start = moment(eventInfo.start);
    const end = moment(eventInfo.end);

    // Reservation cannot be longer than the resources max period if max period is set.
    const maxPeriod = get(resource, 'max_period', null);
    if (maxPeriod) {
      const maxPeriodDuration = moment.duration(maxPeriod);
      const maxDuration = maxPeriodDuration.hours() * 60 + maxPeriodDuration.minutes();

      if (end.diff(start, 'minutes') > maxDuration) {
        return false;
      }
    }

    if (!resourceUtils.isDateReservable(resource, start.format(constants.DATE_FORMAT))
      || !resourceUtils.isDateReservable(resource, end.format(constants.DATE_FORMAT))) {
      return false;
    }

    // Prevent selecting times from past.
    return start.isAfter(now);
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
      view,
      selected,
    } = this.state;

    return (
      <div className="app-ResourceReservationCalendar">
        <FullCalendar
          allDaySlot={false}
          businessHours={resourceUtils.getFullCalendarBusinessHours(resource, date)}
          datesRender={this.onDatesRender}
          defaultDate={date}
          eventAllow={this.onEventAllow}
          eventDrop={this.onEventDrop}
          eventResize={this.onEventResize}
          events={this.getEvents()}
          ref={this.calendarRef}
          select={this.onSelect}
          selectAllow={this.onSelectAllow}
          slotLabelInterval={this.getSlotLabelInterval()}
          {...this.getCalendarOptions()}
          maxTime={resourceUtils.getFullCalendarMaxTime(resource, date, view)}
          minTime={resourceUtils.getFullCalendarMinTime(resource, date, view)}
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
