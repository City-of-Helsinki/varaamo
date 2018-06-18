import React, { PropTypes } from 'react';
import Select from 'react-select';
import Toggle from 'react-toggle';
import moment from 'moment';

import { injectT } from 'i18n';
import constants from 'constants/AppConstants';

class TimeRangeControl extends React.Component {
  static propTypes = {
    duration: PropTypes.number,
    end: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onTimeRangeSwitch: PropTypes.func.isRequired,
    start: PropTypes.string,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleDuration = this.handleDuration.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }

  getEndTimeOptions() {
    const { start } = this.props;
    const startTime = moment(start, constants.FILTER.timeFormat)
      .add(constants.FILTER.timePeriod, constants.FILTER.timePeriodType);
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
    const duration = moment.duration(
      constants.FILTER.timePeriod,
      constants.FILTER.timePeriodType,
    );
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
    onChange({ duration, end, start });
  }

  handleStart(option) {
    const start = option.value;
    const { duration, end, onChange } = this.props;
    onChange({ duration, end, start });
  }

  handleToggleChange = (e) => {
    this.props.onTimeRangeSwitch(e.target.checked);
  }

  render() {
    const { duration, end, start, t } = this.props;
    const useTimeRange = Boolean(duration && end && start);

    return (
      <div className="app-TimeRangeControl">
        <Toggle
          checked={useTimeRange}
          className="app-TimeRangeControl-toggle"
          id="timerange-status"
          onChange={this.handleToggleChange}
        />
        <label className="app-TimeRangeControl__label" htmlFor="timerange-status">
          {t('TimeRangeControl.timeRangeTitle')}
        </label>
        {useTimeRange &&
          <div className="app-TimeRangeControl__range">
            <Select
              className="app-TimeRangeControl__range-start"
              clearable={false}
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
              name="time-filter-duration-select"
              onChange={this.handleDuration}
              options={this.getDurationOptions()}
              placeholder=""
              searchable={false}
              value={duration}
            />
          </div>
        }
      </div>
    );
  }
}

export default injectT(TimeRangeControl);
