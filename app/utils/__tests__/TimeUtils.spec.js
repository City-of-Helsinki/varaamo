import { expect } from 'chai';

import moment from 'moment';

import { DATE_FORMAT, TIME_FORMAT } from 'constants/AppConstants';
import {
  addToDate,
  getDateString,
  getTimeSlots,
} from 'utils/TimeUtils';

describe('Utils: TimeUtils', () => {
  describe('addToDate', () => {
    it('should add days to given date if daysToIncrement is positive', () => {
      const date = '2015-10-10';
      const actual = addToDate(date, 3);
      const expected = '2015-10-13';

      expect(actual).to.equal(expected);
    });

    it('should subtract days from given date if daysToIncrement is negative', () => {
      const date = '2015-10-10';
      const actual = addToDate(date, -3);
      const expected = '2015-10-07';

      expect(actual).to.equal(expected);
    });
  });

  describe('getDateString', () => {
    it('should return current date string if date is undefined', () => {
      const date = undefined;
      const expected = moment().format(DATE_FORMAT);

      expect(getDateString(date)).to.equal(expected);
    });

    it('should return current date string if date is an empty string', () => {
      const date = '';
      const expected = moment().format(DATE_FORMAT);

      expect(getDateString(date)).to.equal(expected);
    });

    it('should return the date unchanged', () => {
      const date = '2015-10-11';

      expect(getDateString(date)).to.equal(date);
    });
  });

  describe('getTimeSlots', () => {
    describe('When critical info is missing', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T10:00:00+03:00';
      const period = '00:30:00';

      it('should return an empty array if start is missing', () => {
        const actual = getTimeSlots(undefined, end, period);

        expect(actual).to.deep.equal([]);
      });

      it('should return an empty array if end is missing', () => {
        const actual = getTimeSlots(start, undefined, period);

        expect(actual).to.deep.equal([]);
      });

      it('should use 30 minutes as default duration if period is missing', () => {
        const actual = getTimeSlots(start, end, undefined);

        expect(actual.length).to.equal(4);
      });
    });

    describe('When dividing 2 hours into 30 min slots', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T10:00:00+03:00';
      const period = '00:30:00';
      const duration = moment.duration(period);
      const slots = getTimeSlots(start, end, period);

      it('should return an array of length 4', () => {
        expect(slots.length).to.equal(4);
      });

      describe('slot start and end times', () => {
        it('returned slots should contain start and end properties', () => {
          expect(slots[0].start).to.exist;
          expect(slots[0].end).to.exist;
        });

        it('start and end times should be in UTC', () => {
          expect(slots[0].start.endsWith('Z')).to.equal(true);
          expect(slots[0].end.endsWith('Z')).to.equal(true);
        });

        it('the first time slot should start when the time range starts', () => {
          const expected = moment.utc(start).toISOString();

          expect(slots[0].start).to.equal(expected);
        });

        it('the first time slot should end 30 minutes after start', () => {
          const expected = moment.utc(start).add(duration).toISOString();

          expect(slots[0].end).to.equal(expected);
        });

        it('the last time slot should start 30 minutes before the time range ends', () => {
          const expected = moment.utc(end).subtract(duration).toISOString();

          expect(slots[3].start).to.equal(expected);
        });

        it('the last time slot should end 30 minutes after start', () => {
          const expected = moment.utc(end).toISOString();

          expect(slots[3].end).to.equal(expected);
        });
      });

      describe('slot asString property', () => {
        it('returned slots should contain asString property', () => {
          expect(slots[0].asString).to.exist;
        });

        it('should show the slot time range in local time', () => {
          const startLocal = moment(start);
          const endLocal = moment(startLocal).add(duration);
          const expected = `${startLocal.format(TIME_FORMAT)}\u2013${endLocal.format(TIME_FORMAT)}`;

          expect(slots[0].asString).to.equal(expected);
        });
      });
    });
  });
});
