import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';

import DatePicker from 'shared/date-picker';

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
    const timeMoment = moment(event.target.value, timeFormat);
    const beginValue = moment(begin.input.value).set({
      hour: timeMoment.get('hour'),
      minute: timeMoment.get('minute'),
    }).toISOString();
    begin.input.onChange(beginValue);
  }

  handleEndTimeChange(event) {
    const { end, timeFormat } = this.props;
    const timeMoment = moment(event.target.value, timeFormat);
    const endValue = moment(end.input.value).set({
      hour: timeMoment.get('hour'),
      minute: timeMoment.get('minute'),
    }).toISOString();
    end.input.onChange(endValue);
  }

  handleDateChange(date) {
    const { begin, end } = this.props;
    const dateMoment = moment(date);
    const beginValue = moment(begin.input.value).set({
      year: dateMoment.get('year'),
      month: dateMoment.get('month'),
      date: dateMoment.get('date'),
    }).toISOString();
    const endValue = moment(end.input.value).set({
      year: dateMoment.get('year'),
      month: dateMoment.get('month'),
      date: dateMoment.get('date'),
    }).toISOString();
    begin.input.onChange(beginValue);
    end.input.onChange(endValue);
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
