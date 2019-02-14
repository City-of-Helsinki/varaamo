import constants from 'constants/AppConstants';

import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';
import moment from 'moment';

import { injectT } from 'i18n';
import { calculateDuration, calculateEndTime } from 'utils/timeUtils';
import CheckboxControl from './CheckboxControl';

class TimeRangeControl extends React.Component {
  static propTypes = {
    duration: PropTypes.number,
    end: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onTimeRangeSwitch: PropTypes.func.isRequired,
    start: PropTypes.string,
    t: PropTypes.func.isRequired,
    useTimeRange: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleDuration = this.handleDuration.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }

  getEndTimeOptions() {
    const { start } = this.props;
    const startTime = moment(start, constants.FILTER.timeFormat).add(
      constants.FILTER.timePeriod,
      constants.FILTER.timePeriodType,
    );
    const endOfDay = moment('23:30', constants.FILTER.timeFormat);
    return this.getTimeOptions(startTime, endOfDay);
  }

  getEndTime() {
    const { end, start } = this.props;
    const startTime = moment(start, constants.FILTER.timeFormat);
    const endTime = moment(end, constants.FILTER.timeFormat);
    const diffMinutes = endTime.diff(startTime, 'minutes');
    const minutes = Math.min(diffMinutes, 720);
    return {
      hours: Math.floor(minutes / 60),
      minutes: minutes % 60,
    };
  }

  getDurationOptions() {
    const { timePeriod, timePeriodType } = constants.FILTER;
    const endTime = this.getEndTime();
    const start = moment(0, 'hours');
    const end = moment(endTime);
    const durationStart = moment(timePeriod, timePeriodType);
    const range = moment.range(durationStart, end);
    const duration = moment.duration(timePeriod, timePeriodType);
    const options = [];
    range.by(duration, (time) => {
      const hours = time.diff(start, 'hours', true);
      const minutes = time.diff(start, 'minutes', true);
      options.push({
        label: `${hours} h`,
        value: minutes,
      });
    });
    return options;
  }

  getStartTimeOptions() {
    const startOfDay = moment().startOf('day');
    const endOfDay = moment('23:00', constants.FILTER.timeFormat);
    return this.getTimeOptions(startOfDay, endOfDay);
  }

  getTimeOptions(start, end) {
    const range = moment.range(start, end);
    const duration = moment.duration(constants.FILTER.timePeriod, constants.FILTER.timePeriodType);
    const options = [];
    range.by(duration, (time) => {
      const value = time.format(constants.FILTER.timeFormat);
      options.push({
        label: value,
        value,
      });
    });
    return options;
  }

  handleDuration(option) {
    const duration = option.value;
    const { end, onChange, start } = this.props;
    onChange({ duration, end, start });
  }

  handleEnd(option) {
    const end = option.value;
    const { duration, onChange, start } = this.props;
    const durationValue = calculateDuration(duration, start, end);
    onChange({ duration: durationValue, end, start });
  }

  handleStart(option) {
    const start = option.value;
    const { duration, end, onChange } = this.props;
    const endValue = calculateEndTime(end, start);
    const durationValue = calculateDuration(duration, start, endValue);
    onChange({ duration: durationValue, end: endValue, start });
  }

  handleToggleChange = (value) => {
    this.props.onTimeRangeSwitch(value);
  };

  render() {
    const {
      duration, end, start, t, useTimeRange,
    } = this.props;

    return (
      <div className="app-TimeRangeControl">
        <CheckboxControl
          id="timerange-status"
          label={t('TimeRangeControl.timeRangeTitle')}
          labelClassName="app-SearchControlsCheckbox__label"
          onConfirm={this.handleToggleChange}
          toggleClassName="app-SearchControlsCheckbox__toggle"
          value={useTimeRange}
        />
        <div className="app-TimeRangeControl__range">
          <Select
            className="app-TimeRangeControl__range-start"
            clearable={false}
            disabled={!useTimeRange}
            name="time-filter-start-select"
            onChange={this.handleStart}
            options={this.getStartTimeOptions()}
            placeholder=""
            searchable={false}
            value={start}
          />
          <div className="app-TimeRangeControl__range-separator">-</div>
          <Select
            className="app-TimeRangeControl__range-end"
            clearable={false}
            disabled={!useTimeRange}
            name="time-filter-end-select"
            onChange={this.handleEnd}
            options={this.getEndTimeOptions()}
            placeholder=""
            searchable={false}
            value={end}
          />
          <Select
            className="app-TimeRangeControl__range-duration"
            clearable={false}
            disabled={!useTimeRange}
            name="time-filter-duration-select"
            onChange={this.handleDuration}
            options={this.getDurationOptions()}
            placeholder=""
            searchable={false}
            value={duration}
          />
        </div>
      </div>
    );
  }
}

export default injectT(TimeRangeControl);
