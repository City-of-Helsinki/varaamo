import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import moment from 'moment';
import first from 'lodash/first';
import last from 'lodash/last';
import orderBy from 'lodash/orderBy';

import injectT from '../../../../../app/i18n/injectT';
import TimePickerCalendar from '../../../../common/calendar/TimePickerCalendar';

class ReservationCalendar extends Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    resource: PropTypes.object.isRequired,
    reservation: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    onDateChange: PropTypes.func.isRequired,
  };

  state = {
    reservationPrice: '',
  }

  getSelectedTimeText = (selected) => {
    const { reservationPrice } = this.state;
    const { t } = this.props;

    if (!selected) {
      return '';
    }
    const orderedSelected = orderBy(selected, 'begin');
    const beginSlot = first(orderedSelected);
    const endSlot = last(orderedSelected);
    const beginText = this.getDateTimeText(beginSlot.begin, true);
    const endText = this.getDateTimeText(endSlot.end, false);
    const duration = moment.duration(moment(endSlot.end).diff(moment(beginSlot.begin)));
    const durationText = this.getDurationText(duration);
    return t('ReservationCalendar.selectedTime.infoText', {
      beginText, endText, durationText, price: reservationPrice
    });
  };

  getDurationText = (duration) => {
    const hours = duration.hours();
    const mins = duration.minutes();
    return `${hours > 0 ? `${hours}h ` : ''}${mins}min`;
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
  };

  handleReserveClick = () => {
    // todo
  };

  render() {
    const {
      date,
      resource,
      t,
      onDateChange,
      reservation
    } = this.props;

    const { selected } = this.state;

    return (
      <div className="reservation-calendar">
        <TimePickerCalendar
          date={date}
          defaultSelected={{ start: reservation.start, end: reservation.end }}
          onDateChange={onDateChange}
          onTimeChange={selectedTime => this.setState({ selected: selectedTime })}
          resource={resource}
        />
        {selected && (
          <Row className="reservation-calendar-reserve-info">
            <Col xs={8}>
              <strong>
                {t('TimeSlots.selectedDate')}
                {' '}
              </strong>
              {this.getSelectedTimeText(selected)}
            </Col>
            <Col xs={4}>
              <Button
                bsStyle="primary"
                className="reservation-calendar__reserve-button"
                onClick={this.handleReserveClick}
              >
                {t('TimeSlots.reserveButton')}
              </Button>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

export default injectT(ReservationCalendar);
