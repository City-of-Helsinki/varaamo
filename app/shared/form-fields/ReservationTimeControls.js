import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';

import DatePicker from 'shared/date-picker';

function updateWithDate(initialValue, date) {
  const dateMoment = moment(date);
  return moment(initialValue).set({
    year: dateMoment.get('year'),
    month: dateMoment.get('month'),
    date: dateMoment.get('date'),
  }).toISOString();
}

function updateWithTime(initialValue, time, timeFormat) {
  const timeMoment = moment(time, timeFormat);
  return moment(initialValue).set({
    hour: timeMoment.get('hour'),
    minute: timeMoment.get('minute'),
  }).toISOString();
}

class ReservationTimeControls extends Component {
  static propTypes = {
    begin: PropTypes.object.isRequired,
    end: PropTypes.object.isRequired,
    timeFormat: PropTypes.string,
    timeStep: PropTypes.number,
  };

  static defaultProps = {
    timeFormat: 'HH:mm',
    timeStep: 30 * 60,  // 30 minutes
  };

  constructor(props) {
    super(props);
    this.handleBeginTimeChange = this.handleBeginTimeChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleBeginTimeChange(event) {
    const { begin, timeFormat } = this.props;
    const time = event.target.value;
    if (time) {
      begin.input.onChange(
        updateWithTime(begin.input.value, time, timeFormat)
      );
    }
  }

  handleEndTimeChange(event) {
    const { end, timeFormat } = this.props;
    const time = event.target.value;
    if (time) {
      end.input.onChange(
        updateWithTime(end.input.value, time, timeFormat)
      );
    }
  }

  handleDateChange(date) {
    const { begin, end } = this.props;
    begin.input.onChange(updateWithDate(begin.input.value, date));
    end.input.onChange(updateWithDate(end.input.value, date));
  }

  render() {
    const { begin, end, timeFormat, timeStep } = this.props;

    return (
      <div className="reservation-time-controls">
        <div className="reservation-time-controls-date-control">
          <DatePicker
            onChange={this.handleDateChange}
            value={begin.input.value}
          />
        </div>
        <div className="reservation-time-controls-time-control">
          <FormControl
            onChange={this.handleBeginTimeChange}
            required
            step={timeStep}
            type="time"
            value={moment(begin.input.value).format(timeFormat)}
          />
        </div>
        <div className="reservation-time-controls-separator">
          -
        </div>
        <div className="reservation-time-controls-time-control">
          <FormControl
            onChange={this.handleEndTimeChange}
            required
            step={timeStep}
            type="time"
            value={moment(end.input.value).format(timeFormat)}
          />
        </div>
      </div>
    );
  }
}

export default ReservationTimeControls;
