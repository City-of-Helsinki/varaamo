import moment from 'moment';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';

import { injectT } from 'i18n';
import resourceCalendarSelector from './resourceCalendarSelector';

UnconnectedResourceCalendar.propTypes = {
  availability: PropTypes.object.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  selectedDate: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export function UnconnectedResourceCalendar({
  availability,
  currentLanguage,
  onDateChange,
  selectedDate,
  t,
}) {
  return (
    <div className="calendar-availability">
      <DayPicker
        disabledDays={{ before: moment().subtract(1, 'days').toDate() }}
        enableOutsideDays
        initialMonth={new Date(selectedDate)}
        locale={currentLanguage}
        localeUtils={MomentLocaleUtils}
        modifiers={{
          available: (day) => {
            const dayDate = day.toISOString().substring(0, 10);
            return availability[dayDate] && availability[dayDate].percentage >= 80;
          },
          busy: (day) => {
            const dayDate = day.toISOString().substring(0, 10);
            return (
              availability[dayDate] &&
              availability[dayDate].percentage < 80 &&
              availability[dayDate].percentage > 0
            );
          },
          booked: (day) => {
            const dayDate = day.toISOString().substring(0, 10);
            return availability[dayDate] && availability[dayDate].percentage === 0;
          },
        }}
        onDayClick={onDateChange}
        selectedDays={new Date(selectedDate)}
      />
      <div className="calendar-legend">
        <span className="free">{t('ReservationCalendarPickerLegend.free')}</span>
        <span className="busy">{t('ReservationCalendarPickerLegend.busy')}</span>
        <span className="booked">{t('ReservationCalendarPickerLegend.booked')}</span>
      </div>
    </div>
  );
}

UnconnectedResourceCalendar = injectT(UnconnectedResourceCalendar) // eslint-disable-line

export default connect(resourceCalendarSelector)(UnconnectedResourceCalendar);
