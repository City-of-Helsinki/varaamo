import upperFirst from 'lodash/upperFirst';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { isMultiday } from '../../utils/reservationUtils';

class TimeRange extends Component {
  render() {
    const {
      begin, className, beginFormat, end, endFormat,
    } = this.props;

    const resolvedBeginFormat = beginFormat || 'dddd, LLL';
    const resolvedEndFormat = endFormat || (isMultiday(begin, end) ? 'dddd, LLL' : 'LT');
    const beginMoment = moment(begin);
    const endMoment = moment(end);
    const rangeString = `${beginMoment.format(
      resolvedBeginFormat,
    )} \u2013 ${endMoment.format(resolvedEndFormat)}`;
    const ISORangeString = `${begin}/${end}`;

    return (
      <time className={className} dateTime={ISORangeString}>
        {upperFirst(rangeString)}
      </time>
    );
  }
}

TimeRange.propTypes = {
  begin: PropTypes.string.isRequired,
  beginFormat: PropTypes.string,
  className: PropTypes.string,
  end: PropTypes.string.isRequired,
  endFormat: PropTypes.string,
};

export default TimeRange;
