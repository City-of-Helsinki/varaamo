import { expect } from 'chai';
import simple from 'simple-mock';

import apiUtils from 'utils/APIUtils';
import userActions from 'actions/userActions';

describe('Actions: userActions', () => {
  let getRequestTypeDescriptorMock;
  beforeEach(() => {
    getRequestTypeDescriptorMock = simple.mock(apiUtils, 'getRequestTypeDescriptor');
  });

  describe('fetchUser', () => {
    it('includes correct track in meta', () => {
      const id = '1234qwert';
      userActions.fetchUser(id);
      expect(getRequestTypeDescriptorMock.lastCall.args[1].meta.track).to.deep.equal({
        event: 'trackEvent',
        args: [
          'User',
          'get',
          id,
        ],
      });
    });
  });
});
