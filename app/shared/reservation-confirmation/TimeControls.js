import moment from 'moment';
import 'moment-range';
import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

function updateWithTime(initialValue, time, timeFormat) {
  const timeMoment = moment(time, timeFormat);
  return moment(initialValue).set({
    hour: timeMoment.get('hour'),
    minute: timeMoment.get('minute'),
  }).toISOString();
}

class TimeControls extends Component {
  static propTypes = {
    begin: PropTypes.object.isRequired,
    end: PropTypes.object.isRequired,
    period: PropTypes.string,
    timeFormat: PropTypes.string,
  };

  static defaultProps = {
    period: '00:30:00',
    timeFormat: 'HH:mm',
  };

  getTimeOptions() {
    const { period, timeFormat } = this.props;
    const start = moment().startOf('day');
    const end = moment().endOf('day');
    const range = moment.range(moment(start), moment(end));
    const duration = moment.duration(period);
    const options = [];
    range.by(duration, (beginMoment) => {
      options.push({
        label: beginMoment.format(timeFormat),
        value: beginMoment.format(timeFormat),
      });
    });
    return options;
  }

  handleBeginTimeChange = ({ value }) => {
    const { begin, timeFormat } = this.props;
    if (value) {
      begin.input.onChange(
        updateWithTime(begin.input.value, value, timeFormat)
      );
    }
  }

  handleEndTimeChange = ({ value }) => {
    const { end, timeFormat } = this.props;
    if (value) {
      end.input.onChange(
        updateWithTime(end.input.value, value, timeFormat)
      );
    }
  }

  render() {
    const { begin, end, timeFormat } = this.props;

    return (
      <div className="app-TimeControls">
        <div className="app-TimeControls__begin-time-control">
          <Select
            clearable={false}
            name="app-TimeControls-begin-time-select"
            onChange={this.handleBeginTimeChange}
            options={this.getTimeOptions()}
            placeholder=" "
            searchable
            value={moment(begin.input.value).format(timeFormat)}
          />
        </div>
        <div className="app-TimeControls__separator">-</div>
        <div className="app-TimeControls__end-time-control">
          <Select
            clearable={false}
            name="app-TimeControls-end-time-select"
            onChange={this.handleEndTimeChange}
            options={this.getTimeOptions()}
            placeholder=" "
            searchable
            value={moment(end.input.value).format(timeFormat)}
          />
        </div>
      </div>
    );
  }
}

export default TimeControls;
