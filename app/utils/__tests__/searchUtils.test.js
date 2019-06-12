import {
  getFetchParamsFromFilters,
  pickSupportedFilters,
} from '../searchUtils';
import { getDateStartAndEndTimes } from '../timeUtils';

describe('Utils: searchUtils', () => {
  describe('getFetchParamsFromFilters', () => {
    const filters = {
      date: '2015-10-10',
      purpose: 'some-purpose',
      search: 'search-query',
      unsupported: 'filter',
    };

    test('changes date to end and start', () => {
      const params = getFetchParamsFromFilters(filters);
      const { start, end } = getDateStartAndEndTimes(filters.date);

      expect(params.start).toBe(start);
      expect(params.end).toBe(end);
    });

    test('does not return date', () => {
      const params = getFetchParamsFromFilters(filters);
      expect(params.date).toBeFalsy();
    });

    test('returns only supported filters beside end and start', () => {
      const params = getFetchParamsFromFilters(filters);
      expect(params.purpose).toBe(filters.purpose);
      expect(params.search).toBe(filters.search);
      expect(params.unsupported).toBeFalsy();
    });

    test('returns purpose as empty string if filters.purpose is "all"', () => {
      const params = getFetchParamsFromFilters({ purpose: 'all' });
      expect(params.purpose).toBe('');
    });
  });

  describe('pickSupportedFilters', () => {
    test('returns only supported filters', () => {
      const filters = {
        purpose: 'some-purpose',
        search: 'search-query',
        unsupported: 'invalid',
      };
      const expected = {
        purpose: 'some-purpose',
        search: 'search-query',
      };

      expect(pickSupportedFilters(filters)).toEqual(expected);
    });
  });
});
