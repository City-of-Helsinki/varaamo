import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DayPicker, { DateUtils } from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';

import injectT from '../../../app/i18n/injectT';
import {
  findMatchingPeriod,
  validateRange,
  DatePickerValidationError,
  isRange,
  trimAvailabilityPeriods,
} from './utils';
import { createNotification } from '../notification/utils';
import { NOTIFICATION_TYPE } from '../notification/constants';

const DateRangePicker = ({
  fullDay,
  startingDays,
  openingPeriods,
  reservations,
  onRangeSelect,
  renderChildComponent,
  initialMonth = new Date(),
  onMonthChange,
  t,
  locale,
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    setSelectedDateRange({
      from: undefined,
      to: undefined,
    });
  }, [fullDay]);

  const handleDayClick = (day, modifiers = {}) => {
    // Day not available: don't permit selection.
    if (!modifiers.available) {
      return;
    }

    // Not a starting day and no starting day selected yet: make no selection.
    if (!modifiers.startingDay && !selectedDateRange.from) {
      return;
    }

    // Starting day selected, but attempting to select day before the starting day: don't update selection
    if (
      selectedDateRange.from
      && !selectedDateRange.to
      && day < selectedDateRange.from
    ) {
      return;
    }

    // Both starting day and ending day selected: reset selection to empty.
    if (selectedDateRange.from && selectedDateRange.to) {
      setSelectedDateRange({ from: undefined, to: undefined });
      return;
    }

    const range = DateUtils.addDayToRange(day, selectedDateRange);

    const period = findMatchingPeriod(range, openingPeriods);
    period
      && range.from
      && range.from.setHours(period.startingTime.hours, period.startingTime.min);
    period
      && range.to
      && range.to.setHours(period.endingTime.hours, period.endingTime.min);
    const minDuration = period ? period.minDuration : undefined;
    const maxDuration = period ? period.maxDuration : undefined;

    setSelectedDateRange(range);

    if (isRange(range)) {
      const validationErrors = validateRange(range, {
        startingDays,
        openingPeriods,
        reservations,
        fullDay,
      });

      if (validationErrors.length === 0) {
        onRangeSelect && onRangeSelect(range);
        return;
      }

      validationErrors.forEach((error) => {
        switch (error) {
          case DatePickerValidationError.RANGE_TOO_LONG:
            createNotification(
              NOTIFICATION_TYPE.WARNING,
              t('DateRangePicker.info.maxPeriodText', {
                duration: maxDuration,
                durationUnit: t(
                  `common.unit.time.${period.durationUnit}.plural`,
                ),
              }),
            );
            break;
          case DatePickerValidationError.RANGE_TOO_SHORT:
            createNotification(
              NOTIFICATION_TYPE.WARNING,
              t('DateRangePicker.info.minPeriodText', {
                duration: minDuration,
                durationUnit: t(
                  `common.unit.time.${period.durationUnit}.plural`,
                ),
              }),
            );
            break;
          case DatePickerValidationError.OVERLAPPING_RESERVATION:
            createNotification(
              NOTIFICATION_TYPE.WARNING,
              t('DateRangePicker.info.overlappingReservation'),
            );
            break;
          case DatePickerValidationError.INVALID_STARTING_DAY:
            createNotification(
              NOTIFICATION_TYPE.WARNING,
              t('DateRangePicker.info.invalidStartingDay'),
            );
            break;
          case DatePickerValidationError.OUTSIDE_OPENING_PERIODS:
            createNotification(
              NOTIFICATION_TYPE.WARNING,
              t('DateRangePicker.info.outsideOpeningPeriods'),
            );
            break;
          default:
            break;
        }
      });
    }
  };

  const modifiers = {
    available: trimAvailabilityPeriods(openingPeriods),
    reserved: reservations,
    startingDay: startingDays,
    reservationStart: !fullDay
      ? reservations.map(reservation => reservation.from)
      : undefined,
    reservationEnd: !fullDay
      ? reservations.map(reservation => reservation.to)
      : undefined,
    selectionStart: !fullDay ? selectedDateRange.from : undefined,
    selectionEnd: !fullDay ? selectedDateRange.to : undefined,
  };

  return (
    <div className="app-DateRangePicker">
      <DayPicker
        initialMonth={initialMonth}
        locale={locale}
        localeUtils={MomentLocaleUtils}
        modifiers={modifiers}
        numberOfMonths={2}
        onDayClick={handleDayClick}
        onMonthChange={date => onMonthChange && onMonthChange(date)}
        selectedDays={selectedDateRange}
        showWeekNumbers
      />
      {renderChildComponent && renderChildComponent(selectedDateRange)}
    </div>
  );
};

DateRangePicker.propTypes = {
  fullDay: PropTypes.bool,
  startingDays: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  openingPeriods: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.instanceOf(Date),
      to: PropTypes.instanceOf(Date),
      durationUnit: PropTypes.string.isRequired,
      minDuration: PropTypes.number.isRequired,
      maxDuration: PropTypes.number.isRequired,
      startingTime: PropTypes.shape({
        hours: PropTypes.number,
        min: PropTypes.number,
      }).isRequired,
      endingTime: PropTypes.shape({
        hours: PropTypes.number,
        min: PropTypes.number,
      }).isRequired,
    }),
  ).isRequired,
  reservations: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.instanceOf(Date),
      to: PropTypes.instanceOf(Date),
    }),
  ).isRequired,
  onRangeSelect: PropTypes.func,
  renderChildComponent: PropTypes.func,
  initialMonth: PropTypes.instanceOf(Date),
  onMonthChange: PropTypes.func,
  t: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

export default injectT(DateRangePicker);
