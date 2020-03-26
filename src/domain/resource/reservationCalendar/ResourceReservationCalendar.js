import * as React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import injectT from '../../../../app/i18n/injectT';
import TimePickerCalendar from '../../../common/calendar/TimePickerCalendar';
import * as resourceUtils from '../utils';

class UntranslatedResourceReservationCalendar extends React.Component {
  calendarRef = React.createRef();

  static propTypes = {
    date: PropTypes.string,
    isLoggedIn: PropTypes.bool,
    isStaff: PropTypes.bool,
    onDateChange: PropTypes.func.isRequired,
    onReserve: PropTypes.func.isRequired,
    resource: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {
    selected: null,
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
        return t('ResourceReservationCalendar.selectedDateValueWithPrice', tVariables);
      }

      return t('ResourceReservationCalendar.selectedDateValue', tVariables);
    }

    return '';
  };

  onReserveButtonClick = () => {
    const {
      onReserve,
      resource,
    } = this.props;
    const { selected } = this.state;

    onReserve(selected, resource);
  }

  onLoginButtonClick = () => {
    const next = encodeURIComponent(window.location.href);
    window.location.assign(`${window.location.origin}/login?next=${next}`);
  }

  render() {
    const {
      date,
      isLoggedIn,
      isStaff,
      resource,
      t,
      onDateChange,
    } = this.props;

    const {
      selected,
    } = this.state;

    const canMakeReservations = get(resource, 'user_permissions.can_make_reservations', false);

    return (
      <div className="app-ResourceReservationCalendar">
        <TimePickerCalendar
          date={date}
          disabled={!canMakeReservations}
          isStaff={isStaff}
          onDateChange={onDateChange}
          onTimeChange={selectedTime => this.setState({ selected: selectedTime })}
          resource={resource}
        />
        {!isLoggedIn ? (
          <div className="app-ResourceReservationCalendar__selectedInfo">
            <div className="app-ResourceReservationCalendar__loginInfo">
              {t('ReservationInfo.loginText')}
            </div>
            <Button
              bsStyle="primary"
              className="app-ResourceReservationCalendar__loginButton"
              onClick={this.onLoginButtonClick}
            >
              {t('Navbar.login')}
            </Button>
          </div>
        ) : (
          !isEmpty(selected) && (
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
              disabled={!canMakeReservations}
              onClick={this.onReserveButtonClick}
            >
              {t('ResourceReservationCalendar.reserveButton')}
            </Button>
          </div>
          )
        )}
      </div>
    );
  }
}

export { UntranslatedResourceReservationCalendar };

export default injectT(UntranslatedResourceReservationCalendar);
