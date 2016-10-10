import { expect } from 'chai';
import MockDate from 'mockdate';
import moment from 'moment';
import queryString from 'query-string';

import constants from 'constants/AppConstants';
import {
  isOpenNow,
  getAvailabilityDataForNow,
  getAvailabilityDataForWholeDay,
  getHumanizedPeriod,
  getOpeningHours,
  getOpenReservations,
  getResourcePageUrl,
  getTermsAndConditions,
} from 'utils/resourceUtils';

describe('Utils: resourceUtils', () => {
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
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = { text: 'Suljettu', bsStyle: 'danger' };

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
          };
          const reservations = [];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForNow(resource);
          const expectedTime = moment(openingHours.opens);
          const expected = {
            text: `Vapautuu klo ${expectedTime.format(constants.TIME_FORMAT)}`,
            bsStyle: 'danger',
          };

          expect(availabilityData).to.deep.equal(expected);
        });
      });

      describe('if there are reservations when the resource opens', () => {
        it('returns the first available time', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
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
          const expectedTime = moment(reservations[0].end);
          const expected = {
            text: `Vapautuu klo ${expectedTime.format(constants.TIME_FORMAT)}`,
            bsStyle: 'danger',
          };

          expect(availabilityData).to.deep.equal(expected);
        });

        it('works with cancelled and denied reservations', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
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
          const expectedTime = moment(openingHours.opens);
          const expected = {
            text: `Vapautuu klo ${expectedTime.format(constants.TIME_FORMAT)}`,
            bsStyle: 'danger',
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
          };
          const resource = getResource(openingHours, []);
          const availabilityData = getAvailabilityDataForNow(resource);
          const expected = { text: 'Heti vapaa', bsStyle: 'success' };

          expect(availabilityData).to.deep.equal(expected);
        });
      });

      describe('if there is an ongoing reservation', () => {
        it('returns the next available time', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
          };
          const reservations = [
            {
              begin: '2015-10-10T14:00:00+03:00',
              end: '2015-10-10T16:00:00+03:00',
            },
          ];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForNow(resource);
          const expectedTime = moment(reservations[0].end);
          const expected = {
            text: `Vapautuu klo ${expectedTime.format(constants.TIME_FORMAT)}`,
            bsStyle: 'danger',
          };

          expect(availabilityData).to.deep.equal(expected);
        });

        it('works with cancelled and denied reservations', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
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
          const expected = { text: 'Heti vapaa', bsStyle: 'success' };

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
        };
        const resource = getResource(openingHours, []);
        const availabilityData = getAvailabilityDataForNow(resource);
        const expected = { text: 'Suljettu', bsStyle: 'danger' };

        expect(availabilityData).to.deep.equal(expected);
      });
    });
  });

  describe('getAvailabilityDataForWholeDay', () => {
    function getResource(openingHours = {}, reservations = []) {
      return { openingHours: [openingHours], reservations };
    }

    describe('if openingHours are missing', () => {
      it('returns correct data', () => {
        const openingHours = {};
        const resource = getResource(openingHours);
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = { text: 'Suljettu', bsStyle: 'danger' };

        expect(availabilityData).to.deep.equal(expected);
      });
    });

    describe('if there are no reservations', () => {
      it('returns the time between opening hours', () => {
        const openingHours = {
          opens: '2015-10-10T12:00:00+03:00',
          closes: '2015-10-10T18:00:00+03:00',
        };
        const reservations = [];
        const resource = getResource(openingHours, reservations);
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = { text: 'Vapaata 6 tuntia', bsStyle: 'success' };

        expect(availabilityData).to.deep.equal(expected);
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
        const resource = getResource(openingHours, reservations);
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = { text: 'Vapaata 4.5 tuntia', bsStyle: 'success' };

        expect(availabilityData).to.deep.equal(expected);
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
        const resource = getResource(openingHours, reservations);
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = { text: 'Vapaata 6 tuntia', bsStyle: 'success' };

        expect(availabilityData).to.deep.equal(expected);
      });

      it('does not minus denied reservations from available time', () => {
        const openingHours = {
          opens: '2015-10-10T12:00:00+03:00',
          closes: '2015-10-10T18:00:00+03:00',
        };
        const reservations = [
          {
            begin: '2015-10-10T13:00:00+03:00',
            end: '2015-10-10T14:00:00+03:00',
            state: 'denied',
          },
        ];
        const resource = getResource(openingHours, reservations);
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = { text: 'Vapaata 6 tuntia', bsStyle: 'success' };

        expect(availabilityData).to.deep.equal(expected);
      });

      describe('if the whole day is reserved', () => {
        it('returns correct data', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
          };
          const reservations = [
            {
              begin: '2015-10-10T12:00:00+03:00',
              end: '2015-10-10T18:00:00+03:00',
            },
          ];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForWholeDay(resource);
          const expected = { text: 'Varattu koko päivän', bsStyle: 'danger' };

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

    it('returns closes and opens from the first openingHours object', () => {
      const resource = {
        openingHours: [
          { closes: 'first-closes', opens: 'first-opens' },
          { closes: 'second-closes', opens: 'second-opens' },
        ],
      };
      const expected = { closes: 'first-closes', opens: 'first-opens' };

      expect(getOpeningHours(resource)).to.deep.equal(expected);
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
      const genericTerms = { fi: 'generic terms' };
      const specificTerms = { fi: 'specific terms' };

      it('returns specific and generic terms separated by blank lines', () => {
        const resource = { genericTerms, specificTerms };
        const expected = `${specificTerms.fi}\n\n${genericTerms.fi}`;

        expect(getTermsAndConditions(resource)).to.equal(expected);
      });
    });

    describe('when only specific terms is specified', () => {
      const genericTerms = null;
      const specificTerms = { fi: 'specific terms' };

      it('returns only specific terms', () => {
        const resource = { genericTerms, specificTerms };
        const expected = specificTerms.fi;

        expect(getTermsAndConditions(resource)).to.equal(expected);
      });
    });

    describe('when only generic terms is specified', () => {
      const genericTerms = { fi: 'generic terms' };
      const specificTerms = null;

      it('returns only specific terms', () => {
        const resource = { genericTerms, specificTerms };
        const expected = genericTerms.fi;

        expect(getTermsAndConditions(resource)).to.equal(expected);
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
});
