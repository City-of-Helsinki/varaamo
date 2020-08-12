import moment from 'moment';
import { DateUtils } from 'react-day-picker';

import AppConstants from '../../../app/constants/AppConstants';

export const DatePickerValidationError = Object.freeze({
  RANGE_TOO_SHORT: 'range_too_short',
  RANGE_TOO_LONG: 'range_too_long',
  INVALID_STARTING_DAY: 'invalid_starting_day',
  OVERLAPPING_RESERVATION: 'overlapping_reservation',
  OUTSIDE_OPENING_PERIODS: 'outside_opening_periods',
});

const diffDays = (date, other) => {
  return moment(date).startOf('day').diff(moment(other).startOf('day'), 'days') + 1;
};

const isRangeTooLong = (range, maxDays) => {
  return diffDays(range.to, range.from) > maxDays;
};

const isRangeTooShort = (range, minDays) => {
  return diffDays(range.to, range.from) < minDays;
};

const isValidStartingDay = (range, startingDays) => {
  return startingDays.some(startingDay => moment(startingDay).isSame(range.from, 'day'));
};

const isOverlappingReservation = (range, reservations) => {
  return reservations.some(
    reservation => DateUtils.isDayInRange(range.from, reservation)
      || DateUtils.isDayInRange(range.to, reservation)
      || DateUtils.isDayInRange(reservation.from, range)
      || DateUtils.isDayInRange(reservation.to, range),
  );
};

const isWithinOpeningPeriods = (range, openingPeriods) => {
  // TODO: perhaps need to check for overlapping opening periods and merge them?
  return openingPeriods.some(
    openingPeriod => DateUtils.isDayInRange(range.from, openingPeriod)
      && DateUtils.isDayInRange(range.to, openingPeriod),
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
  if (isRangeTooLong(range, constraints.maxDays)) {
    validationErrors.push(DatePickerValidationError.RANGE_TOO_LONG);
  }
  if (isRangeTooShort(range, constraints.minDays)) {
    validationErrors.push(DatePickerValidationError.RANGE_TOO_SHORT);
  }
  if (!isWithinOpeningPeriods(range, constraints.openingPeriods)) {
    validationErrors.push(DatePickerValidationError.OUTSIDE_OPENING_PERIODS);
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

export const getDateRangeDuration = (startDate, endDate) => {
  return moment(endDate).diff(moment(startDate), 'days');
};
