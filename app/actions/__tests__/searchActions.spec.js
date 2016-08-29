import { expect } from 'chai';
import simple from 'simple-mock';

import searchActions from 'actions/searchActions';
import apiUtils from 'utils/APIUtils';

describe('Actions: searchActions', () => {
  let getRequestTypeDescriptorMock;
  beforeEach(() => {
    getRequestTypeDescriptorMock = simple.mock(apiUtils, 'getRequestTypeDescriptor');
  });

  describe('searchResources', () => {
    it('includes correct track in meta', () => {
      const params = { search: 'searchText' };
      searchActions.searchResources(params);
      expect(getRequestTypeDescriptorMock.lastCall.args[1].meta.track).to.deep.equal({
        event: 'trackEvent',
        args: [
          'Search',
          'searchText',
        ],
      });
    });
  });
});
