import types from 'constants/ActionTypes';

import simple from 'simple-mock';

import * as apiUtils from 'utils/apiUtils';
import { fetchUnits } from 'actions/unitActions';

describe('Actions: unitActions', () => {
  let getRequestTypeDescriptorMock;
  let buildAPIUrlMock;

  beforeEach(() => {
    getRequestTypeDescriptorMock = simple.mock(apiUtils, 'getRequestTypeDescriptor');
    buildAPIUrlMock = simple.mock(apiUtils, 'buildAPIUrl');
  });

  afterEach(() => {
    simple.restore();
  });

  describe('fetchUnit', () => {
    test('includes correct type', () => {
      fetchUnits();
      expect(getRequestTypeDescriptorMock.lastCall.args[0]).toBe(types.API.UNITS_GET_REQUEST);
    });

    test('that has resources as default in query', () => {
      fetchUnits();
      expect(buildAPIUrlMock.lastCall.args[1].unit_has_resource).toBe(true);
    });
  });
});
