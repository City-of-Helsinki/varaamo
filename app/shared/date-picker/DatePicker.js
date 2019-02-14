import moment from 'moment';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { DateField, DatePicker as RDPDatePicker } from 'react-date-picker';

const dateFormat = 'YYYY-MM-DD';
const localizedDateFormat = 'D.M.YYYY';

DatePicker.propTypes = {
  dateFormat: PropTypes.string,
  formControl: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  positionRight: PropTypes.bool,
  value: PropTypes.string.isRequired
};

function DatePicker(props) {
  const pickerDateFormat = props.dateFormat || localizedDateFormat;
  function formatDate(date) {
    return moment(date, pickerDateFormat).format(dateFormat);
  }
  return (
    <DateField
      className={classnames('date-picker', {
        'date-picker--position-right': props.positionRight,
        'form-control': props.formControl
      })}
      clearIcon={false}
      collapseOnDateClick
      dateFormat={pickerDateFormat}
      footer={false}
      onChange={date => props.onChange(formatDate(date))}
      readOnly
      updateOnDateClick
      value={moment(props.value).format(pickerDateFormat)}
    >
      <RDPDatePicker highlightWeekends={false} weekNumbers={false} />
    </DateField>
  );
}

export default DatePicker;
