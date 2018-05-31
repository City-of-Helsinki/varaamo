import React, { PropTypes } from 'react';
import Select from 'react-select';
import moment from 'moment';

import { injectT } from 'i18n';
import constants from 'constants/AppConstants';

class TimeRangeControl extends React.Component {
  static propTypes = {
    duration: PropTypes.number,
    end: PropTypes.string,
    onChange: PropTypes.func.isRequired,
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
    const endOfDay = moment().add(1, 'day').startOf('day');
    return this.getTimeOptions(startTime, endOfDay);
  }

  getDurationOptions() {
    const start = moment(0, 'hours');
    const end = moment(12, 'hours');
    const durationStart = moment(constants.FILTER.timePeriod, constants.FILTER.timePeriodType);
    const range = moment.range(durationStart, end);
    const duration = moment.duration(
      constants.FILTER.timePeriod,
      constants.FILTER.timePeriodType,
    );
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
    const endOfDay = moment().endOf('day');
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

  render() {
    const { duration, end, start, t } = this.props;

    return (
      <div className="app-TimeRangeControl">
        <div className="app-TimeRangeControl__header">
          {t('DatePickerControl.timeRangeTitle')}
        </div>
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
      </div>
    );
  }
}

export default injectT(TimeRangeControl);
