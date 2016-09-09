import { expect } from 'chai';
import simple from 'simple-mock';

import { getPiwikActionName, searchResources } from 'actions/searchActions';
import * as apiUtils from 'utils/APIUtils';

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

      it('returns searchParams.search', () => {
        expect(getPiwikActionName(searchParams)).to.equal(searchParams.search);
      });
    });

    describe('when searchParams.search is an empty string', () => {
      describe('when searchParams.purpose exists', () => {
        const searchParams = {
          search: '',
          purpose: 'some purpose',
        };

        it('returns text "category:" with searchParams.purpose', () => {
          const expected = `category: ${searchParams.purpose}`;
          expect(getPiwikActionName(searchParams)).to.equal(expected);
        });
      });

      describe('when searchParams.purpose does not exist', () => {
        const searchParams = {
          search: '',
          purpose: '',
        };

        it('returns text "-empty-search-"', () => {
          expect(getPiwikActionName(searchParams)).to.equal('-empty-search-');
        });
      });
    });
  });

  describe('searchResources', () => {
    it('includes correct track in meta', () => {
      const params = { search: 'searchText' };
      searchResources(params);
      expect(getRequestTypeDescriptorMock.lastCall.args[1].meta.track).to.deep.equal({
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
