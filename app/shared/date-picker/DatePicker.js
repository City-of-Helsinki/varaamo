import React from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import AppConstants from '../../constants/AppConstants';
import { currentLanguageSelector } from '../../state/selectors/translationSelectors';

const defaultDateFormat = 'YYYY-MM-DD';
const localizedDateFormat = 'D.M.YYYY';

export function UnconnectedDatePicker({
  dateFormat, onChange, currentLocale, value, rest
}) {
  const pickerDateFormat = dateFormat || localizedDateFormat;

  return (
    <DayPickerInput
      classNames={{
        container: 'date-picker',
        overlay: 'date-picker-overlay',
      }}
      dayPickerProps={{
        showOutsideDays: true,
        localeUtils: MomentLocaleUtils,
        locale: currentLocale
      }}
      format={pickerDateFormat}
      formatDate={formatDate}
      keepFocus={false}
      onDayChange={date => onChange(formatDate(date, defaultDateFormat))}
      parseDate={parseDate}
      value={new Date(value)}
      {...rest}
    />
  );
}

UnconnectedDatePicker.propTypes = {
  dateFormat: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  currentLocale: PropTypes.string,
  rest: PropTypes.object
};

UnconnectedDatePicker.defaultProps = {
  currentLocale: AppConstants.DEFAULT_LOCALE
};

const languageSelector = createStructuredSelector({
  currentLocale: currentLanguageSelector
});

export default connect(languageSelector)(UnconnectedDatePicker);
