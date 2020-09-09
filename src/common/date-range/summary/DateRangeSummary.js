import React from 'react';
import PropTypes from 'prop-types';

import iconCalendar from '../../../../app/assets/icons/calendar.svg';
import iconClock from '../../../../app/assets/icons/clock-o.svg';
import {
  formatDateRange,
  formatTimeRange,
  getDateRangeDuration,
} from '../utils';
import injectT from '../../../../app/i18n/injectT';

const DateRangeSummary = ({
  startDate, endDate, fullDay, t,
}) => {
  return (
    <div className="app-DateRangeSummary">
      <b>{t('DateRangeSummary.title')}</b>
      <div className="app-DateRangeSummary__summaryDetails">
        <div>
          <img
            alt="dateRangeSummaryCalendarIcon"
            className="app-DateRangeSummary__icon"
            src={iconCalendar}
          />
          <span>{formatDateRange(startDate, endDate)}</span>
        </div>
        <div>
          <img
            alt="dateRangeSummaryClockIcon"
            className="app-DateRangeSummary__icon"
            src={iconClock}
          />
          <span>{formatTimeRange(startDate, endDate)}</span>
        </div>
        <div>
          {/* TODO: get the correct svg for this icon */}
          <img
            alt="dateRangeSummaryClockIcon"
            className="app-DateRangeSummary__icon"
            src={iconClock}
          />
          <span>
            {startDate && endDate
              ? t('DateRangeSummary.days', {
                days: getDateRangeDuration(startDate, endDate, fullDay),
              })
              : '-'}
          </span>
        </div>
      </div>
    </div>
  );
};

DateRangeSummary.propTypes = {
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  fullDay: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

export default injectT(DateRangeSummary);
