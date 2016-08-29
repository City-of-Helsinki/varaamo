import capitalize from 'lodash/capitalize';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';

class TimeRange extends Component {
  render() {
    const {
      begin,
      className,
      dateFormat,
      end,
      lineBreaks,
      timeFormat,
    } = this.props;
    const beginMoment = moment(begin);
    const endMoment = moment(end);
    const dateString = beginMoment.format(dateFormat);
    const timeString = (
      `klo ${beginMoment.format(timeFormat)} \u2013 ${endMoment.format(timeFormat)}`
    );
    const ISORangeString = `${begin}/${end}`;

    return (
      <time className={className} dateTime={ISORangeString}>
        {lineBreaks ? (
          <div>
            <div>{capitalize(dateString)}</div>
            <div>{timeString}</div>
          </div>
        ) : (
          `${capitalize(dateString)} ${timeString}`
        )}
      </time>
    );
  }
}

TimeRange.propTypes = {
  begin: PropTypes.string.isRequired,
  className: PropTypes.string,
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
