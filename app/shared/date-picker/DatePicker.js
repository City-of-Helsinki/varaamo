import React, { PropTypes } from 'react';
import moment from 'moment';
import { DateField, DatePicker as RDPDatePicker } from 'react-date-picker';

const dateFormat = 'YYYY-MM-DD';
const localizedDateFormat = 'D.M.YYYY';


DatePicker.propTypes = {
  dateFormat: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

function DatePicker(props) {
  const pickerDateFormat = props.dateFormat || localizedDateFormat;
  function formatDate(date) {
    return moment(date, pickerDateFormat).format(dateFormat);
  }
  return (
    <DateField
      className="date-picker"
      clearIcon={false}
      collapseOnDateClick
      dateFormat={pickerDateFormat}
      footer={false}
      onChange={date => props.onChange(formatDate(date))}
      updateOnDateClick
      value={moment(props.value).format(pickerDateFormat)}
    >
      <RDPDatePicker
        highlightWeekends={false}
        weekNumbers={false}
      />
    </DateField>
  );
}

export default DatePicker;
