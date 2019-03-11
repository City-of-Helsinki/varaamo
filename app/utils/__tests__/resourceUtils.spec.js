import constants from 'constants/AppConstants';

import MockDate from 'mockdate';
import moment from 'moment';
import queryString from 'query-string';
import simple from 'simple-mock';

import {
  hasMaxReservations,
  isOpenNow,
  getAvailabilityDataForNow,
  getAvailabilityDataForWholeDay,
  getHumanizedPeriod,
  getMaxPeriodText,
  getOpeningHours,
  getOpenReservations,
  getResourcePageUrl,
  getTermsAndConditions,
  reservingIsRestricted,
  getResourcePageUrlComponents,
} from 'utils/resourceUtils';

describe('Utils: resourceUtils', () => {
  describe('hasMaxReservations', () => {
    const maxReservationsPerUser = 1;
    const now = '2015-10-10T06:00:00+03:00';
    describe('if has more own open reservations than maxReservationsPerUser', () => {
      const reservations = [
        {
          end: '2015-10-10T07:00:00+03:00',
          isOwn: true,
        },
        {
          end: '2015-10-10T08:00:00+03:00',
          isOwn: false,
        },
      ];
      const resource = {
        maxReservationsPerUser,
        reservations,
      };
      beforeEach(() => {
        MockDate.set(now);
      });

      afterEach(() => {
        MockDate.reset();
      });

      test('returns true', () => {
        expect(hasMaxReservations(resource)).toBe(true);
      });
    });
    describe('if has more own passed reservations than maxReservationsPerUser', () => {
      const reservations = [
        {
          end: '2015-10-10T05:00:00+03:00',
          isOwn: true,
        },
        {
          end: '2015-10-10T08:00:00+03:00',
          isOwn: false,
        },
      ];
      const resource = {
        maxReservationsPerUser,
        reservations,
      };
      beforeEach(() => {
        MockDate.set(now);
      });

      afterEach(() => {
        MockDate.reset();
      });

      test('returns false', () => {
        expect(hasMaxReservations(resource)).toBe(false);
      });
    });
  });
  describe('isOpenNow', () => {
    describe('if openingHours data is missing', () => {
      const openingHours = {
        opens: null,
        closes: null,
      };
      const now = '2015-10-10T06:00:00+03:00';
      const resource = { openingHours: [openingHours] };

      beforeEach(() => {
        MockDate.set(now);
      });

      afterEach(() => {
        MockDate.reset();
      });

      test('returns false', () => {
        expect(isOpenNow(resource)).toBe(false);
      });
    });

    describe('if current time is before openingHours.opens', () => {
      const openingHours = {
        opens: '2015-10-10T12:00:00+03:00',
        closes: '2015-10-10T18:00:00+03:00',
        date: '2015-10-10',
      };
      const now = '2015-10-10T06:00:00+03:00';
      const resource = { openingHours: [openingHours] };

      beforeEach(() => {
        MockDate.set(now);
      });

      afterEach(() => {
        MockDate.reset();
      });

      test('returns false', () => {
        expect(isOpenNow(resource)).toBe(false);
      });
    });

    describe('if current time is between openingHours', () => {
      const openingHours = {
        opens: '2015-10-10T12:00:00+03:00',
        closes: '2015-10-10T18:00:00+03:00',
        date: '2015-10-10',
      };
      const now = '2015-10-10T14:00:00+03:00';
      const resource = { openingHours: [openingHours] };

      beforeEach(() => {
        MockDate.set(now);
      });

      afterEach(() => {
        MockDate.reset();
      });

      test('returns true', () => {
        expect(isOpenNow(resource)).toBe(true);
      });
    });

    describe('if current time is after openingHours.closes', () => {
      const openingHours = {
        opens: '2015-10-10T12:00:00+03:00',
        closes: '2015-10-10T18:00:00+03:00',
        date: '2015-10-10',
      };
      const now = '2015-10-10T23:00:00+03:00';
      const resource = { openingHours: [openingHours] };

      beforeEach(() => {
        MockDate.set(now);
      });

      afterEach(() => {
        MockDate.reset();
      });

      test('returns false', () => {
        expect(isOpenNow(resource)).toBe(false);
      });
    });
  });

  describe('getAvailabilityDataForNow', () => {
    function getResource(openingHours = {}, reservations = []) {
      return { openingHours: [openingHours], reservations };
    }

    describe('if openingHours are missing', () => {
      test('returns correct data', () => {
        const openingHours = {};
        const resource = getResource(openingHours);
        const availabilityData = getAvailabilityDataForNow(resource);
        const expected = { status: 'closed', bsStyle: 'danger' };

        expect(availabilityData).toEqual(expected);
      });
    });

    describe('if current time is before opening time', () => {
      beforeEach(() => {
        MockDate.set('2015-10-10T10:00:00+03:00');
      });

      afterEach(() => {
        MockDate.reset();
      });

      describe('if there are no reservations when the resource opens', () => {
        test('returns the time when the resource opens', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          };
          const reservations = [];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForNow(resource);
          const expectedTime = moment(openingHours.opens).format(constants.TIME_FORMAT);
          const expected = {
            status: 'availableAt',
            bsStyle: 'danger',
            values: { time: expectedTime },
          };

          expect(availabilityData).toEqual(expected);
        });
      });

      describe('if there are reservations when the resource opens', () => {
        test('returns the first available time', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          };
          const reservations = [
            {
              begin: '2015-10-10T12:00:00+03:00',
              end: '2015-10-10T14:00:00+03:00',
            },
            {
              begin: '2015-10-10T16:00:00+03:00',
              end: '2015-10-10T16:30:00+03:00',
            },
          ];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForNow(resource);
          const expectedTime = moment(reservations[0].end).format(constants.TIME_FORMAT);
          const expected = {
            status: 'availableAt',
            bsStyle: 'danger',
            values: { time: expectedTime },
          };

          expect(availabilityData).toEqual(expected);
        });

        test('works with cancelled and denied reservations', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          };
          const reservations = [
            {
              begin: '2015-10-10T12:00:00+03:00',
              end: '2015-10-10T14:00:00+03:00',
              state: 'cancelled',
            },
            {
              begin: '2015-10-10T12:00:00+03:00',
              end: '2015-10-10T14:00:00+03:00',
              state: 'denied',
            },
          ];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForNow(resource);
          const expectedTime = moment(openingHours.opens).format(constants.TIME_FORMAT);
          const expected = {
            status: 'availableAt',
            bsStyle: 'danger',
            values: { time: expectedTime },
          };

          expect(availabilityData).toEqual(expected);
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

      describe('if there is no ongoing reservation', () => {
        test('returns data telling the resource is available', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          };
          const resource = getResource(openingHours, []);
          const availabilityData = getAvailabilityDataForNow(resource);
          const expected = { status: 'available', bsStyle: 'success' };

          expect(availabilityData).toEqual(expected);
        });
      });

      describe('if there is an ongoing reservation', () => {
        test('returns the next available time', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          };
          const reservations = [
            {
              begin: '2015-10-10T14:00:00+03:00',
              end: '2015-10-10T16:00:00+03:00',
            },
          ];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForNow(resource);
          const expectedTime = moment(reservations[0].end).format(constants.TIME_FORMAT);
          const expected = {
            status: 'availableAt',
            bsStyle: 'danger',
            values: { time: expectedTime },
          };

          expect(availabilityData).toEqual(expected);
        });

        test('works with cancelled and denied reservations', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          };
          const reservations = [
            {
              begin: '2015-10-10T14:00:00+03:00',
              end: '2015-10-10T16:00:00+03:00',
              state: 'cancelled',
            },
            {
              begin: '2015-10-10T14:00:00+03:00',
              end: '2015-10-10T16:00:00+03:00',
              state: 'denied',
            },
          ];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForNow(resource);
          const expected = { status: 'available', bsStyle: 'success' };
          expect(availabilityData).toEqual(expected);
        });
      });
    });

    describe('if current time is after openingHours.closes', () => {
      beforeEach(() => {
        MockDate.set('2015-10-10T22:00:00+03:00');
      });

      afterEach(() => {
        MockDate.reset();
      });

      test('returns correct availability data', () => {
        const openingHours = {
          opens: '2015-10-10T12:00:00+03:00',
          closes: '2015-10-10T18:00:00+03:00',
          date: '2015-10-10',
        };
        const resource = getResource(openingHours, []);
        const availabilityData = getAvailabilityDataForNow(resource);
        const expected = { status: 'closed', bsStyle: 'danger' };

        expect(availabilityData).toEqual(expected);
      });
    });
  });

  describe('getAvailabilityDataForWholeDay', () => {
    function getResource(openingHours = [], reservations = []) {
      return { openingHours, reservations };
    }

    describe('if openingHours are missing', () => {
      test('returns correct data', () => {
        const openingHours = {};
        const resource = getResource([openingHours]);
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = { status: 'closed', bsStyle: 'danger' };

        expect(availabilityData).toEqual(expected);
      });
    });

    describe('if reserving is limited in a future date', () => {
      test('returns correct data', () => {
        const openingHours = [
          {
            opens: '2016-12-12T12:00:00+03:00',
            closes: '2016-12-12T18:00:00+03:00',
            date: '2016-12-12',
          },
        ];
        const date = '2016-12-12';
        const resource = { openingHours, reservableBefore: '2016-10-10' };
        const availabilityData = getAvailabilityDataForWholeDay(resource, date);
        const expected = { status: 'reservingRestricted', bsStyle: 'danger' };

        expect(availabilityData).toEqual(expected);
      });
    });

    describe('if there are no reservations', () => {
      test('returns the time between opening hours', () => {
        const openingHours = [
          {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          },
        ];
        const reservations = [];
        const resource = getResource(openingHours, reservations);
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = {
          status: 'availableTime',
          bsStyle: 'success',
          values: { hours: 6 },
        };

        expect(availabilityData).toEqual(expected);
      });
    });

    describe('if there are reservations', () => {
      test('returns the time between opening hours minus reservations', () => {
        const openingHours = [
          {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          },
        ];
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
        const resource = getResource(openingHours, reservations);
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = {
          status: 'availableTime',
          bsStyle: 'success',
          values: { hours: 4.5 },
        };

        expect(availabilityData).toEqual(expected);
      });

      test('does not minus cancelled reservations from available time', () => {
        const openingHours = [
          {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          },
        ];
        const reservations = [
          {
            begin: '2015-10-10T13:00:00+03:00',
            end: '2015-10-10T14:00:00+03:00',
            state: 'cancelled',
          },
        ];
        const resource = getResource(openingHours, reservations);
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = {
          status: 'availableTime',
          bsStyle: 'success',
          values: { hours: 6 },
        };

        expect(availabilityData).toEqual(expected);
      });

      test('does not minus denied reservations from available time', () => {
        const openingHours = [
          {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          },
        ];
        const reservations = [
          {
            begin: '2015-10-10T13:00:00+03:00',
            end: '2015-10-10T14:00:00+03:00',
            state: 'denied',
          },
        ];
        const resource = getResource(openingHours, reservations);
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = {
          status: 'availableTime',
          bsStyle: 'success',
          values: { hours: 6 },
        };

        expect(availabilityData).toEqual(expected);
      });

      describe('if the whole day is reserved', () => {
        test('returns correct data', () => {
          const openingHours = [
            {
              opens: '2015-10-10T12:00:00+03:00',
              closes: '2015-10-10T18:00:00+03:00',
              date: '2015-10-10',
            },
          ];
          const reservations = [
            {
              begin: '2015-10-10T12:00:00+03:00',
              end: '2015-10-10T18:00:00+03:00',
            },
          ];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForWholeDay(resource);
          const expected = { status: 'reserved', bsStyle: 'danger' };

          expect(availabilityData).toEqual(expected);
        });
      });

      describe('if selected day is not today', () => {
        test('returns the time between opening hours minus reservations', () => {
          const openingHours = [
            {
              opens: '2015-10-10T12:00:00+03:00',
              closes: '2015-10-10T18:00:00+03:00',
              date: '2015-10-10',
            },
            {
              opens: '2015-10-11T12:00:00+03:00',
              closes: '2015-10-11T18:00:00+03:00',
              date: '2015-10-11',
            },
            {
              opens: '2015-10-12T12:00:00+03:00',
              closes: '2015-10-12T18:00:00+03:00',
              date: '2015-10-12',
            },
          ];
          const reservations = [
            {
              begin: '2015-10-10T13:00:00+03:00',
              end: '2015-10-10T14:00:00+03:00',
            },
            {
              begin: '2015-10-11T13:00:00+03:00',
              end: '2015-10-11T14:00:00+03:00',
            },
            {
              begin: '2015-10-11T16:00:00+03:00',
              end: '2015-10-11T16:30:00+03:00',
            },
            {
              begin: '2015-10-12T13:00:00+03:00',
              end: '2015-10-12T14:00:00+03:00',
            },
          ];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForWholeDay(resource, '2015-10-11');
          const expected = {
            status: 'availableTime',
            bsStyle: 'success',
            values: { hours: 4.5 },
          };

          expect(availabilityData).toEqual(expected);
        });
      });
    });
  });

  describe('getHumanizedPeriod', () => {
    test('returns an empty string if period is undefined', () => {
      const period = undefined;
      const periodString = getHumanizedPeriod(period);

      expect(periodString).toBe('');
    });

    test('returns an empty string if period is null', () => {
      const period = null;
      const periodString = getHumanizedPeriod(period);

      expect(periodString).toBe('');
    });

    test('returns a correct period string if proper period is given', () => {
      const period = '04:00:00';
      const periodString = getHumanizedPeriod(period);

      expect(periodString).toBe('4 h');
    });
  });

  describe('getMaxPeriodText', () => {
    test('returns max period as days', () => {
      const t = simple.stub().returnWith('days');
      const resource = { maxPeriod: '24:00:00' };
      const result = getMaxPeriodText(t, resource);

      expect(t.callCount).toBe(1);
      expect(t.lastCall.args[0]).toEqual('ResourceHeader.maxPeriodDays');
      expect(t.lastCall.args[1]).toEqual({ days: 1 });
      expect(result).toBe('days');
    });

    test('returns max period as hours', () => {
      const t = simple.stub().returnWith('hours');
      const resource = { maxPeriod: '02:00:00' };
      const result = getMaxPeriodText(t, resource);

      expect(t.callCount).toBe(1);
      expect(t.lastCall.args[0]).toEqual('ResourceHeader.maxPeriodHours');
      expect(t.lastCall.args[1]).toEqual({ hours: 2 });
      expect(result).toBe('hours');
    });
  });

  describe('getOpeningHours', () => {
    test('returns an empty object if given resource is undefined', () => {
      const resource = undefined;

      expect(getOpeningHours(resource)).toEqual({});
    });

    test('returns an empty object if given resource is empty', () => {
      const resource = {};

      expect(getOpeningHours(resource)).toEqual({});
    });

    test('returns an empty object if resource.openingHours is empty', () => {
      const resource = { openingHours: [] };

      expect(getOpeningHours(resource)).toEqual({});
    });

    test(
      'returns closes and opens from the first openingHours object if not date passed',
      () => {
        const resource = {
          openingHours: [
            { closes: 'first-closes', opens: 'first-opens', date: 'date' },
            { closes: 'second-closes', opens: 'second-opens', date: 'date' },
          ],
        };
        const expected = { closes: 'first-closes', opens: 'first-opens' };

        expect(getOpeningHours(resource)).toEqual(expected);
      }
    );

    test(
      'returns closes and opens from the right date openingHours object',
      () => {
        const resource = {
          openingHours: [
            { closes: 'first-closes', opens: 'first-opens', date: 'date1' },
            { closes: 'second-closes', opens: 'second-opens', date: 'date2' },
            { closes: 'third-closes', opens: 'third-opens', date: 'date3' },
          ],
        };
        const expected = { closes: 'second-closes', opens: 'second-opens' };

        expect(getOpeningHours(resource, 'date2')).toEqual(expected);
      }
    );
  });

  describe('getOpenReservations', () => {
    test('returns resource reservations', () => {
      const resource = { reservations: [{ foo: 'bar' }] };

      expect(getOpenReservations(resource)).toEqual(resource.reservations);
    });

    test('does not return cancelled reservations', () => {
      const reservations = [
        { id: 1, state: 'cancelled' },
        { id: 2, state: 'confirmed' },
        { id: 3, state: 'cancelled' },
        { id: 4, state: 'something' },
      ];
      const resource = { reservations };
      const expected = [{ id: 2, state: 'confirmed' }, { id: 4, state: 'something' }];

      expect(getOpenReservations(resource)).toEqual(expected);
    });

    test('does not return denied reservations', () => {
      const reservations = [
        { id: 1, state: 'denied' },
        { id: 2, state: 'confirmed' },
        { id: 3, state: 'denied' },
        { id: 4, state: 'something' },
      ];
      const resource = { reservations };
      const expected = [{ id: 2, state: 'confirmed' }, { id: 4, state: 'something' }];

      expect(getOpenReservations(resource)).toEqual(expected);
    });
  });

  describe('getResourcePageUrl', () => {
    test('returns an empty string if resource is undefined', () => {
      const resource = undefined;
      const resourcePageUrl = getResourcePageUrl(resource);

      expect(resourcePageUrl).toBe('');
    });

    test('returns an empty string if resource does not have id', () => {
      const resource = {};
      const resourcePageUrl = getResourcePageUrl(resource);

      expect(resourcePageUrl).toBe('');
    });

    test('returns correct url if date is not given', () => {
      const resource = { id: 'some-id' };
      const resourcePageUrl = getResourcePageUrl(resource);
      const expected = `/resources/${resource.id}`;

      expect(resourcePageUrl).toBe(expected);
    });

    test('returns correct url if date is given', () => {
      const resource = { id: 'some-id' };
      const date = '2015-10-10';
      const resourcePageUrl = getResourcePageUrl(resource, date);
      const expected = `/resources/${resource.id}?date=2015-10-10`;

      expect(resourcePageUrl).toBe(expected);
    });

    test('returns correct url if date is given in datetime format', () => {
      const resource = { id: 'some-id' };
      const date = '2015-10-10T08:00:00+03:00';
      const resourcePageUrl = getResourcePageUrl(resource, date);
      const expected = `/resources/${resource.id}?date=2015-10-10`;

      expect(resourcePageUrl).toBe(expected);
    });

    test('returns correct url if date and time are given', () => {
      const resource = { id: 'some-id' };
      const date = '2015-10-10';
      const time = '2015-10-10T08:00:00+03:00';
      const resourcePageUrl = getResourcePageUrl(resource, date, time);
      const expected = `/resources/${resource.id}?${queryString.stringify({ date, time })}`;

      expect(resourcePageUrl).toBe(expected);
    });
  });

  describe('getResourcePageUrlComponents', () => {
    test('returns an empty pathname and query if resource is undefined', () => {
      const resource = undefined;
      const resourcePageUrlComponents = getResourcePageUrlComponents(resource);

      expect(resourcePageUrlComponents.pathname).toBe('');
      expect(resourcePageUrlComponents.query).toBe('');
    });

    test('returns an empty string if resource does not have id', () => {
      const resource = {};
      const resourcePageUrlComponents = getResourcePageUrlComponents(resource);

      expect(resourcePageUrlComponents.pathname).toBe('');
      expect(resourcePageUrlComponents.query).toBe('');
    });

    test('returns correct url if date is not given', () => {
      const resource = { id: 'some-id' };
      const resourcePageUrlComponents = getResourcePageUrlComponents(resource);
      const expected = `/resources/${resource.id}`;

      expect(resourcePageUrlComponents.pathname).toBe(expected);
      expect(resourcePageUrlComponents.query).toBe('');
    });

    test('returns correct url if date is given', () => {
      const resource = { id: 'some-id' };
      const date = '2015-10-10';
      const resourcePageUrlComponents = getResourcePageUrlComponents(resource, date);
      const expectedPathname = `/resources/${resource.id}`;
      const expectedQuery = 'date=2015-10-10';

      expect(resourcePageUrlComponents.pathname).toBe(expectedPathname);
      expect(resourcePageUrlComponents.query).toBe(expectedQuery);
    });

    test('returns correct url if date is given in datetime format', () => {
      const resource = { id: 'some-id' };
      const date = '2015-10-10T08:00:00+03:00';
      const resourcePageUrlComponents = getResourcePageUrlComponents(resource, date);
      const expectedPathname = `/resources/${resource.id}`;
      const expectedQuery = 'date=2015-10-10';

      expect(resourcePageUrlComponents.pathname).toBe(expectedPathname);
      expect(resourcePageUrlComponents.query).toBe(expectedQuery);
    });

    test('returns correct url if date and time are given', () => {
      const resource = { id: 'some-id' };
      const date = '2015-10-10';
      const time = '2015-10-10T08:00:00+03:00';
      const resourcePageUrlComponents = getResourcePageUrlComponents(resource, date, time);
      const expectedPathname = `/resources/${resource.id}`;
      const expectedQuery = queryString.stringify({ date, time });

      expect(resourcePageUrlComponents.pathname).toBe(expectedPathname);
      expect(resourcePageUrlComponents.query).toBe(expectedQuery);
    });
  });

  describe('getTermsAndConditions', () => {
    describe('when both specific and generic terms are specified', () => {
      const genericTerms = 'generic terms';
      const specificTerms = 'specific terms';

      test('returns specific and generic terms separated by blank lines', () => {
        const resource = { genericTerms, specificTerms };
        const expected = `${specificTerms}\n\n${genericTerms}`;
        expect(getTermsAndConditions(resource)).toBe(expected);
      });
    });

    describe('when only specific terms is specified', () => {
      const genericTerms = null;
      const specificTerms = 'specific terms';

      test('returns only specific terms', () => {
        const resource = { genericTerms, specificTerms };
        expect(getTermsAndConditions(resource)).toBe(specificTerms);
      });
    });

    describe('when only generic terms is specified', () => {
      const genericTerms = 'generic terms';
      const specificTerms = null;

      test('returns only specific terms', () => {
        const resource = { genericTerms, specificTerms };
        expect(getTermsAndConditions(resource)).toBe(genericTerms);
      });
    });

    describe('when neither specific or generic terms is specified', () => {
      const genericTerms = null;
      const specificTerms = null;

      test('returns an empty string', () => {
        const resource = { genericTerms, specificTerms };

        expect(getTermsAndConditions(resource)).toBe('');
      });
    });
  });

  describe('reservingIsRestricted', () => {
    describe('when no date is given', () => {
      const date = null;
      const resource = {};

      test('returns false', () => {
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).toBe(false);
      });
    });

    describe('when resource does not have reservableBefore limit', () => {
      const date = '2016-10-10';

      test('returns false if user is an admin', () => {
        const resource = { userPermissions: { isAdmin: true } };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).toBe(false);
      });

      test('returns false if user is a regular user', () => {
        const resource = { userPermissions: { isAdmin: false } };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).toBe(false);
      });
    });

    describe('when resource has reservableBefore limit and its after given date', () => {
      const reservableBefore = '2016-12-12';
      const date = '2016-10-10';

      test('returns false if user is an admin', () => {
        const resource = { userPermissions: { isAdmin: true }, reservableBefore };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).toBe(false);
      });

      test('returns false if user is a regular user', () => {
        const resource = { userPermissions: { isAdmin: false }, reservableBefore };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).toBe(false);
      });
    });

    describe('when resource has reservableBefore limit and its before given date', () => {
      const reservableBefore = '2016-09-09';
      const date = '2016-10-10';

      test('returns false if user is an admin', () => {
        const resource = { userPermissions: { isAdmin: true }, reservableBefore };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).toBe(false);
      });

      test('returns true if user is a regular user', () => {
        const resource = { userPermissions: { isAdmin: false }, reservableBefore };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).toBe(true);
      });
    });
  });
});
