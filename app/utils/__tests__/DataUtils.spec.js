import { expect } from 'chai';
import MockDate from 'mockdate';
import moment from 'moment';

import constants from 'constants/AppConstants';
import Image from 'fixtures/Image';
import Reservation from 'fixtures/Reservation';
import {
  combineReservations,
  isStaffEvent,
  getAddress,
  getAddressWithName,
  getAvailableTime,
  getCurrentReservation,
  getDescription,
  getHumanizedPeriod,
  getMainImage,
  getMissingReservationValues,
  getName,
  getNextReservation,
  getOpeningHours,
  getPeopleCapacityString,
} from 'utils/DataUtils';

describe('Utils: DataUtils', () => {
  describe('combineReservations', () => {
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

    it('should return an empty array if reservations is undefined', () => {
      const reservations = undefined;

      expect(combineReservations(reservations)).to.deep.equal([]);
    });

    it('should return an empty array if reservations is empty', () => {
      const reservations = [];

      expect(combineReservations(reservations)).to.deep.equal([]);
    });

    it('should return the reservations unchanged if it contains only one element', () => {
      const reservations = ['mock reservation'];

      expect(combineReservations(reservations)).to.deep.equal(reservations);
    });

    it('should combine two reservations if they are continual', () => {
      const reservations = [slots[0], slots[1]];
      const expected = [{
        begin: slots[0].begin,
        end: slots[1].end,
      }];

      expect(combineReservations(reservations)).to.deep.equal(expected);
    });

    it('should not combine two reservations if they are not continual', () => {
      const reservations = [slots[0], slots[2]];

      expect(combineReservations(reservations)).to.deep.equal(reservations);
    });

    it('should combine three reservations if they are continual', () => {
      const reservations = [slots[0], slots[1], slots[2]];
      const expected = [{
        begin: slots[0].begin,
        end: slots[2].end,
      }];

      expect(combineReservations(reservations)).to.deep.equal(expected);
    });

    it('should only combine reservations that are continual', () => {
      const reservations = [slots[0], slots[1], slots[3]];
      const expected = [
        {
          begin: slots[0].begin,
          end: slots[1].end,
        },
        slots[3],
      ];

      expect(combineReservations(reservations)).to.deep.equal(expected);
    });
  });

  describe('isStaffEvent', () => {
    it('should return false if resource does not exist', () => {
      const reservation = { reserverName: 'Luke' };
      const resource = undefined;
      expect(isStaffEvent(reservation, resource)).to.equal(false);
    });

    it('should return false if resource does not have any requiredReservationExtraFields', () => {
      const reservation = { reserverName: 'Luke' };
      const resource = {};
      expect(isStaffEvent(reservation, resource)).to.equal(false);
    });

    it('should return false if reservation has values for requiredReservationExtraFields', () => {
      const reservation = { reserverName: 'Luke' };
      const resource = { requiredReservationExtraFields: ['reserver_name'] };
      expect(isStaffEvent(reservation, resource)).to.equal(false);
    });

    it(
      'should return true if reservation is missing values for requiredReservationExtraFields',
      () => {
        const reservation = {};
        const resource = { requiredReservationExtraFields: ['reserver_name'] };
        expect(isStaffEvent(reservation, resource)).to.equal(true);
      }
    );

    it(
      'should return true if reservation has empty strings for requiredReservationExtraFields',
      () => {
        const reservation = { reserverName: '' };
        const resource = { requiredReservationExtraFields: ['reserver_name'] };
        expect(isStaffEvent(reservation, resource)).to.equal(true);
      }
    );
  });

  describe('getAddress', () => {
    it('should return an empty string if given item is undefined', () => {
      const item = undefined;

      expect(getAddress(item)).to.equal('');
    });

    it('should return an empty string if given item is empty', () => {
      const item = {};

      expect(getAddress(item)).to.equal('');
    });

    it('should return the address in proper format', () => {
      const item = {
        addressZip: '12345',
        municipality: 'Helsinki',
        streetAddress: { fi: 'Example street 3' },
      };
      const expected = 'Example street 3, 12345 Helsinki';

      expect(getAddress(item)).to.equal(expected);
    });

    it('should capitalize the municipality', () => {
      const item = {
        addressZip: '12345',
        municipality: 'espoo',
        streetAddress: { fi: 'Example street 3' },
      };
      const expected = 'Example street 3, 12345 Espoo';

      expect(getAddress(item)).to.equal(expected);
    });
  });

  describe('getAddressWithName', () => {
    it('should return an empty string if given item is undefined', () => {
      const item = undefined;

      expect(getAddressWithName(item)).to.equal('');
    });

    it('should return an empty string if given item is empty', () => {
      const item = {};

      expect(getAddressWithName(item)).to.equal('');
    });

    it('should return the address with item name in proper format', () => {
      const item = {
        addressZip: '12345',
        name: { fi: 'Some Unit' },
        municipality: 'Helsinki',
        streetAddress: { fi: 'Example street 3' },
      };
      const expected = 'Some Unit, Example street 3, 12345 Helsinki';

      expect(getAddressWithName(item)).to.equal(expected);
    });
  });

  describe('getAvailableTime', () => {
    it('should return "0 tuntia vapaana" if openingHours is empty', () => {
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

      it('should round the time upwards to nearest 0.5 hours', () => {
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
        it('should return the time between opening hours', () => {
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
        it('should return the time between opening hours minus reservations', () => {
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

        it('should not minus cancelled reservations from available time', () => {
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
        it('should return time between current time and closing time', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
          };
          const availableTime = getAvailableTime(openingHours);

          expect(availableTime).to.equal('3 tuntia vapaana');
        });
      });

      describe('if there are reservations', () => {
        it('should return time between current time and closing time minus reservations', () => {
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

        it('should not minus reservations that are before current time', () => {
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

        it('should not minus past time of ongoing reservations', () => {
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

        it('should not minus cancelled reservations from available time', () => {
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

      it('should return "0 tuntia vapaana"', () => {
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

  describe('getDescription', () => {
    it('should return an empty string if item is undefined', () => {
      const item = undefined;

      expect(getDescription(item)).to.equal('');
    });

    it('should return an empty string if item.description is undefined', () => {
      const item = {};

      expect(getDescription(item)).to.equal('');
    });

    it('should return an empty string if item.description.fi is undefined', () => {
      const item = { description: {} };

      expect(getDescription(item)).to.equal('');
    });

    it('should return item.description.fi', () => {
      const item = { description: { fi: 'Some description' } };

      expect(getDescription(item)).to.equal('Some description');
    });
  });

  describe('getHumanizedPeriod', () => {
    it('should return an empty string if period is undefined', () => {
      const period = undefined;
      const periodString = getHumanizedPeriod(period);

      expect(periodString).to.equal('');
    });

    it('should return an empty string if period is null', () => {
      const period = null;
      const periodString = getHumanizedPeriod(period);

      expect(periodString).to.equal('');
    });

    it('should return a correct period string if proper period is given', () => {
      const period = '04:00:00';
      const periodString = getHumanizedPeriod(period);

      expect(periodString).to.equal('4h');
    });
  });

  describe('getMainImage', () => {
    it('should return an empty object if images is undefined', () => {
      const images = undefined;

      expect(getMainImage(images)).to.deep.equal({});
    });

    it('should return an empty object if images is empty', () => {
      const images = [];

      expect(getMainImage(images)).to.deep.equal({});
    });

    it('should return the image that is of type "main"', () => {
      const images = [
        Image.build({ type: 'other' }),
        Image.build({ type: 'main' }),
        Image.build({ type: 'other' }),
      ];

      expect(getMainImage(images)).to.deep.equal(images[1]);
    });

    it('should return the first image that is of type "main"', () => {
      const images = [
        Image.build({ type: 'other' }),
        Image.build({ type: 'main' }),
        Image.build({ type: 'main' }),
      ];

      expect(getMainImage(images)).to.deep.equal(images[1]);
    });

    it('should return the first image if none of the images is of type "main"', () => {
      const images = [
        Image.build({ type: 'other' }),
        Image.build({ type: 'other' }),
      ];

      expect(getMainImage(images)).to.deep.equal(images[0]);
    });
  });

  describe('getMissingReservationValues', () => {
    function getReservation(extraValues) {
      const defaults = {
        eventDescription: 'Some description',
        reserverName: 'Luke Skywalker',
      };
      return Reservation.build(Object.assign({}, defaults, extraValues));
    }

    it('should return an object', () => {
      const reservation = getReservation();
      const actual = getMissingReservationValues(reservation);

      expect(typeof actual).to.equal('object');
    });

    describe('the returned object', () => {
      it('should be empty if reservation is not missing any required values', () => {
        const reservation = getReservation();
        const actual = getMissingReservationValues(reservation);

        expect(actual).to.deep.equal({});
      });

      constants.REQUIRED_STAFF_EVENT_FIELDS.forEach((field) => {
        it(`should contain ${field} as "-" if ${field} is missing`, () => {
          const reservation = getReservation({ [field]: undefined });
          const actual = getMissingReservationValues(reservation);
          const expected = { [field]: '-' };

          expect(actual).to.deep.equal(expected);
        });
      });
    });
  });

  describe('getName', () => {
    it('should return an empty string if item is undefined', () => {
      const item = undefined;

      expect(getName(item)).to.equal('');
    });

    it('should return an empty string if item.name is undefined', () => {
      const item = {};

      expect(getName(item)).to.equal('');
    });

    it('should return an empty string if item.name.fi is undefined', () => {
      const item = { name: {} };

      expect(getName(item)).to.equal('');
    });

    it('should return item.name.fi', () => {
      const item = { name: { fi: 'Some name' } };

      expect(getName(item)).to.equal('Some name');
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
    it('should return an empty object if given item is undefined', () => {
      const item = undefined;

      expect(getOpeningHours(item)).to.deep.equal({});
    });

    it('should return an empty object if given item is empty', () => {
      const item = {};

      expect(getOpeningHours(item)).to.deep.equal({});
    });

    it('should return an empty object if item.openingHours is empty', () => {
      const item = { openingHours: [] };

      expect(getOpeningHours(item)).to.deep.equal({});
    });

    it('should return closes and opens from the first openingHours object', () => {
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
    it('should return an empty string if capacity is undefined', () => {
      const capacity = undefined;
      const capacityString = getPeopleCapacityString(capacity);

      expect(capacityString).to.equal('');
    });

    it('should return an empty string if capacity is null', () => {
      const capacity = null;
      const capacityString = getPeopleCapacityString(capacity);

      expect(capacityString).to.equal('');
    });

    it('should return an empty string if capacity is 0', () => {
      const capacity = 0;
      const capacityString = getPeopleCapacityString(capacity);

      expect(capacityString).to.equal('');
    });

    it('should return a max capacity string if capacity is number bigger than 0', () => {
      const capacity = 1;
      const capacityString = getPeopleCapacityString(capacity);
      const expected = `max ${capacity} hengelle.`;

      expect(capacityString).to.equal(expected);
    });
  });
});
