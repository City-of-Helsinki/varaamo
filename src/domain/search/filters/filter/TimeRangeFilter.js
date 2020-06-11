import PropTypes from 'prop-types';
import React from 'react';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

import ToggleFilter from './ToggleFilter';
import SelectFilter from './SelectFilter';

const moment = extendMoment(Moment);

const getMomentFromTime = (time) => {
  const timeParts = time.split(':');

  return moment().hours(timeParts[0]).minutes(timeParts[1]);
};

class TimeRangeFilter extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...this.splitValueString(props.value),
    };
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if (value !== prevProps.value) {
      // eslint-disable-next-line
      this.setState({
        ...this.splitValueString(value),
      });
    }
  }

  splitValueString = (value) => {
    const [startTime, endTime, duration] = value.split(',');

    return {
      startTime: startTime || this.getDefaultValue('startTime'),
      endTime: endTime || this.getDefaultValue('endTime'),
      duration: duration ? Number(duration) : this.getDefaultValue('duration'),
    };
  };

  getDefaultValue = (fieldName) => {
    switch (fieldName) {
      case 'startTime':
        const start = moment();

        if (start.minutes() < 30) {
          start.minutes(30);
        } else {
          start.add(1, 'hours');
          start.minutes(0);
        }

        return start.format('HH:mm');
      case 'endTime':
        return moment().hours(23).minutes(30).format('HH:mm');
      case 'duration':
        return 30;
      default:
        return '';
    }
  };

  getValueString = () => {
    const { startTime, endTime, duration } = this.state;

    return `${startTime},${endTime},${duration}`;
  };

  /**
   * List duration between start time and end time with 30min steps
   * @returns {*}
   */
  getDurationOptions = () => {
    const { startTime, endTime } = this.state;

    const start = getMomentFromTime(startTime);
    const end = getMomentFromTime(endTime);
    const minutes = Math.min(end.diff(start, 'minutes'), 12 * 60);

    const options = [];
    for (let i = 30; i <= minutes; i += 30) {
      options.push({
        value: i,
        label: `${i / 60} h`,
      });
    }

    return options;
  };

  /**
   * List times between 00:00 - 23:00 with 30min steps.
   * @returns {Array}
   */
  getStartTimeOptions = () => {
    const today = moment().format('Y-MM-DD');
    const range = moment.range(`${today} 00:00`, `${today} 23:00`);

    return Array.from(range.by('minutes', { step: 30 })).map((value) => {
      const time = value.format('HH:mm');
      return {
        label: time,
        value: time,
      };
    });
  };

  /**
   * List times between now() - 23:00 with 30min steps.
   * @returns {Array}
   */
  getEndTimeOptions = () => {
    const { startTime } = this.state;
    const start = getMomentFromTime(startTime).add(30, 'minutes');
    const today = moment().format('Y-MM-DD');
    const range = moment.range(
      `${today} ${start.format('HH:mm')}`,
      `${today} 23:30`
    );

    return Array.from(range.by('minutes', { step: 30 })).map((value) => {
      const time = value.format('HH:mm');
      return {
        label: time,
        value: time,
      };
    });
  };

  onChange = (fieldName, fieldValue) => {
    const { onChange } = this.props;

    switch (fieldName) {
      case 'checked':
        if (fieldValue) {
          onChange(this.getValueString());
        } else {
          onChange('');
        }
        break;
      case 'startTime':
        this.updateStartTime(fieldValue);
        break;
      case 'endTime':
        this.updateEndTime(fieldValue);
        break;
      case 'duration':
        this.setState(
          {
            duration: fieldValue,
          },
          () => onChange(this.getValueString())
        );
        break;
      default:
        break;
    }
  };

  /**
   * Updates start time in state.
   * @param value
   */
  updateStartTime = (value) => {
    const { onChange } = this.props;
    const { endTime, duration } = this.state;

    const start = getMomentFromTime(value);
    const end = getMomentFromTime(endTime);

    // End time can't be earlier than 30 min after start time.
    const updatedEndTime =
      end.diff(start, 'minutes') < 30
        ? start.add(30, 'minutes').format('HH:mm')
        : endTime;

    // Duration can't be more than the difference of the start time and end time.
    const updatedDuration = Math.min(
      getMomentFromTime(updatedEndTime).diff(start, 'minutes'),
      duration
    );

    this.setState(
      {
        startTime: value,
        endTime: updatedEndTime,
        duration: updatedDuration,
      },
      () => onChange(this.getValueString())
    );
  };

  /**
   * Updates the end time in state.
   * @param value
   */
  updateEndTime = (value) => {
    const { onChange } = this.props;
    const { startTime, duration } = this.state;

    const start = getMomentFromTime(startTime);
    const end = getMomentFromTime(value);

    // Duration can't be more than the difference of the start time and end time.
    const updatedDuration = Math.min(end.diff(start, 'minutes'), duration);

    this.setState(
      {
        endTime: value,
        duration: updatedDuration,
      },
      () => onChange(this.getValueString())
    );
  };

  render() {
    const { label, value } = this.props;

    const { startTime, endTime, duration } = this.state;

    const isChecked = !!value;

    return (
      <div className="app-TimeRangeFilter">
        <ToggleFilter
          checked={isChecked}
          id="timeRange-status"
          label={label}
          onChange={(checked) => this.onChange('checked', checked)}
        />
        <div className="app-TimeRangeFilter__range">
          <SelectFilter
            className="app-TimeRangeFilter__range-start"
            disabled={!isChecked}
            id="time-filter-start-select"
            isClearable={false}
            isSearchable={false}
            onChange={(item) => this.onChange('startTime', item.value)}
            options={this.getStartTimeOptions()}
            value={startTime}
          />
          <div className="app-TimeRangeFilter__range-separator">-</div>
          <SelectFilter
            className="app-TimeRangeFilter__range-end"
            disabled={!isChecked}
            id="time-filter-end-select"
            isClearable={false}
            isSearchable={false}
            onChange={(item) => this.onChange('endTime', item.value)}
            options={this.getEndTimeOptions()}
            searchable={false}
            value={endTime}
          />
          <SelectFilter
            className="app-TimeRangeFilter__range-duration"
            disabled={!isChecked}
            id="time-filter-duration-select"
            isClearable={false}
            isSearchable={false}
            onChange={(item) => this.onChange('duration', item.value)}
            options={this.getDurationOptions()}
            value={duration}
          />
        </div>
      </div>
    );
  }
}

export default TimeRangeFilter;
