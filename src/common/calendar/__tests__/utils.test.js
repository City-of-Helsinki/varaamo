import moment from 'moment';

import resourceFixture from '../../data/fixtures/resource';
import * as calendarUtils from '../utils';

describe('TimePickerCalendar utils ', () => {
  const resource = resourceFixture.build();

  const selection = {
    start: new Date('2019-08-16T00:00:00Z'),
    end: new Date('2019-08-16T00:30:00Z'),
  };

  const MIN_PERIOD = '01:00:00';
  const resourceWithMinPeriod = resourceFixture.build({ min_period: MIN_PERIOD });

  const MAX_PERIOD = '04:00:00';
  const resourceWithMaxPeriod = resourceFixture.build({ max_period: MAX_PERIOD });

  const selectionLargerThanMinPeriod = { ...selection, end: new Date('2019-08-16T01:30:00Z') };
  const selectionSmallerThanMaxPeriod = { ...selection, end: new Date('2019-08-16T03:30:00Z') };

  const selectionMinPeriodExpect = { ...selection, end: new Date('2019-08-16T01:00:00Z') };
  const selectionMaxPeriodExpect = { ...selection, end: new Date('2019-08-16T04:00:00Z') };

  describe('getMinPeriodTimeRange', () => {
    test('should return default selected if resource does not have min_period defined', () => {
      const minPeriodTimeRange = calendarUtils.getMinPeriodTimeRange(resource, selection.start, selection.end);

      expect(minPeriodTimeRange).toEqual(selection);
    });

    test('should return default end if end time argument already fulfill the min_period', () => {
      const minPeriod = calendarUtils.getMinPeriodTimeRange(
        resourceWithMinPeriod, selectionLargerThanMinPeriod.start, selectionLargerThanMinPeriod.end
      );

      expect(minPeriod).toEqual(selectionLargerThanMinPeriod);
    });

    test('should return new end time fulfill min_period if selected end time is smaller than that', () => {
      const minPeriod = calendarUtils.getMinPeriodTimeRange(
        resourceWithMinPeriod, selection.start, selection.end
      );

      expect(minPeriod).toEqual(selectionMinPeriodExpect);
    });
  });

  describe('getMaxPeriodTimeRange', () => {
    test('should return default selected if resource does not have max_period defined', () => {
      const maxPeriodTimeRange = calendarUtils.getMaxPeriodTimeRange(resource, selection.start, selection.end);

      expect(maxPeriodTimeRange).toEqual(selection);
    });

    test('should return default selected if end time argument already smaller than the max_period', () => {
      const maxPeriod = calendarUtils.getMaxPeriodTimeRange(
        resourceWithMaxPeriod, selectionSmallerThanMaxPeriod.start, selectionSmallerThanMaxPeriod.end
      );

      expect(maxPeriod).toEqual(selectionSmallerThanMaxPeriod);
    });

    test('should return new end time fulfill max_period if selected end time is bigger than that', () => {
      const maxPeriod = calendarUtils.getMaxPeriodTimeRange(
        resourceWithMaxPeriod, selection.start, new Date('2019-08-16T04:30:00Z')
      );

      expect(maxPeriod).toEqual(selectionMaxPeriodExpect);
    });

    test('should return default even when its bigger than max_period when user is staff', () => {
      const maxPeriod = calendarUtils.getMaxPeriodTimeRange(
        resourceWithMaxPeriod, selection.start, new Date('2019-08-16T04:30:00Z'), true
      );

      expect(maxPeriod.end).toEqual(new Date('2019-08-16T04:30:00Z'));
    });
  });

  describe('isTimeRangeUnderMinPeriod', () => {
    test('should return false by default if no min_period', () => {
      const isUnder = calendarUtils.isTimeRangeUnderMinPeriod(resource, selection.start, selection.end);

      expect(isUnder).toBeFalsy();
    });

    test('should return false if end time already >= min_period', () => {
      const isUnder = calendarUtils.isTimeRangeUnderMinPeriod(
        resourceWithMinPeriod, selectionLargerThanMinPeriod.start, selectionLargerThanMinPeriod.end
      );

      expect(isUnder).toBeFalsy();
    });

    test('should return true if end time < min_period', () => {
      const isUnder = calendarUtils.isTimeRangeUnderMinPeriod(
        resourceWithMinPeriod, selection.start, selection.end
      );

      expect(isUnder).toBeTruthy();
    });
  });

  describe('isTimeRangeOverMaxPeriod', () => {
    test('should return false by default if no max_period', () => {
      const isOver = calendarUtils.isTimeRangeOverMaxPeriod(resource, selection.start, selection.end);

      expect(isOver).toBeFalsy();
    });

    test('should return false if end time already <= max_period', () => {
      const isOver = calendarUtils.isTimeRangeOverMaxPeriod(
        resourceWithMaxPeriod, selectionSmallerThanMaxPeriod.start, selectionSmallerThanMaxPeriod.end
      );

      expect(isOver).toBeFalsy();
    });

    test('should return true if end time > max_period', () => {
      const isOver = calendarUtils.isTimeRangeOverMaxPeriod(
        resourceWithMaxPeriod, selection.start, new Date('2019-08-16T04:30:00Z')
      );

      expect(isOver).toBeTruthy();
    });

    test('should return false if end time > max_period, user is staff', () => {
      const isOver = calendarUtils.isTimeRangeOverMaxPeriod(
        resourceWithMaxPeriod, selection.start, new Date('2019-08-16T04:30:00Z'), true
      );

      expect(isOver).toBeFalsy();
    });
  });
  describe('getDurationText', () => {
    test('should return correct length in minutes', () => {
      const durationText = calendarUtils.getDurationText(selection);
      expect(durationText).toEqual('30min');
    });
    test('should return correct length in hours', () => {
      selection.end = new Date(moment(selection.start).add(1, 'hours').toISOString());
      const durationText = calendarUtils.getDurationText(selection);
      expect(durationText).toEqual('1h');
    });
    test('should return correct length in days hours minutes', () => {
      selection.end = new Date(moment(selection.start)
        .add(2, 'days')
        .add(3, 'hours')
        .add(4, 'minutes')
        .add(33, 'seconds')
        .toISOString());
      const durationText = calendarUtils.getDurationText(selection);
      expect(durationText).toEqual('2d3h4min');
    });
    test('should return empty string if start and end are equal', () => {
      selection.end = selection.start;
      const durationText = calendarUtils.getDurationText(selection);
      expect(durationText).toEqual('');
    });
  });
});
