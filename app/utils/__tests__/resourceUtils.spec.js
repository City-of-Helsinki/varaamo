import { expect } from 'chai';
import MockDate from 'mockdate';
import moment from 'moment';

import Reservation from 'fixtures/Reservation';
import {
  getAvailableTime,
  getCurrentReservation,
  getHumanizedPeriod,
  getNextReservation,
  getOpeningHours,
  getPeopleCapacityString,
} from 'utils/resourceUtils';

describe('Utils: resourceUtils', () => {
  describe('getAvailableTime', () => {
    it('returns "0 tuntia vapaana" if openingHours is empty', () => {
      const openingHours = {};

      expect(getAvailableTime(openingHours)).to.equal('0 tuntia vapaana');
    });

    describe('rounding the returned time', () => {
      beforeEach(() => {
        MockDate.set('2015-10-10T16:07:37+03:00');
      });

      afterEach(() => {
        MockDate.reset();
      });

      it('rounds the time upwards to nearest 0.5 hours', () => {
        const openingHours = {
          opens: '2015-10-10T12:00:00+03:00',
          closes: '2015-10-10T18:00:00+03:00',
        };
        const availableTime = getAvailableTime(openingHours);

        expect(availableTime).to.equal('2 tuntia vapaana');
      });
    });


    describe('if current time is before opening time', () => {
      beforeEach(() => {
        MockDate.set('2015-09-10T12:00:00+03:00');
      });

      afterEach(() => {
        MockDate.reset();
      });

      describe('if there are no reservations', () => {
        it('returns the time between opening hours', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
          };
          const reservations = [];
          const availableTime = getAvailableTime(openingHours, reservations);
          expect(availableTime).to.equal('6 tuntia vapaana');
        });
      });

      describe('if there are reservations', () => {
        it('returns the time between opening hours minus reservations', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
          };
          const reservations = [
            {
              begin: '2015-10-10T13:00:00+03:00',
              end: '2015-10-10T14:00:00+03:00',
            },
            {
              begin: '2015-10-10T16:00:00+03:00',
              end: '2015-10-10T16:30:00+03:00',
            },
          ];
          const availableTime = getAvailableTime(openingHours, reservations);

          expect(availableTime).to.equal('4.5 tuntia vapaana');
        });

        it('does not minus cancelled reservations from available time', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
          };
          const reservations = [
            {
              begin: '2015-10-10T13:00:00+03:00',
              end: '2015-10-10T14:00:00+03:00',
              state: 'cancelled',
            },
          ];
          const availableTime = getAvailableTime(openingHours, reservations);

          expect(availableTime).to.equal('6 tuntia vapaana');
        });
      });
    });

    describe('if current time is between opening hours', () => {
      beforeEach(() => {
        MockDate.set('2015-10-10T15:00:00+03:00');
      });

      afterEach(() => {
        MockDate.reset();
      });

      describe('if there are no reservations', () => {
        it('returns time between current time and closing time', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
          };
          const availableTime = getAvailableTime(openingHours);

          expect(availableTime).to.equal('3 tuntia vapaana');
        });
      });

      describe('if there are reservations', () => {
        it('returns time between current time and closing time minus reservations', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
          };
          const reservations = [
            {
              begin: '2015-10-10T15:00:00+03:00',
              end: '2015-10-10T16:00:00+03:00',
            },
            {
              begin: '2015-10-10T17:00:00+03:00',
              end: '2015-10-10T17:30:00+03:00',
            },
          ];
          const availableTime = getAvailableTime(openingHours, reservations);

          expect(availableTime).to.equal('1.5 tuntia vapaana');
        });

        it('does not minus reservations that are before current time', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
          };
          const reservations = [
            {
              begin: '2015-10-10T12:00:00+03:00',
              end: '2015-10-10T13:00:00+03:00',
            },
            {
              begin: '2015-10-10T14:00:00+03:00',
              end: '2015-10-10T14:30:00+03:00',
            },
          ];
          const availableTime = getAvailableTime(openingHours, reservations);

          expect(availableTime).to.equal('3 tuntia vapaana');
        });

        it('does not minus past time of ongoing reservations', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
          };
          const reservations = [
            {
              begin: '2015-10-10T13:00:00+03:00',
              end: '2015-10-10T17:00:00+03:00',
            },
          ];
          const availableTime = getAvailableTime(openingHours, reservations);

          expect(availableTime).to.equal('1 tunti vapaana');
        });

        it('does not minus cancelled reservations from available time', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
          };
          const reservations = [
            {
              begin: '2015-10-10T15:00:00+03:00',
              end: '2015-10-10T16:00:00+03:00',
              state: 'cancelled',
            },
          ];
          const availableTime = getAvailableTime(openingHours, reservations);

          expect(availableTime).to.equal('3 tuntia vapaana');
        });
      });
    });

    describe('if current time is after openingHours.closes', () => {
      beforeEach(() => {
        MockDate.set('2015-11-10T18:00:00+03:00');
      });

      afterEach(() => {
        MockDate.reset();
      });

      it('returns "0 tuntia vapaana"', () => {
        const openingHours = {
          opens: '2015-10-10T12:00:00+03:00',
          closes: '2015-10-10T18:00:00+03:00',
        };
        const availableTime = getAvailableTime(openingHours);
        expect(availableTime).to.equal('0 tuntia vapaana');
      });
    });
  });

  describe('getCurrentReservation', () => {
    const previousReservation = Reservation.build({}, { startTime: moment().subtract(1, 'days') });
    const currentReservation = Reservation.build(
      {},
      { startTime: moment().subtract(20, 'minutes') }
    );
    const nextReservation = Reservation.build({}, { startTime: moment().add(2, 'hours') });
    const lastReservation = Reservation.build({}, { startTime: moment().add(4, 'hours') });
    const unorderedReservations = [
      lastReservation,
      previousReservation,
      nextReservation,
      currentReservation,
    ];
    it('returns the current reservation from a list of reservations', () => {
      expect(getCurrentReservation(unorderedReservations)).to.deep.equal(currentReservation);
    });
  });

  describe('getHumanizedPeriod', () => {
    it('returns an empty string if period is undefined', () => {
      const period = undefined;
      const periodString = getHumanizedPeriod(period);

      expect(periodString).to.equal('');
    });

    it('returns an empty string if period is null', () => {
      const period = null;
      const periodString = getHumanizedPeriod(period);

      expect(periodString).to.equal('');
    });

    it('returns a correct period string if proper period is given', () => {
      const period = '04:00:00';
      const periodString = getHumanizedPeriod(period);

      expect(periodString).to.equal('4h');
    });
  });

  describe('getNextReservation', () => {
    const previousReservation = Reservation.build({}, { startTime: moment().subtract(1, 'days') });
    const currentReservation = Reservation.build(
      {},
      { startTime: moment().subtract(20, 'minutes') }
    );
    const nextReservation = Reservation.build({}, { startTime: moment().add(2, 'hours') });
    const lastReservation = Reservation.build({}, { startTime: moment().add(4, 'hours') });
    const unorderedReservations = [
      lastReservation,
      previousReservation,
      nextReservation,
      currentReservation,
    ];
    it('returns the next reservation from a list of reservations', () => {
      expect(getNextReservation(unorderedReservations)).to.deep.equal(nextReservation);
    });
  });

  describe('getOpeningHours', () => {
    it('returns an empty object if given item is undefined', () => {
      const item = undefined;

      expect(getOpeningHours(item)).to.deep.equal({});
    });

    it('returns an empty object if given item is empty', () => {
      const item = {};

      expect(getOpeningHours(item)).to.deep.equal({});
    });

    it('returns an empty object if item.openingHours is empty', () => {
      const item = { openingHours: [] };

      expect(getOpeningHours(item)).to.deep.equal({});
    });

    it('returns closes and opens from the first openingHours object', () => {
      const item = {
        openingHours: [
          { closes: 'first-closes', opens: 'first-opens' },
          { closes: 'second-closes', opens: 'second-opens' },
        ],
      };
      const expected = { closes: 'first-closes', opens: 'first-opens' };

      expect(getOpeningHours(item)).to.deep.equal(expected);
    });
  });

  describe('getPeopleCapacityString', () => {
    it('returns an empty string if capacity is undefined', () => {
      const capacity = undefined;
      const capacityString = getPeopleCapacityString(capacity);

      expect(capacityString).to.equal('');
    });

    it('returns an empty string if capacity is null', () => {
      const capacity = null;
      const capacityString = getPeopleCapacityString(capacity);

      expect(capacityString).to.equal('');
    });

    it('returns an empty string if capacity is 0', () => {
      const capacity = 0;
      const capacityString = getPeopleCapacityString(capacity);

      expect(capacityString).to.equal('');
    });

    it('returns a max capacity string if capacity is number bigger than 0', () => {
      const capacity = 1;
      const capacityString = getPeopleCapacityString(capacity);
      const expected = `max ${capacity} hengelle.`;

      expect(capacityString).to.equal(expected);
    });
  });
});
