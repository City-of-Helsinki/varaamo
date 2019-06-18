import PropTypes from 'prop-types';
import React from 'react';
import map from 'lodash/map';
import Moment from 'moment';
import classNames from 'classnames';
import { extendMoment } from 'moment-range';

import constants from '../../../../../app/constants/AppConstants';
import { calculateDuration, calculateEndTime } from '../../../../../app/utils/timeUtils';
import ToggleFilter from './ToggleFilter';
import SelectFilter from './SelectFilter';

const moment = extendMoment(Moment);

class TimeRangeFilter extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  };

  /**
   * List duration between start time and end time with 30min steps
   * @returns {*}
   */
  getDurationOptions = () => {
    const totalMinutes = 12 * 60;
    return [];
  };

  /**
   * List times between 00:00 - 23:00 with 30min steps.
   * @returns {Array}
   */
  getStartTimeOptions = () => {
    const today = moment().format('Y-MM-DD');
    const range = moment.range(`${today} 00:00`, `${today} 23:00`);

    return Array.from(range.by('minutes', { step: 30 }))
      .map((value) => {
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
    /*
    const { start } = this.props;
    const startTime = moment(start, 'HH:mm').add(30, 'minutes');
    const today = moment().format('Y-MM-DD');
    const range = moment.range(`${today} ${startTime.format('HH:mm')}`, `${today} 23:30`);

    return Array.from(range.by('minutes', { step: 30 }))
      .map((value) => {
        const time = value.format('HH:mm');
        return {
          label: time,
          value: time,
        };
      });
      */

    return [];
  };

  getTimeOptions = (start, end) => {
    /*
    const range = moment.range(start, end);
    const options = map(
      Array.from(range.by(constants.FILTER.timePeriodType, { step: constants.FILTER.timePeriod })),
      (time) => {
        const value = time.format(constants.FILTER.timeFormat);

        return {
          label: value,
          value,
        };
      }
    );

    return options;
     */

    return [];
  };

  onChange = (fieldName, fieldValue) => {
    const { date, onChange } = this.props;

    switch (fieldName) {
      case 'checked':
        if (fieldValue) {
          const startDate = moment();
          console.warn(startDate.toDate());
          if (startDate.minutes() >= 30) {
            startDate
              .add(1, 'hour')
              .minutes(0);
          } else {
            startDate.minutes(30);
          }

          onChange(`${startDate.format('HH:mm')},23:30`);
        } else {
          onChange('');
        }
        break;
      case 'startTime':
        break;
      case 'endTime':
        break;
      case 'duration':
        break;
      default:
        break;
    }
  };

  getValue = (fieldName) => {
    const { value } = this.props;

    switch (fieldName) {
      case 'checked':
        return Boolean(value);
      case 'startTime':
        return '';
      case 'endTime':
        return '';
      case 'duration':
        return '';
      default:
        return null;
    }
  };

  render() {
    const {
      label,
    } = this.props;

    return (
      <div
        className={classNames('app-TimeRangeFilter', {
          'app-TimeRangeFilter--checked': this.getValue('checked'),
        })}
      >
        <ToggleFilter
          checked={this.getValue('checked')}
          id="timeRange-status"
          label={label}
          onChange={checked => this.onChange('checked', checked)}
        />
        <div className="app-TimeRangeFilter__range">
          <SelectFilter
            className="app-TimeRangeFilter__range-start"
            id="time-filter-start-select"
            isClearable={false}
            isSearchable={false}
            onChange={item => this.onChange('startTime', item.value)}
            options={this.getStartTimeOptions()}
            value={this.getValue('startTime')}
          />
          <div className="app-TimeRangeFilter__range-separator">-</div>
          <SelectFilter
            className="app-TimeRangeFilter__range-end"
            id="time-filter-end-select"
            isClearable={false}
            isSearchable={false}
            onChange={item => this.onChange('endTime', item.value)}
            options={this.getEndTimeOptions()}
            searchable={false}
            value={this.getValue('endTime')}
          />
          <SelectFilter
            className="app-TimeRangeFilter__range-duration"
            id="time-filter-duration-select"
            isClearable={false}
            isSearchable={false}
            onChange={item => this.onChange('duration', item.value)}
            options={this.getDurationOptions()}
            value={this.getValue('duration')}
          />
        </div>
      </div>
    );
  }
}

export default TimeRangeFilter;
