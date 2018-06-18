import { expect } from 'chai';
import MockDate from 'mockdate';
import moment from 'moment';

import constants from 'constants/AppConstants';
import {
  addToDate,
  calculateDuration,
  calculateEndTime,
  getDateStartAndEndTimes,
  getDateString,
  getDuration,
  getDurationHours,
  getEndTimeString,
  getStartTimeString,
  getTimeSlots,
  isPastDate,
  prettifyHours,
} from 'utils/timeUtils';

describe('Utils: timeUtils', () => {
  describe('addToDate', () => {
    it('adds days to given date if daysToIncrement is positive', () => {
      const date = '2015-10-10';
      const actual = addToDate(date, 3);
      const expected = '2015-10-13';

      expect(actual).to.equal(expected);
    });

    it('subtracts days from given date if daysToIncrement is negative', () => {
      const date = '2015-10-10';
      const actual = addToDate(date, -3);
      const expected = '2015-10-07';

      expect(actual).to.equal(expected);
    });
  });

  describe('getDateStartAndEndTimes', () => {
    it('returns an empty object if date is undefined', () => {
      const date = undefined;

      expect(getDateStartAndEndTimes(date)).to.deep.equal({});
    });

    it('returns an empty object if date is an empty string', () => {
      const date = '';

      expect(getDateStartAndEndTimes(date)).to.deep.equal({});
    });

    it('returns an object with availableBetween, end and start properties', () => {
      const date = '2015-10-10';
      const actual = getDateStartAndEndTimes(date);

      expect(actual.availableBetween).to.not.exist;
      expect(actual.end).to.exist;
      expect(actual.start).to.exist;
    });

    it('returns an object with availableBetween, end and start in correct form ', () => {
      const date = '2015-10-10';
      const duration = 30;
      const end = '18:00';
      const start = '08:30';
      const timeZone = moment().format('Z');
      const expected = `${date}T${start}:00${timeZone},${date}T${end}:00${timeZone},${duration}`;
      const actual = getDateStartAndEndTimes(date, start, end, duration);

      expect(actual.availableBetween).to.equal(expected);
      expect(actual.end).to.equal(`${date}T23:59:59Z`);
      expect(actual.start).to.equal(`${date}T00:00:00Z`);
    });

    it('returns an object with availableBetween, end and start in correct form when end is 23:30', () => {
      const date = '2015-10-10';
      const duration = 30;
      const end = '23:30';
      const start = '08:30';
      const timeZone = moment().format('Z');
      const expected = `${date}T${start}:00${timeZone},${date}T${end}:00${timeZone},${duration}`;
      const actual = getDateStartAndEndTimes(date, start, end, duration);

      expect(actual.availableBetween).to.equal(expected);
      expect(actual.end).to.equal(`${date}T23:59:59Z`);
      expect(actual.start).to.equal(`${date}T00:00:00Z`);
    });
  });

  describe('getDateString', () => {
    it('returns current date string if date is undefined', () => {
      const date = undefined;
      const expected = moment().format(constants.DATE_FORMAT);

      expect(getDateString(date)).to.equal(expected);
    });

    it('returns current date string if date is an empty string', () => {
      const date = '';
      const expected = moment().format(constants.DATE_FORMAT);

      expect(getDateString(date)).to.equal(expected);
    });

    it('returns the date unchanged', () => {
      const date = '2015-10-11';

      expect(getDateString(date)).to.equal(date);
    });
  });

  describe('getDuration', () => {
    it('returns default duration if duration parameter is undefined', () => {
      const duration = undefined;
      expect(getDuration(duration)).to.equal(30);
    });

    it('returns default duration if duration parameter is 0', () => {
      const duration = 0;
      expect(getDuration(duration)).to.equal(30);
    });

    it('returns the duration unchanged', () => {
      const duration = 90;
      expect(getDuration(duration)).to.equal(duration);
    });
  });

  describe('getDurationHours', () => {
    it('returns default duration in hours if duration parameter is undefined', () => {
      const duration = undefined;
      expect(getDurationHours(duration)).to.equal(0.5);
    });

    it('returns default duration in hours if duration parameter is 0', () => {
      const duration = 0;
      expect(getDurationHours(duration)).to.equal(0.5);
    });

    it('returns the duration in hours', () => {
      const duration = 90;
      expect(getDurationHours(duration)).to.equal(1.5);
    });
  });

  describe('calculateDuration', () => {
    it('returns duration when given duration fits between start and end time range', () => {
      const duration = 60;
      const end = '18:00';
      const start = '10:00';
      expect(calculateDuration(duration, start, end)).to.equal(duration);
    });

    it('returns calculated duration when start and end time range less than given duration', () => {
      const duration = 360;
      const end = '12:00';
      const start = '10:00';
      expect(calculateDuration(duration, start, end)).to.equal(120);
    });

    it('returns duration when given duration first between start and end time range and end 23:30', () => {
      const duration = 360;
      const end = '23:30';
      const start = '10:00';
      expect(calculateDuration(duration, start, end)).to.equal(duration);
    });
  });

  describe('calculateEndTime', () => {
    it('returns given end time when start time is before end', () => {
      const end = '18:00';
      const start = '10:00';
      expect(calculateEndTime(end, start)).to.equal(end);
    });

    it('calculates end time when start time is after end', () => {
      const end = '09:00';
      const start = '10:00';
      expect(calculateEndTime(end, start)).to.equal('10:30');
    });
  });

  describe('getEndTimeString', () => {
    it('returns default end if parameter is undefined', () => {
      const end = undefined;
      expect(getEndTimeString(end)).to.equal('23:30');
    });

    it('returns default duration in hours if parameter is empty', () => {
      const end = '';
      expect(getEndTimeString(end)).to.equal('23:30');
    });

    it('returns the end unchanged', () => {
      const end = '20:00';
      expect(getEndTimeString(end)).to.equal(end);
    });
  });

  describe('getStartTimeString', () => {
    const now = '2016-10-10T06:45:00+03:00';

    before(() => {
      MockDate.set(now);
    });

    after(() => {
      MockDate.reset();
    });

    it('returns default start if parameter is undefined', () => {
      const start = undefined;
      expect(getStartTimeString(start)).to.equal('07:00');
    });

    it('returns default start if parameter is empty', () => {
      const start = '';
      expect(getStartTimeString(start)).to.equal('07:00');
    });

    it('returns the start unchanged', () => {
      const start = '08:30';
      expect(getStartTimeString(start)).to.equal(start);
    });
  });

  describe('getTimeSlots', () => {
    describe('When critical info is missing', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T10:00:00+03:00';
      const period = '00:30:00';

      it('returns an empty array if start is missing', () => {
        const actual = getTimeSlots(undefined, end, period);

        expect(actual).to.deep.equal([]);
      });

      it('returns an empty array if end is missing', () => {
        const actual = getTimeSlots(start, undefined, period);

        expect(actual).to.deep.equal([]);
      });

      it('uses 30 minutes as default duration if period is missing', () => {
        const actual = getTimeSlots(start, end, undefined);

        expect(actual.length).to.equal(4);
      });

      it('uses empty array as default reservations if no reservations is given', () => {
        const timeSlots = getTimeSlots(start, end, period);

        timeSlots.forEach((timeSlot) => {
          expect(timeSlot.reserved).to.equal(false);
        });
      });
    });

    describe('When dividing 2 hours into 30 min slots', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T10:00:00+03:00';
      const period = '00:30:00';
      const duration = moment.duration(period);
      const slots = getTimeSlots(start, end, period);

      it('returns an array of length 4', () => {
        expect(slots.length).to.equal(4);
      });

      describe('slot start and end times', () => {
        it('returned slots contains start and end properties', () => {
          expect(slots[0].start).to.exist;
          expect(slots[0].end).to.exist;
        });

        it('start and end times are in UTC', () => {
          expect(slots[0].start.endsWith('Z')).to.equal(true);
          expect(slots[0].end.endsWith('Z')).to.equal(true);
        });

        it('the first time slot starts when the time range starts', () => {
          const expected = moment.utc(start).toISOString();

          expect(slots[0].start).to.equal(expected);
        });

        it('the first time slot ends 30 minutes after start', () => {
          const expected = moment.utc(start).add(duration).toISOString();

          expect(slots[0].end).to.equal(expected);
        });

        it('the last time slot starts 30 minutes before the time range ends', () => {
          const expected = moment.utc(end).subtract(duration).toISOString();

          expect(slots[3].start).to.equal(expected);
        });

        it('the last time slot ends 30 minutes after start', () => {
          const expected = moment.utc(end).toISOString();

          expect(slots[3].end).to.equal(expected);
        });
      });

      describe('slot asISOString property', () => {
        it('returned slots contains asISOString property', () => {
          expect(slots[0].asISOString).to.exist;
        });

        it('is proper ISO format range representation', () => {
          const startUTC = moment.utc(start);
          const endUTC = moment.utc(startUTC).add(duration);
          const expected = `${startUTC.toISOString()}/${endUTC.toISOString()}`;

          expect(slots[0].asISOString).to.equal(expected);
        });
      });

      describe('slot asString property', () => {
        it('returned slots contains asString property', () => {
          expect(slots[0].asString).to.exist;
        });

        it('shows the slot time range in local time', () => {
          const startLocal = moment(start);
          const endLocal = moment(startLocal).add(duration);
          const startString = startLocal.format(constants.TIME_FORMAT);
          const endString = endLocal.format(constants.TIME_FORMAT);
          const expected = `${startString}\u2013${endString}`;

          expect(slots[0].asString).to.equal(expected);
        });
      });
    });

    describe('slot reserved property', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T10:00:00+03:00';
      const period = '00:30:00';

      describe('with one reservation', () => {
        const reservations = [
          {
            begin: '2015-10-09T08:30:00+03:00',
            end: '2015-10-09T09:30:00+03:00',
          },
        ];
        const slots = getTimeSlots(start, end, period, reservations);

        it('slot is not marked reserved if reservation starts when slot ends', () => {
          expect(slots[0].reserved).to.equal(false);
        });

        it('marks all the slots that are during reservation as reserved', () => {
          expect(slots[1].reserved).to.equal(true);
          expect(slots[2].reserved).to.equal(true);
        });

        it('slot is not marked reserved if slots starts when reservation ends', () => {
          expect(slots[3].reserved).to.equal(false);
        });
      });

      describe('with multiple reservations', () => {
        const reservations = [
          {
            begin: '2015-10-09T08:30:00+03:00',
            end: '2015-10-09T09:00:00+03:00',
          },
          {
            begin: '2015-10-09T09:30:00+03:00',
            end: '2015-10-09T10:00:00+03:00',
          },
        ];
        const slots = getTimeSlots(start, end, period, reservations);

        it('uses all reservations to find reserved slots', () => {
          expect(slots[0].reserved).to.equal(false);
          expect(slots[1].reserved).to.equal(true);
          expect(slots[2].reserved).to.equal(false);
          expect(slots[3].reserved).to.equal(true);
        });
      });
    });

    describe('slot reservationStarting and reservationEnding properties during reservation', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T09:30:00+03:00';
      const period = '00:30:00';
      const reservations = [
        {
          begin: '2015-10-09T08:00:00+03:00',
          end: '2015-10-09T09:30:00+03:00',
        },
      ];
      const slots = getTimeSlots(start, end, period, reservations);

      it('only first slot has reservationStarting property', () => {
        expect(slots[0].reservationStarting).to.equal(true);
        expect(slots[1].reservationStarting).to.equal(false);
        expect(slots[2].reservationStarting).to.equal(false);
      });

      it('only last slot has reservationEnding property', () => {
        expect(slots[0].reservationEnding).to.equal(false);
        expect(slots[1].reservationEnding).to.equal(false);
        expect(slots[2].reservationEnding).to.equal(true);
      });
    });

    describe('slot editing property', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T10:00:00+03:00';
      const period = '00:30:00';
      const reservations = [];

      describe('with one reservation to edit', () => {
        const reservationsToEdit = [
          {
            begin: '2015-10-09T08:30:00+03:00',
            end: '2015-10-09T09:30:00+03:00',
          },
        ];
        const slots = getTimeSlots(start, end, period, reservations, reservationsToEdit);

        it('slot is not marked as editing if reservation starts when slot ends', () => {
          expect(slots[0].editing).to.equal(false);
        });

        it('marks all the slots that are during reservation as editing', () => {
          expect(slots[1].editing).to.equal(true);
          expect(slots[2].editing).to.equal(true);
        });

        it('slot is not marked editing if slots starts when reservation ends', () => {
          expect(slots[3].editing).to.equal(false);
        });
      });

      describe('with multiple reservationsToEdit', () => {
        const reservationsToEdit = [
          {
            begin: '2015-10-09T08:30:00+03:00',
            end: '2015-10-09T09:00:00+03:00',
          },
          {
            begin: '2015-10-09T09:30:00+03:00',
            end: '2015-10-09T10:00:00+03:00',
          },
        ];
        const slots = getTimeSlots(start, end, period, reservations, reservationsToEdit);

        it('uses all reservations to find slots that are edited', () => {
          expect(slots[0].editing).to.equal(false);
          expect(slots[1].editing).to.equal(true);
          expect(slots[2].editing).to.equal(false);
          expect(slots[3].editing).to.equal(true);
        });
      });
    });
  });

  describe('isPastDate', () => {
    const now = '2016-10-10T06:00:00+03:00';

    before(() => {
      MockDate.set(now);
    });

    after(() => {
      MockDate.reset();
    });

    it('returns true if date is in the past', () => {
      const date = '2016-09-09';
      expect(isPastDate(date)).to.be.true;
    });

    it('returns false if date is the current date', () => {
      const date = '2016-10-10';
      expect(isPastDate(date)).to.be.false;
    });

    it('returns false if date is in the future', () => {
      const date = '2016-11-11';
      expect(isPastDate(date)).to.be.false;
    });
  });

  describe('prettifyHours', () => {
    describe('if hours is less than 0.5', () => {
      const hours = 0.3;

      describe('if showMinutes is true', () => {
        const showMinutes = true;

        it('returns the number of minutes left', () => {
          const expected = `${0.3 * 60} min`;

          expect(prettifyHours(hours, showMinutes)).to.equal(expected);
        });
      });

      describe('if showMinutes is false', () => {
        const showMinutes = false;

        it('returns the number of hours rounded to half an hour', () => {
          expect(prettifyHours(hours, showMinutes)).to.equal('0.5 h');
        });
      });
    });

    describe('if hours is more than 0.5', () => {
      const hours = 2.3;

      it('returns the number of hours rounded to half an hour', () => {
        expect(prettifyHours(hours)).to.equal('2.5 h');
      });
    });
  });
});
