import forEach from 'lodash/forEach';
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
    maxReservationPeriod: PropTypes.string,
    timeFormat: PropTypes.string,
    timeSlots: PropTypes.array,
  };

  static defaultProps = {
    timeFormat: 'HH:mm',
  };

  getBeginTimeOptions() {
    const { timeFormat, timeSlots } = this.props;
    const options = [];
    const now = moment();
    timeSlots.forEach((slot) => {
      if (now.isBefore(slot.end) && (!slot.reserved || slot.editing)) {
        options.push({
          label: moment(slot.start).format(timeFormat),
          value: moment(slot.start).format(timeFormat),
        });
      }
    });
    return options;
  }

  getEndTimeOptions(beginValue) {
    const { begin, maxReservationPeriod, timeFormat, timeSlots } = this.props;
    const beginTime = beginValue || begin.input.value;
    const firstPossibleIndex = timeSlots.findIndex(slot => (
      moment(slot.end).isAfter(beginTime)
    ));
    const maxHours = maxReservationPeriod ? moment.duration(maxReservationPeriod).asHours() : null;
    const options = [];
    forEach(timeSlots.slice(firstPossibleIndex), (slot) => {  // eslint-disable-line
      const hours = moment.duration(moment(slot.end).diff(beginTime)).asHours();
      const withinMaxHours = !maxHours || hours <= maxHours;
      if (withinMaxHours && (!slot.reserved || slot.editing)) {
        const time = moment(slot.end).format(timeFormat);
        options.push({
          label: `${time} (${hours} h)`,
          value: time,
        });
      } else {
        return false;  // Exits the lodash forEach
      }
    });
    return options;
  }

  handleBeginTimeChange = ({ value }) => {
    const { begin, end, timeFormat } = this.props;
    if (value) {
      const updatedBeginTime = updateWithTime(begin.input.value, value, timeFormat);
      begin.input.onChange(updatedBeginTime);
      const newEndOptions = this.getEndTimeOptions(updatedBeginTime);
      const currentEndValue = moment(end.input.value).format(timeFormat);
      if (!newEndOptions.find(option => option.value === currentEndValue)) {
        end.input.onChange(
          updateWithTime(end.input.value, newEndOptions[0].value, timeFormat)
        );
      }
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
            options={this.getBeginTimeOptions()}
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
            options={this.getEndTimeOptions()}
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
