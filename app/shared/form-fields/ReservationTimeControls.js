import Moment from 'moment';
import { extendMoment } from 'moment-range';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import map from 'lodash/map';

import constants from '../../constants/AppConstants';
import { DEFAULT_SLOT_SIZE } from '../../constants/SlotConstants';
import DatePicker from '../date-picker';
import SelectControl from '../../pages/search/controls/SelectControl';

const moment = extendMoment(Moment);

function updateWithDate(initialValue, date) {
  const dateMoment = moment(date);
  return moment(initialValue)
    .set({
      year: dateMoment.get('year'),
      month: dateMoment.get('month'),
      date: dateMoment.get('date'),
    })
    .toISOString();
}

function updateWithTime(initialValue, time, timeFormat) {
  const timeMoment = moment(time, timeFormat);
  return moment(initialValue)
    .set({
      hour: timeMoment.get('hour'),
      minute: timeMoment.get('minute'),
    })
    .toISOString();
}

class ReservationTimeControls extends Component {
  static propTypes = {
    begin: PropTypes.object.isRequired,
    end: PropTypes.object.isRequired,
    period: PropTypes.string,
    timeFormat: PropTypes.string,
  };

  static defaultProps = {
    period: DEFAULT_SLOT_SIZE,
    timeFormat: 'HH:mm',
  };

  constructor(props) {
    super(props);
    this.handleBeginTimeChange = this.handleBeginTimeChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  getTimeOptions() {
    const { period, timeFormat } = this.props;
    const start = moment().startOf('day');
    const end = moment().endOf('day');
    const range = moment.range(moment(start), moment(end));
    const duration = moment.duration(period);

    const options = map(
      Array.from(
        range.by(constants.FILTER.timePeriodType, {
          step: duration.as(constants.FILTER.timePeriodType),
        })
      ),
      beginMoment => ({
        label: beginMoment.format(timeFormat),
        value: beginMoment.format(timeFormat),
      })
    );

    return options;
  }

  handleBeginTimeChange({ value }) {
    const { begin, timeFormat } = this.props;
    if (value) {
      begin.input.onChange(updateWithTime(begin.input.value, value, timeFormat));
    }
  }

  handleEndTimeChange({ value }) {
    const { end, timeFormat } = this.props;
    if (value) {
      end.input.onChange(updateWithTime(end.input.value, value, timeFormat));
    }
  }

  handleDateChange(date) {
    const { begin, end } = this.props;
    begin.input.onChange(updateWithDate(begin.input.value, date));
    end.input.onChange(updateWithDate(end.input.value, date));
  }

  render() {
    const { begin, end, timeFormat } = this.props;

    return (
      <div className="reservation-time-controls">
        <div className="reservation-time-controls-date-control">
          <DatePicker onChange={this.handleDateChange} value={begin.input.value} />
        </div>
        <div className="reservation-time-controls-time-control">
          <SelectControl
            id="reservation-time-start-select"
            isClearable={false}
            isSearchable
            name="reservation-time-controls-begin-time-select"
            onChange={this.handleBeginTimeChange}
            options={this.getTimeOptions()}
            placeholder=" "
            value={moment(begin.input.value).format(timeFormat)}
          />
        </div>
        <div className="reservation-time-controls-separator">-</div>
        <div className="reservation-time-controls-time-control">
          <SelectControl
            id="reservation-time-end-select"
            isClearable={false}
            isSearchable
            name="reservation-time-controls-end-time-select"
            onChange={this.handleEndTimeChange}
            options={this.getTimeOptions()}
            placeholder=" "
            value={moment(end.input.value).format(timeFormat)}
          />
        </div>
      </div>
    );
  }
}

export default ReservationTimeControls;
