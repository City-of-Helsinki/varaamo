import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import enLocale from '@fullcalendar/core/locales/en-gb';
import svLocale from '@fullcalendar/core/locales/sv';
import fiLocale from '@fullcalendar/core/locales/fi';
import moment from 'moment';
import get from 'lodash/get';
import classNames from 'classnames';

import constants from '../../../../app/constants/AppConstants';
import * as resourceUtils from '../utils';

class ResourceReservationCalendar extends React.Component {
  calendarRef = React.createRef();

  static propTypes = {
    date: PropTypes.string,
    intl: intlShape,
    resource: PropTypes.object.isRequired,
    onDateChange: PropTypes.func.isRequired,
  };

  state = {
    view: 'timeGridWeek',
  };

  componentDidUpdate(prevProps) {
    const { date } = this.props;

    if (date !== prevProps.date) {
      const calendarApi = this.calendarRef.current.getApi();
      calendarApi.gotoDate(date);
    }
  }

  getEvents = () => {
    const { resource } = this.props;

    const getClassNames = (reservation) => {
      return classNames('app-ResourceReservationCalendar__event', {
        'app-ResourceReservationCalendar__event--reserved': !reservation.is_own,
      });
    };

    return get(resource, 'reservations', []).map(reservation => ({
      classNames: [getClassNames(reservation)],
      id: reservation.id,
      start: moment(reservation.begin).toDate(),
      end: moment(reservation.end).toDate(),
    }));
  };

  getSlotLabelInterval = () => {
    const { resource } = this.props;

    if (resource.slot_size === '00:15:00') {
      return '00:30:00';
    }

    return '01:00:00';
  };

  getCalendarOptions = () => {
    const {
      intl,
      resource,
    } = this.props;

    return {
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridDay,timeGridWeek'
      },
      height: 'auto',
      firstDay: 1,
      locale: intl.locale,
      locales: [enLocale, svLocale, fiLocale],
      nowIndicator: true,
      plugins: [timeGridPlugin, momentTimezonePlugin],
      slotDuration: resource.slot_size,
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: false,
        meridiem: 'short'
      },
    };
  };

  onDatesRender = (info) => {
    const {
      date,
      onDateChange,
    } = this.props;

    const momentDate = moment(date);
    const activeStart = moment(info.view.activeStart);
    const activeEnd = moment(info.view.activeEnd);

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

  render() {
    const {
      date,
      resource,
    } = this.props;

    const {
      view,
    } = this.state;

    return (
      <div className="app-ResourceReservationCalendar">
        <FullCalendar
          allDaySlot={false}
          businessHours={resourceUtils.getFullCalendarBusinessHours(resource, date)}
          datesRender={this.onDatesRender}
          defaultDate={date}
          events={this.getEvents()}
          ref={this.calendarRef}
          slotLabelInterval={this.getSlotLabelInterval()}
          {...this.getCalendarOptions()}
          maxTime={resourceUtils.getFullCalendarMaxTime(resource, date, view)}
          minTime={resourceUtils.getFullCalendarMinTime(resource, date, view)}
        />
      </div>
    );
  }
}

export default injectIntl(ResourceReservationCalendar);
