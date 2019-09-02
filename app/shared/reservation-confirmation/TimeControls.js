import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

import SelectControl from '../../pages/search/controls/SelectControl';

const moment = extendMoment(Moment);

function updateWithTime(initialValue, time, timeFormat) {
  const timeMoment = moment(time, timeFormat);
  return moment(initialValue)
    .set({
      hour: timeMoment.get('hour'),
      minute: timeMoment.get('minute'),
    })
    .toISOString();
}

class TimeControls extends Component {
  static propTypes = {
    begin: PropTypes.object.isRequired,
    end: PropTypes.object.isRequired,
    timeFormat: PropTypes.string,
  };

  static defaultProps = {
    timeFormat: 'HH:mm',
  };

  handleBeginTimeChange = ({ value }) => {
    const { begin, end, timeFormat } = this.props;
    if (value) {
      const updatedBeginTime = updateWithTime(begin.input.value, value, timeFormat);
      begin.input.onChange(updatedBeginTime);
      const newEndOptions = this.getEndTimeOptions(updatedBeginTime);
      const currentEndValue = moment(end.input.value).format(timeFormat);
      if (!newEndOptions.find(option => option.value === currentEndValue)) {
        end.input.onChange(updateWithTime(end.input.value, newEndOptions[0].value, timeFormat));
      }
    }
  };

  handleEndTimeChange = ({ value }) => {
    const { end, timeFormat } = this.props;
    if (value) {
      end.input.onChange(updateWithTime(end.input.value, value, timeFormat));
    }
  };

  render() {
    const { begin, end, timeFormat } = this.props;

    return (
      <div className="app-TimeControls">
        <div className="app-TimeControls__begin-time-control">
          <SelectControl
            isClearable={false}
            isSearchable
            name="app-TimeControls-begin-time-select"
            onChange={this.handleBeginTimeChange}
            placeholder=" "
            value={moment(begin.input.value).format(timeFormat)}
          />
        </div>
        <div className="app-TimeControls__separator">-</div>
        <div className="app-TimeControls__end-time-control">
          <SelectControl
            isClearable={false}
            isSearchable
            name="app-TimeControls-end-time-select"
            onChange={this.handleEndTimeChange}
            placeholder=" "
            value={moment(end.input.value).format(timeFormat)}
          />
        </div>
      </div>
    );
  }
}

export default TimeControls;
