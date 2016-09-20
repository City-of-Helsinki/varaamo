import { expect } from 'chai';

import { getAddress, getAddressWithName } from 'utils/unitUtils';

describe('Utils: unitUtils', () => {
  describe('getAddress', () => {
    it('returns an empty string if given unit is undefined', () => {
      const unit = undefined;

      expect(getAddress(unit)).to.equal('');
    });

    it('returns an empty string if given unit is empty', () => {
      const unit = {};

      expect(getAddress(unit)).to.equal('');
    });

    it('returns the address in proper format', () => {
      const unit = {
        addressZip: '12345',
        municipality: 'Helsinki',
        streetAddress: { fi: 'Example street 3' },
      };
      const expected = 'Example street 3, 12345 Helsinki';

      expect(getAddress(unit)).to.equal(expected);
    });

    it('capitalizes the municipality', () => {
      const unit = {
        addressZip: '12345',
        municipality: 'espoo',
        streetAddress: { fi: 'Example street 3' },
      };
      const expected = 'Example street 3, 12345 Espoo';

      expect(getAddress(unit)).to.equal(expected);
    });
  });

  describe('getAddressWithName', () => {
    it('returns an empty string if given unit is undefined', () => {
      const unit = undefined;

      expect(getAddressWithName(unit)).to.equal('');
    });

    it('returns an empty string if given unit is empty', () => {
      const unit = {};

      expect(getAddressWithName(unit)).to.equal('');
    });

    it('returns the address with unit name in proper format', () => {
      const unit = {
        addressZip: '12345',
        name: { fi: 'Some Unit' },
        municipality: 'Helsinki',
        streetAddress: { fi: 'Example street 3' },
      };
      const expected = 'Some Unit, Example street 3, 12345 Helsinki';

      expect(getAddressWithName(unit)).to.equal(expected);
    });
  });
});
