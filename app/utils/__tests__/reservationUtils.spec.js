import { expect } from 'chai';
import MockDate from 'mockdate';
import moment from 'moment';

import constants from 'constants/AppConstants';
import Reservation from 'utils/fixtures/Reservation';
import {
  combine,
  isStaffEvent,
  getCurrentReservation,
  getMissingValues,
  getNextAvailableTime,
  getNextReservation,
} from 'utils/reservationUtils';

describe('Utils: reservationUtils', () => {
  describe('combine', () => {
    const slots = [
      {
        begin: '2015-10-16T08:00:00.000Z',
        end: '2015-10-16T09:00:00.000Z',
      },
      {
        begin: '2015-10-16T09:00:00.000Z',
        end: '2015-10-16T10:00:00.000Z',
      },
      {
        begin: '2015-10-16T10:00:00.000Z',
        end: '2015-10-16T11:00:00.000Z',
      },
      {
        begin: '2015-10-16T11:00:00.000Z',
        end: '2015-10-16T12:00:00.000Z',
      },
    ];

    it('returns an empty array if reservations is undefined', () => {
      const reservations = undefined;

      expect(combine(reservations)).to.deep.equal([]);
    });

    it('returns an empty array if reservations is empty', () => {
      const reservations = [];

      expect(combine(reservations)).to.deep.equal([]);
    });

    it('returns the reservations unchanged if it contains only one element', () => {
      const reservations = ['mock reservation'];

      expect(combine(reservations)).to.deep.equal(reservations);
    });

    it('combines two reservations if they are continual', () => {
      const reservations = [slots[0], slots[1]];
      const expected = [{
        begin: slots[0].begin,
        end: slots[1].end,
      }];

      expect(combine(reservations)).to.deep.equal(expected);
    });

    it('does not combine two reservations if they are not continual', () => {
      const reservations = [slots[0], slots[2]];

      expect(combine(reservations)).to.deep.equal(reservations);
    });

    it('combines three reservations if they are continual', () => {
      const reservations = [slots[0], slots[1], slots[2]];
      const expected = [{
        begin: slots[0].begin,
        end: slots[2].end,
      }];

      expect(combine(reservations)).to.deep.equal(expected);
    });

    it('only combines reservations that are continual', () => {
      const reservations = [slots[0], slots[1], slots[3]];
      const expected = [
        {
          begin: slots[0].begin,
          end: slots[1].end,
        },
        slots[3],
      ];

      expect(combine(reservations)).to.deep.equal(expected);
    });
  });

  describe('isStaffEvent', () => {
    it('returns false if resource does not exist', () => {
      const reservation = { reserverName: 'Luke' };
      const resource = undefined;
      expect(isStaffEvent(reservation, resource)).to.equal(false);
    });

    it('returns false if resource does not have any requiredReservationExtraFields', () => {
      const reservation = { reserverName: 'Luke' };
      const resource = {};
      expect(isStaffEvent(reservation, resource)).to.equal(false);
    });

    it('returns false if reservation has values for requiredReservationExtraFields', () => {
      const reservation = { reserverName: 'Luke' };
      const resource = { requiredReservationExtraFields: ['reserver_name'] };
      expect(isStaffEvent(reservation, resource)).to.equal(false);
    });

    it(
      'returns true if reservation is missing values for requiredReservationExtraFields',
      () => {
        const reservation = {};
        const resource = { requiredReservationExtraFields: ['reserver_name'] };
        expect(isStaffEvent(reservation, resource)).to.equal(true);
      }
    );

    it(
      'returns true if reservation has empty strings for requiredReservationExtraFields',
      () => {
        const reservation = { reserverName: '' };
        const resource = { requiredReservationExtraFields: ['reserver_name'] };
        expect(isStaffEvent(reservation, resource)).to.equal(true);
      }
    );
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

  describe('getMissingValues', () => {
    function getReservation(extraValues) {
      const defaults = {
        eventDescription: 'Some description',
        reserverName: 'Luke Skywalker',
      };
      return Reservation.build(Object.assign({}, defaults, extraValues));
    }

    it('returns an object', () => {
      const reservation = getReservation();
      const actual = getMissingValues(reservation);

      expect(typeof actual).to.equal('object');
    });

    describe('the returned object', () => {
      it('is empty if reservation is not missing any required values', () => {
        const reservation = getReservation();
        const actual = getMissingValues(reservation);

        expect(actual).to.deep.equal({});
      });

      constants.REQUIRED_STAFF_EVENT_FIELDS.forEach((field) => {
        it(`contains ${field} as "-" if ${field} is missing`, () => {
          const reservation = getReservation({ [field]: undefined });
          const actual = getMissingValues(reservation);
          const expected = { [field]: '-' };

          expect(actual).to.deep.equal(expected);
        });
      });
    });
  });

  describe('getNextAvailableTime', () => {
    describe('if there are no reservations', () => {
      const reservations = [];

      it('returns the fromMoment given in function arguments', () => {
        const fromMoment = moment();

        expect(getNextAvailableTime(reservations, fromMoment)).to.equal(fromMoment);
      });

      it('returns current time if fromMoment is not given', () => {
        const mockTime = '2015-10-10T10:00:00+03:00';
        MockDate.set(mockTime);
        expect(getNextAvailableTime(reservations).isSame(mockTime)).to.equal(true);
        MockDate.reset();
      });
    });

    describe('if there are reservations', () => {
      const reservations = [
        {
          begin: '2015-10-10T12:00:00+03:00',
          end: '2015-10-10T14:00:00+03:00',
        },
        {
          begin: '2015-10-10T16:00:00+03:00',
          end: '2015-10-10T17:00:00+03:00',
        },
        {
          begin: '2015-10-10T17:00:00+03:00',
          end: '2015-10-10T18:00:00+03:00',
        },
      ];

      describe('if the fromMoment is before all of the reservations', () => {
        const fromMoment = moment('2015-10-10T10:00:00+03:00');

        it('returns the fromMoment', () => {
          const nextAvailableTime = getNextAvailableTime(reservations, fromMoment);
          expect(nextAvailableTime).to.equal(fromMoment);
        });
      });

      describe('if the fromMoment is during one ongoing reservations', () => {
        const fromMoment = moment('2015-10-10T13:00:00+03:00');

        it('returns the end moment of the ongoing reservation', () => {
          const nextAvailableTime = getNextAvailableTime(reservations, fromMoment);
          const expected = '2015-10-10T14:00:00+03:00';
          expect(nextAvailableTime.isSame(expected)).to.equal(true);
        });
      });

      describe('if the fromMoment is during multiple ongoing reservations', () => {
        const fromMoment = moment('2015-10-10T16:30:00+03:00');

        it('returns the end moment of the last ongoing reservation', () => {
          const nextAvailableTime = getNextAvailableTime(reservations, fromMoment);
          const expected = '2015-10-10T18:00:00+03:00';
          expect(nextAvailableTime.isSame(expected)).to.equal(true);
        });
      });

      describe('if the fromMoment is between reservations', () => {
        const fromMoment = moment('2015-10-10T15:00:00+03:00');

        it('returns the fromMoment', () => {
          const nextAvailableTime = getNextAvailableTime(reservations, fromMoment);
          expect(nextAvailableTime).to.equal(fromMoment);
        });
      });

      describe('if the fromMoment is after all of the reservations', () => {
        const fromMoment = moment('2015-10-10T20:00:00+03:00');

        it('returns the fromMoment', () => {
          const nextAvailableTime = getNextAvailableTime(reservations, fromMoment);
          expect(nextAvailableTime).to.equal(fromMoment);
        });
      });
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
});
