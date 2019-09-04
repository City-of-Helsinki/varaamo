import * as React from 'react';
import Button from 'react-bootstrap/lib/Button';
import moment from 'moment';
import PropTypes from 'prop-types';

import TimePickerCalendar from '../../../common/calendar/TimePickerCalendar';
import injectT from '../../../../app/i18n/injectT';
import * as resourceUtils from '../utils';

class ResourceReservationCalendar extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    resource: PropTypes.object.isRequired,
    onDateChange: PropTypes.func.isRequired,
    date: PropTypes.string
  }

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

  onTimeChange = selected => this.setState(selected);

  render() {
    const {
      resource, t, onDateChange, date
    } = this.props;

    const { selected } = this.state;

    return (
      <div className="app-ResourceReservationCalendar">
        <TimePickerCalendar
          date={date}
          onDateChange={newDate => onDateChange(moment(newDate).toDate())}
          onTimeChange={this.onTimeChange}
          resource={resource}
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
              onClick={this.onReserveButtonClick}
            >
              {t('ResourceReservationCalendar.reserveButton')}
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default injectT(ResourceReservationCalendar);
