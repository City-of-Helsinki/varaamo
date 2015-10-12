import { expect } from 'chai';

import { PURPOSE_MAIN_TYPES } from 'constants/AppConstants';
import {
  getAddress,
  getAddressWithName,
  getDateStartAndEndTimes,
  getDescription,
  getName,
  getOpeningHours,
  getPeopleCapacityString,
  humanizeMainType,
  pickSupportedFilters,
} from 'utils/DataUtils';

describe('Utils: DataUtils', () => {
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
        streetAddress: { fi: 'Example street 3' },
      };
      const expected = 'Example street 3, 12345 Helsinki';

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
        streetAddress: { fi: 'Example street 3' },
      };
      const expected = 'Some Unit, Example street 3, 12345 Helsinki';

      expect(getAddressWithName(item)).to.equal(expected);
    });
  });

  describe('getDateStartAndEndTimes', () => {
    it('should return an empty object if date is undefined', () => {
      const date = undefined;

      expect(getDateStartAndEndTimes(date)).to.deep.equal({});
    });

    it('should return an empty object if date is an empty string', () => {
      const date = '';

      expect(getDateStartAndEndTimes(date)).to.deep.equal({});
    });

    it('should return an object with start and end properties', () => {
      const date = '2015-10-10';
      const actual = getDateStartAndEndTimes(date);

      expect(actual.start).to.exist;
      expect(actual.end).to.exist;
    });

    it('returned start and end times should be in correct form ', () => {
      const date = '2015-10-10';
      const actual = getDateStartAndEndTimes(date);

      expect(actual.start).to.equal(`${date}T00:00:00Z`);
      expect(actual.end).to.equal(`${date}T23:59:59Z`);
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

  describe('humanizeMainType', () => {
    it('should return empty string if the given mainType is undefined', () => {
      const mainType = undefined;

      expect(humanizeMainType(mainType)).to.equal('');
    });

    it('should return the given mainType if it is not included in PURPOSE_MAIN_TYPES', () => {
      const mainType = 'unknown-mainType';

      expect(humanizeMainType(mainType)).to.equal(mainType);
    });

    it('should return included mainType from RESOURCE_TYPES', () => {
      const validType = Object.keys(PURPOSE_MAIN_TYPES)[0];
      const mainType = validType;
      const expected = PURPOSE_MAIN_TYPES[validType];

      expect(humanizeMainType(mainType)).to.equal(expected);
    });
  });

  describe('pickSupportedFilters', () => {
    it('should only return supported filters', () => {
      const filters = {
        purpose: 'some-purpose',
        search: 'search-query',
        unsupported: 'invalid',
      };
      const expected = {
        purpose: 'some-purpose',
        search: 'search-query',
      };

      expect(pickSupportedFilters(filters)).to.deep.equal(expected);
    });
  });
});
