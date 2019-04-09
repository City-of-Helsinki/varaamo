import simple from 'simple-mock';

import { getPiwikActionName, searchResources } from 'actions/searchActions';
import * as apiUtils from 'utils/apiUtils';

describe('Actions: searchActions', () => {
  let getRequestTypeDescriptorMock;
  beforeEach(() => {
    getRequestTypeDescriptorMock = simple.mock(apiUtils, 'getRequestTypeDescriptor');
  });

  describe('getPiwikActionName', () => {
    describe('when searchParams.search is non-empty string', () => {
      const searchParams = {
        search: 'my search',
        purpose: 'some purpose',
      };

      test('returns searchParams.search', () => {
        expect(getPiwikActionName(searchParams)).toBe(searchParams.search);
      });
    });

    describe('when searchParams.search is an empty string', () => {
      describe('when searchParams.purpose exists', () => {
        const searchParams = {
          search: '',
          purpose: 'some purpose',
        };

        test('returns text "category:" with searchParams.purpose', () => {
          const expected = `category: ${searchParams.purpose}`;
          expect(getPiwikActionName(searchParams)).toBe(expected);
        });
      });

      describe('when searchParams.purpose does not exist', () => {
        const searchParams = {
          search: '',
          purpose: '',
        };

        test('returns text "-empty-search-"', () => {
          expect(getPiwikActionName(searchParams)).toBe('-empty-search-');
        });
      });
    });
  });

  describe('searchResources', () => {
    test('includes correct track in meta', () => {
      const params = { search: 'searchText' };
      searchResources(params);
      expect(getRequestTypeDescriptorMock.lastCall.args[1].meta.track).toEqual({
        event: 'trackEvent',
        args: [
          'Search',
          'search-get',
          'searchText',
        ],
      });
    });
  });
});
