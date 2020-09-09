import moment from 'moment';

import {
  validateRange,
  DatePickerValidationError,
  getDateRangeDuration,
  trimAvailabilityPeriods, getDuration,
} from '../utils';

describe('DateRangePicker utils', () => {
  describe('validateRange', () => {
    const constraints = {
      startingDays: [new Date(2020, 1, 1)],
      reservations: [
        { from: new Date(2020, 8, 10), to: new Date(2020, 8, 11) },
      ],
      openingPeriods: [{ from: new Date(2000, 0), to: new Date(2100, 0, 20), durationUnit: 'day' }],
      fullDay: true,
      minDays: 5,
      maxDays: 50,
    };

    it('returns empty array for valid values', () => {
      const validRange = {
        from: new Date(2020, 1, 1),
        to: new Date(2020, 1, 10),
      };
      const validationStatus = validateRange(validRange, constraints);
      expect(validationStatus).toEqual([]);
    });

    it('returns RANGE_TOO_SHORT for a range with # of days < minDays', () => {
      const shortRange = {
        from: new Date(2020, 1, 2),
        to: new Date(2020, 1, 3),
      };
      const validationStatus = validateRange(shortRange, constraints);
      expect(validationStatus).toContain(
        DatePickerValidationError.RANGE_TOO_SHORT,
      );
    });

    it('returns RANGE_TOO_LONG for a range with # of days > maxDays', () => {
      const longRange = {
        from: new Date(2020, 1, 2),
        to: new Date(2020, 5, 2),
      };
      const validationStatus = validateRange(longRange, constraints);
      expect(validationStatus).toContain(
        DatePickerValidationError.RANGE_TOO_LONG,
      );
    });

    it('returns OVERLAPPING_RESERVATION for a range that overlaps with one of the reservations', () => {
      const overlappingRange = {
        from: new Date(2020, 8, 10),
        to: new Date(2020, 8, 20),
      };
      const validationStatus = validateRange(overlappingRange, constraints);
      expect(validationStatus).toContain(
        DatePickerValidationError.OVERLAPPING_RESERVATION,
      );
    });

    it('overlapping reservations check is inclusive', () => {
      const overlappingRange = {
        from: new Date(2020, 8, 9),
        to: new Date(2020, 8, 10),
      };
      const validationStatus = validateRange(overlappingRange, constraints);
      expect(validationStatus).toContain(
        DatePickerValidationError.OVERLAPPING_RESERVATION,
      );
    });

    it('returns OUTSIDE_OPENING_PERIODS for a range that has dates outside specified opening periods', () => {
      const outsideOpeningPeriodsRange = {
        from: new Date(1999, 0),
        to: new Date(1999, 1),
      };
      const validationStatus = validateRange(
        outsideOpeningPeriodsRange,
        constraints,
      );
      expect(validationStatus).toContain(
        DatePickerValidationError.OUTSIDE_OPENING_PERIODS,
      );
    });

    it('returns INVALID_STARTING_DAY for a range that has a starting day not in startingDays', () => {
      const invalidStartingDayRange = {
        from: new Date(1999, 0),
        to: new Date(1999, 1),
      };
      const validationStatus = validateRange(
        invalidStartingDayRange,
        constraints,
      );
      expect(validationStatus).toContain(
        DatePickerValidationError.INVALID_STARTING_DAY,
      );
    });
  });

  describe('getDateRangeDuration', () => {
    it('returns correct number of days between dates', () => {
      expect(
        getDateRangeDuration(new Date(2020, 10, 1), new Date(2020, 10, 3), true),
      ).toEqual(3);
      expect(
        getDateRangeDuration(new Date(2020, 10, 1), new Date(2020, 10, 3), false),
      ).toEqual(2);
    });
  });

  describe('getDuration', () => {
    const startOfWeek = moment().startOf('week');
    const endOfWeek = moment().endOf('week');
    const nextMonday = moment().endOf('week').add(1, 'days');

    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');
    const firstOfNextMonth = moment().endOf('month').add(1, 'days');

    it('returns correct number of months for durationUnit === day', () => {
      expect(getDuration(endOfWeek, startOfWeek, 'day', true)).toEqual(7);
      expect(getDuration(endOfWeek, startOfWeek, 'day', false)).toEqual(6);
      expect(getDuration(nextMonday, startOfWeek, 'day', false)).toEqual(7);
    });

    it('returns correct number of months for durationUnit === week', () => {
      expect(getDuration(endOfWeek, startOfWeek, 'week', true)).toEqual(1);
      expect(getDuration(endOfWeek, startOfWeek, 'week', false)).toEqual(0);
      expect(getDuration(nextMonday, startOfWeek, 'week', false)).toEqual(1);
    });

    it('returns correct number of months for durationUnit === month', () => {
      expect(getDuration(endOfMonth, startOfMonth, 'month', true)).toEqual(1);
      expect(getDuration(endOfMonth, startOfMonth, 'month', false)).toEqual(0);
      expect(getDuration(firstOfNextMonth, startOfMonth, 'month', false)).toEqual(1);
    });
  });

  describe('trimAvailabilityPeriods', () => {
    it('removes periods for which the end date is before current date', () => {
      const periods = [
        { from: moment().add(-10, 'days'), to: moment().add(-5, 'days') },
      ];
      const res = trimAvailabilityPeriods(periods);
      expect(res).toHaveLength(0);
    });

    it('moves the starting date for periods with starting date before current date to current date', () => {
      const periods = [
        { from: moment().add(-1, 'days'), to: moment().add(1, 'days') },
      ];
      const res = trimAvailabilityPeriods(periods);
      expect(
        moment(res[0].from).startOf('day').diff(moment().startOf('day'), 'day'),
      ).toEqual(0);
    });
  });
});
