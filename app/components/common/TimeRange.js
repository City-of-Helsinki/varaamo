import _ from 'lodash';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';

class TimeRange extends Component {
  render() {
    const {
      begin,
      dateFormat,
      end,
      lineBreaks,
      timeFormat,
    } = this.props;
    const beginMoment = moment(begin);
    const endMoment = moment(end);
    const dateString = beginMoment.format(dateFormat);
    const timeString = `klo ${beginMoment.format(timeFormat)} \u2013 ${endMoment.format(timeFormat)}`;
    const ISORangeString = `${begin}/${end}`;

    return (
      <time dateTime={ISORangeString}>
        {lineBreaks ? (
          <div>
            <div>{_.capitalize(dateString)}</div>
            <div>{timeString}</div>
          </div>
        ) : (
          `${_.capitalize(dateString)} ${timeString}`
        )}
      </time>
    );
  }
}

TimeRange.propTypes = {
  begin: PropTypes.string.isRequired,
  dateFormat: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  lineBreaks: PropTypes.bool.isRequired,
  timeFormat: PropTypes.string.isRequired,
};

TimeRange.defaultProps = {
  dateFormat: 'dddd, Do MMMM[ta]',
  lineBreaks: false,
  timeFormat: 'H:mm',
};

export default TimeRange;
