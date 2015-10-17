import { expect } from 'chai';

import { pickSupportedFilters } from 'utils/SearchUtils';

describe('Utils: SearchUtils', () => {
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
