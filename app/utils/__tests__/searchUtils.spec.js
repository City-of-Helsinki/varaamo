import { expect } from 'chai';

import {
  getFetchParamsFromFilters,
  pickSupportedFilters,
} from 'utils/searchUtils';
import { getDateStartAndEndTimes } from 'utils/timeUtils';

describe('Utils: searchUtils', () => {
  describe('getFetchParamsFromFilters', () => {
    const filters = {
      date: '2015-10-10',
      purpose: 'some-purpose',
      search: 'search-query',
      unsupported: 'filter',
    };

    it('changes date to end and start', () => {
      const params = getFetchParamsFromFilters(filters);
      const { start, end } = getDateStartAndEndTimes(filters.date);

      expect(params.start).to.equal(start);
      expect(params.end).to.equal(end);
    });

    it('does not return date', () => {
      const params = getFetchParamsFromFilters(filters);
      expect(params.date).to.not.exist;
    });

    it('returns only supported filters beside end and start', () => {
      const params = getFetchParamsFromFilters(filters);
      expect(params.purpose).to.equal(filters.purpose);
      expect(params.search).to.equal(filters.search);
      expect(params.unsupported).to.not.exist;
    });

    it('returns purpose as empty string if filters.purpose is "all"', () => {
      const params = getFetchParamsFromFilters({ purpose: 'all' });
      expect(params.purpose).to.equal('');
    });
  });

  describe('pickSupportedFilters', () => {
    it('returns only supported filters', () => {
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
