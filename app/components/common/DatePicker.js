import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import DateTimeField from 'react-bootstrap-datetimepicker';

import { DATE_FORMAT } from 'constants/AppConstants';

export class DatePicker extends Component {
  render() {
    const date = this.props.date || moment().format(DATE_FORMAT);

    return (
      <DateTimeField
        dateTime={date}
        format={DATE_FORMAT}
        inputFormat="DD.MM.YYYY"
        mode="date"
        onChange={this.props.onChange}
        viewMode="days"
      />
    );
  }
}

DatePicker.propTypes = {
  date: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DatePicker;
