import { expect } from 'chai';
import MockDate from 'mockdate';
import moment from 'moment';
import queryString from 'query-string';
import simple from 'simple-mock';

import constants from 'constants/AppConstants';
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
} from 'utils/resourceUtils';

describe('Utils: resourceUtils', () => {
  describe('hasMaxReservations', () => {
    const maxReservationsPerUser = 1;
    const now = '2015-10-10T06:00:00+03:00';
    describe('if has more own open reservations than maxReservationsPerUser', () => {
      const reservations = [{
        end: '2015-10-10T07:00:00+03:00',
        isOwn: true,
      }, {
        end: '2015-10-10T08:00:00+03:00',
        isOwn: false,
      }];
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

      it('returns true', () => {
        expect(hasMaxReservations(resource)).to.equal(true);
      });
    });
    describe('if has more own passed reservations than maxReservationsPerUser', () => {
      const reservations = [{
        end: '2015-10-10T05:00:00+03:00',
        isOwn: true,
      }, {
        end: '2015-10-10T08:00:00+03:00',
        isOwn: false,
      }];
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

      it('returns false', () => {
        expect(hasMaxReservations(resource)).to.equal(false);
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

      it('returns false', () => {
        expect(isOpenNow(resource)).to.equal(false);
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

      it('returns false', () => {
        expect(isOpenNow(resource)).to.equal(false);
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

      it('returns true', () => {
        expect(isOpenNow(resource)).to.equal(true);
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

      it('returns false', () => {
        expect(isOpenNow(resource)).to.equal(false);
      });
    });
  });

  describe('getAvailabilityDataForNow', () => {
    function getResource(openingHours = {}, reservations = []) {
      return { openingHours: [openingHours], reservations };
    }

    describe('if openingHours are missing', () => {
      it('returns correct data', () => {
        const openingHours = {};
        const resource = getResource(openingHours);
        const availabilityData = getAvailabilityDataForNow(resource);
        const expected = { status: 'closed', bsStyle: 'danger' };

        expect(availabilityData).to.deep.equal(expected);
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
        it('returns the time when the resource opens', () => {
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

          expect(availabilityData).to.deep.equal(expected);
        });
      });

      describe('if there are reservations when the resource opens', () => {
        it('returns the first available time', () => {
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

          expect(availabilityData).to.deep.equal(expected);
        });

        it('works with cancelled and denied reservations', () => {
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

          expect(availabilityData).to.deep.equal(expected);
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
        it('returns data telling the resource is available', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          };
          const resource = getResource(openingHours, []);
          const availabilityData = getAvailabilityDataForNow(resource);
          const expected = { status: 'available', bsStyle: 'success' };

          expect(availabilityData).to.deep.equal(expected);
        });
      });

      describe('if there is an ongoing reservation', () => {
        it('returns the next available time', () => {
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

          expect(availabilityData).to.deep.equal(expected);
        });

        it('works with cancelled and denied reservations', () => {
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
          expect(availabilityData).to.deep.equal(expected);
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

      it('returns correct availability data', () => {
        const openingHours = {
          opens: '2015-10-10T12:00:00+03:00',
          closes: '2015-10-10T18:00:00+03:00',
          date: '2015-10-10',
        };
        const resource = getResource(openingHours, []);
        const availabilityData = getAvailabilityDataForNow(resource);
        const expected = { status: 'closed', bsStyle: 'danger' };

        expect(availabilityData).to.deep.equal(expected);
      });
    });
  });

  describe('getAvailabilityDataForWholeDay', () => {
    function getResource(openingHours = [], reservations = []) {
      return { openingHours, reservations };
    }

    describe('if openingHours are missing', () => {
      it('returns correct data', () => {
        const openingHours = {};
        const resource = getResource([openingHours]);
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = { status: 'closed', bsStyle: 'danger' };

        expect(availabilityData).to.deep.equal(expected);
      });
    });

    describe('if reserving is limited in a future date', () => {
      it('returns correct data', () => {
        const openingHours = [{
          opens: '2016-12-12T12:00:00+03:00',
          closes: '2016-12-12T18:00:00+03:00',
          date: '2016-12-12',
        }];
        const date = '2016-12-12';
        const resource = { openingHours, reservableBefore: '2016-10-10' };
        const availabilityData = getAvailabilityDataForWholeDay(resource, date);
        const expected = { status: 'reservingRestricted', bsStyle: 'danger' };

        expect(availabilityData).to.deep.equal(expected);
      });
    });

    describe('if there are no reservations', () => {
      it('returns the time between opening hours', () => {
        const openingHours = [{
          opens: '2015-10-10T12:00:00+03:00',
          closes: '2015-10-10T18:00:00+03:00',
          date: '2015-10-10',
        }];
        const reservations = [];
        const resource = getResource(openingHours, reservations);
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = {
          status: 'availableTime',
          bsStyle: 'success',
          values: { hours: 6 },
        };

        expect(availabilityData).to.deep.equal(expected);
      });
    });

    describe('if there are reservations', () => {
      it('returns the time between opening hours minus reservations', () => {
        const openingHours = [{
          opens: '2015-10-10T12:00:00+03:00',
          closes: '2015-10-10T18:00:00+03:00',
          date: '2015-10-10',
        }];
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

        expect(availabilityData).to.deep.equal(expected);
      });

      it('does not minus cancelled reservations from available time', () => {
        const openingHours = [{
          opens: '2015-10-10T12:00:00+03:00',
          closes: '2015-10-10T18:00:00+03:00',
          date: '2015-10-10',
        }];
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

        expect(availabilityData).to.deep.equal(expected);
      });

      it('does not minus denied reservations from available time', () => {
        const openingHours = [{
          opens: '2015-10-10T12:00:00+03:00',
          closes: '2015-10-10T18:00:00+03:00',
          date: '2015-10-10',
        }];
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

        expect(availabilityData).to.deep.equal(expected);
      });

      describe('if the whole day is reserved', () => {
        it('returns correct data', () => {
          const openingHours = [{
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          }];
          const reservations = [
            {
              begin: '2015-10-10T12:00:00+03:00',
              end: '2015-10-10T18:00:00+03:00',
            },
          ];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForWholeDay(resource);
          const expected = { status: 'reserved', bsStyle: 'danger' };

          expect(availabilityData).to.deep.equal(expected);
        });
      });

      describe('if selected day is not today', () => {
        it('returns the time between opening hours minus reservations', () => {
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

          expect(availabilityData).to.deep.equal(expected);
        });
      });
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

      expect(periodString).to.equal('4 h');
    });
  });

  describe('getMaxPeriodText', () => {
    it('returns max period as days', () => {
      const t = simple.stub().returnWith('days');
      const resource = { maxPeriod: '24:00:00' };
      const result = getMaxPeriodText(t, resource);

      expect(t.callCount).to.equal(1);
      expect(t.lastCall.args[0]).to.deep.equal('ResourceHeader.maxPeriodDays');
      expect(t.lastCall.args[1]).to.deep.equal({ days: 1 });
      expect(result).to.equal('days');
    });

    it('returns max period as hours', () => {
      const t = simple.stub().returnWith('hours');
      const resource = { maxPeriod: '02:00:00' };
      const result = getMaxPeriodText(t, resource);

      expect(t.callCount).to.equal(1);
      expect(t.lastCall.args[0]).to.deep.equal('ResourceHeader.maxPeriodHours');
      expect(t.lastCall.args[1]).to.deep.equal({ hours: 2 });
      expect(result).to.equal('hours');
    });
  });

  describe('getOpeningHours', () => {
    it('returns an empty object if given resource is undefined', () => {
      const resource = undefined;

      expect(getOpeningHours(resource)).to.deep.equal({});
    });

    it('returns an empty object if given resource is empty', () => {
      const resource = {};

      expect(getOpeningHours(resource)).to.deep.equal({});
    });

    it('returns an empty object if resource.openingHours is empty', () => {
      const resource = { openingHours: [] };

      expect(getOpeningHours(resource)).to.deep.equal({});
    });

    it('returns closes and opens from the first openingHours object if not date passed', () => {
      const resource = {
        openingHours: [
          { closes: 'first-closes', opens: 'first-opens', date: 'date' },
          { closes: 'second-closes', opens: 'second-opens', date: 'date' },
        ],
      };
      const expected = { closes: 'first-closes', opens: 'first-opens' };

      expect(getOpeningHours(resource)).to.deep.equal(expected);
    });

    it('returns closes and opens from the right date openingHours object', () => {
      const resource = {
        openingHours: [
          { closes: 'first-closes', opens: 'first-opens', date: 'date1' },
          { closes: 'second-closes', opens: 'second-opens', date: 'date2' },
          { closes: 'third-closes', opens: 'third-opens', date: 'date3' },
        ],
      };
      const expected = { closes: 'second-closes', opens: 'second-opens' };

      expect(getOpeningHours(resource, 'date2')).to.deep.equal(expected);
    });
  });

  describe('getOpenReservations', () => {
    it('returns resource reservations', () => {
      const resource = { reservations: [{ foo: 'bar' }] };

      expect(getOpenReservations(resource)).to.deep.equal(resource.reservations);
    });

    it('does not return cancelled reservations', () => {
      const reservations = [
        { id: 1, state: 'cancelled' },
        { id: 2, state: 'confirmed' },
        { id: 3, state: 'cancelled' },
        { id: 4, state: 'something' },
      ];
      const resource = { reservations };
      const expected = [
        { id: 2, state: 'confirmed' },
        { id: 4, state: 'something' },
      ];

      expect(getOpenReservations(resource)).to.deep.equal(expected);
    });

    it('does not return denied reservations', () => {
      const reservations = [
        { id: 1, state: 'denied' },
        { id: 2, state: 'confirmed' },
        { id: 3, state: 'denied' },
        { id: 4, state: 'something' },
      ];
      const resource = { reservations };
      const expected = [
        { id: 2, state: 'confirmed' },
        { id: 4, state: 'something' },
      ];

      expect(getOpenReservations(resource)).to.deep.equal(expected);
    });
  });

  describe('getResourcePageUrl', () => {
    it('returns an empty string if resource is undefined', () => {
      const resource = undefined;
      const resourcePageUrl = getResourcePageUrl(resource);

      expect(resourcePageUrl).to.equal('');
    });

    it('returns an empty string if resource does not have id', () => {
      const resource = {};
      const resourcePageUrl = getResourcePageUrl(resource);

      expect(resourcePageUrl).to.equal('');
    });

    it('returns correct url if date is not given', () => {
      const resource = { id: 'some-id' };
      const resourcePageUrl = getResourcePageUrl(resource);
      const expected = `/resources/${resource.id}`;

      expect(resourcePageUrl).to.equal(expected);
    });

    it('returns correct url if date is given', () => {
      const resource = { id: 'some-id' };
      const date = '2015-10-10';
      const resourcePageUrl = getResourcePageUrl(resource, date);
      const expected = `/resources/${resource.id}?date=2015-10-10`;

      expect(resourcePageUrl).to.equal(expected);
    });

    it('returns correct url if date is given in datetime format', () => {
      const resource = { id: 'some-id' };
      const date = '2015-10-10T08:00:00+03:00';
      const resourcePageUrl = getResourcePageUrl(resource, date);
      const expected = `/resources/${resource.id}?date=2015-10-10`;

      expect(resourcePageUrl).to.equal(expected);
    });

    it('returns correct url if date and time are given', () => {
      const resource = { id: 'some-id' };
      const date = '2015-10-10';
      const time = '2015-10-10T08:00:00+03:00';
      const resourcePageUrl = getResourcePageUrl(resource, date, time);
      const expected = `/resources/${resource.id}?${queryString.stringify({ date, time })}`;

      expect(resourcePageUrl).to.equal(expected);
    });
  });

  describe('getTermsAndConditions', () => {
    describe('when both specific and generic terms are specified', () => {
      const genericTerms = 'generic terms';
      const specificTerms = 'specific terms';

      it('returns specific and generic terms separated by blank lines', () => {
        const resource = { genericTerms, specificTerms };
        const expected = `${specificTerms}\n\n${genericTerms}`;
        expect(getTermsAndConditions(resource)).to.equal(expected);
      });
    });

    describe('when only specific terms is specified', () => {
      const genericTerms = null;
      const specificTerms = 'specific terms';

      it('returns only specific terms', () => {
        const resource = { genericTerms, specificTerms };
        expect(getTermsAndConditions(resource)).to.equal(specificTerms);
      });
    });

    describe('when only generic terms is specified', () => {
      const genericTerms = 'generic terms';
      const specificTerms = null;

      it('returns only specific terms', () => {
        const resource = { genericTerms, specificTerms };
        expect(getTermsAndConditions(resource)).to.equal(genericTerms);
      });
    });

    describe('when neither specific or generic terms is specified', () => {
      const genericTerms = null;
      const specificTerms = null;

      it('returns an empty string', () => {
        const resource = { genericTerms, specificTerms };

        expect(getTermsAndConditions(resource)).to.equal('');
      });
    });
  });

  describe('reservingIsRestricted', () => {
    describe('when no date is given', () => {
      const date = null;
      const resource = {};

      it('returns false', () => {
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).to.be.false;
      });
    });

    describe('when resource does not have reservableBefore limit', () => {
      const date = '2016-10-10';

      it('returns false if user is an admin', () => {
        const resource = { userPermissions: { isAdmin: true } };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).to.be.false;
      });

      it('returns false if user is a regular user', () => {
        const resource = { userPermissions: { isAdmin: false } };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).to.be.false;
      });
    });

    describe('when resource has reservableBefore limit and its after given date', () => {
      const reservableBefore = '2016-12-12';
      const date = '2016-10-10';

      it('returns false if user is an admin', () => {
        const resource = { userPermissions: { isAdmin: true }, reservableBefore };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).to.be.false;
      });

      it('returns false if user is a regular user', () => {
        const resource = { userPermissions: { isAdmin: false }, reservableBefore };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).to.be.false;
      });
    });

    describe('when resource has reservableBefore limit and its before given date', () => {
      const reservableBefore = '2016-09-09';
      const date = '2016-10-10';

      it('returns false if user is an admin', () => {
        const resource = { userPermissions: { isAdmin: true }, reservableBefore };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).to.be.false;
      });

      it('returns true if user is a regular user', () => {
        const resource = { userPermissions: { isAdmin: false }, reservableBefore };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).to.be.true;
      });
    });
  });
});
