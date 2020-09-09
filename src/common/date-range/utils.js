import moment from 'moment';

import AppConstants from '../../../app/constants/AppConstants';

export const DatePickerValidationError = Object.freeze({
  RANGE_TOO_SHORT: 'range_too_short',
  RANGE_TOO_LONG: 'range_too_long',
  INVALID_STARTING_DAY: 'invalid_starting_day',
  OVERLAPPING_RESERVATION: 'overlapping_reservation',
  OUTSIDE_OPENING_PERIODS: 'outside_opening_periods',
});

export const getDuration = (endDate, startDate, durationUnit, fullDay) => {
  const momentStartDate = moment(startDate).startOf('day');
  const momentEndDate = fullDay ? moment(endDate).startOf('day').add(1, 'days') : moment(endDate).startOf('day');
  return momentEndDate.diff(momentStartDate, durationUnit);
};

const isDayInRange = (day, range) => {
  return moment(day).isBetween(range.from, range.to, undefined, '[]');
};

export const findMatchingPeriod = (range, periods) => {
  return range.from && periods.length > 0
    ? periods.find(period => isDayInRange(range.from, period))
    : undefined;
};

const isRangeTooLong = (range, openingPeriods, fullDay) => {
  const matchingPeriod = findMatchingPeriod(range, openingPeriods);
  if (!matchingPeriod) {
    // No matching period: range cannot be too long.
    return false;
  }
  return (
    getDuration(range.to, range.from, matchingPeriod.durationUnit, fullDay)
    > matchingPeriod.maxDuration
  );
};

const isRangeTooShort = (range, openingPeriods, fullDay) => {
  const matchingPeriod = findMatchingPeriod(range, openingPeriods);
  if (!matchingPeriod) {
    // No matching period: range cannot be too short.
    return false;
  }
  return (
    getDuration(range.to, range.from, matchingPeriod.durationUnit, fullDay)
    < matchingPeriod.minDuration
  );
};

const isValidStartingDay = (range, startingDays) => {
  return startingDays.some(startingDay => moment(startingDay).isSame(range.from, 'day'));
};

const isOverlappingReservation = (range, reservations) => {
  return reservations.some(
    reservation => isDayInRange(range.from, reservation)
      || isDayInRange(range.to, reservation)
      || isDayInRange(reservation.from, range)
      || isDayInRange(reservation.to, range),
  );
};

const isWithinOpeningPeriods = (range, openingPeriods) => {
  // TODO: perhaps need to check for overlapping opening periods and merge them?
  return openingPeriods.some(
    openingPeriod => isDayInRange(range.from, openingPeriod)
      && isDayInRange(range.to, openingPeriod),
  );
};

export const validateRange = (range, constraints) => {
  const validationErrors = [];
  if (isOverlappingReservation(range, constraints.reservations)) {
    validationErrors.push(DatePickerValidationError.OVERLAPPING_RESERVATION);
  }
  if (!isValidStartingDay(range, constraints.startingDays)) {
    validationErrors.push(DatePickerValidationError.INVALID_STARTING_DAY);
  }
  if (!isWithinOpeningPeriods(range, constraints.openingPeriods)) {
    validationErrors.push(DatePickerValidationError.OUTSIDE_OPENING_PERIODS);
  }
  if (isRangeTooLong(range, constraints.openingPeriods, constraints.fullDay)) {
    validationErrors.push(DatePickerValidationError.RANGE_TOO_LONG);
  }
  if (isRangeTooShort(range, constraints.openingPeriods, constraints.fullDay)) {
    validationErrors.push(DatePickerValidationError.RANGE_TOO_SHORT);
  }
  return validationErrors;
};

export const isRange = (range) => {
  return range.from && range.to;
};

export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '-';

  return `${moment(startDate).format(AppConstants.DATE_FORMAT)} - ${moment(
    endDate,
  ).format(AppConstants.DATE_FORMAT)}`;
};

export const formatTimeRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '-';

  return `${moment(startDate).format('HH:mm')} - ${moment(endDate).format(
    'HH:mm',
  )}`;
};

export const getDateRangeDuration = (startDate, endDate, fullDay) => {
  return getDuration(endDate, startDate, 'day', fullDay);
};

export const trimAvailabilityPeriods = (periods) => {
  return (
    periods
      // Remove periods that end before current date
      .filter(period => !moment(period.to).isBefore(moment()))
      // Move starting day of periods that are before current date to now
      .map((period) => {
        if (moment(period.from).isBefore(moment())) {
          return {
            ...period,
            from: new Date(),
          };
        }
        return period;
      })
  );
};
