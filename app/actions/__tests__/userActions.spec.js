import simple from 'simple-mock';

import * as apiUtils from 'utils/apiUtils';
import { fetchUser } from 'actions/userActions';

describe('Actions: userActions', () => {
  let getRequestTypeDescriptorMock;
  beforeEach(() => {
    getRequestTypeDescriptorMock = simple.mock(apiUtils, 'getRequestTypeDescriptor');
  });

  describe('fetchUser', () => {
    test('includes correct track in meta', () => {
      const id = '1234qwert';
      fetchUser(id);
      expect(getRequestTypeDescriptorMock.lastCall.args[1].meta.track).toEqual({
        event: 'trackEvent',
        args: [
          'User',
          'user-get',
          id,
        ],
      });
    });
  });
});
