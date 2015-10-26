import _ from 'lodash';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';

class TimeRange extends Component {
  render() {
    const { begin, end } = this.props;
    const beginMoment = moment(begin);
    const endMoment = moment(end);
    const timeString = `${beginMoment.format('LLLL')} \u2013 ${endMoment.format('H:mm')}`;
    const ISORangeString = `${begin}/${end}`;

    return (
      <time dateTime={ISORangeString}>
        {_.capitalize(timeString)}
      </time>
    );
  }
}

TimeRange.propTypes = {
  begin: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
};

export default TimeRange;
