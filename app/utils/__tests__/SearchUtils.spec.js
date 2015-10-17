import { expect } from 'chai';

import {
  getFetchParamsFromFilters,
  pickSupportedFilters,
} from 'utils/SearchUtils';
import { getDateStartAndEndTimes } from 'utils/TimeUtils';

describe('Utils: SearchUtils', () => {
  describe('getFetchParamsFromFilters', () => {
    const filters = {
      date: '2015-10-10',
      purpose: 'some-purpose',
      search: 'search-query',
      unsupported: 'filter',
    };
    const params = getFetchParamsFromFilters(filters);

    it('should change date to end and start', () => {
      const { start, end } = getDateStartAndEndTimes(filters.date);

      expect(params.start).to.equal(start);
      expect(params.end).to.equal(end);
    });

    it('should not return date', () => {
      expect(params.date).to.not.exist;
    });

    it('should only return supported filters beside end and start', () => {
      expect(params.purpose).to.equal(filters.purpose);
      expect(params.search).to.equal(filters.search);
      expect(params.unsupported).to.not.exist;
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
