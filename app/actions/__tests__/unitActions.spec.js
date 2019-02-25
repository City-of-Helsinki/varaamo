import { expect } from 'chai';
import simple from 'simple-mock';

import * as apiUtils from 'utils/apiUtils';
import { fetchUnits } from 'actions/unitActions';
import types from 'constants/ActionTypes';

describe('Actions: unitActions', () => {
  let getRequestTypeDescriptorMock;
  let buildAPIUrlMock;

  beforeEach(() => {
    getRequestTypeDescriptorMock = simple.mock(apiUtils, 'getRequestTypeDescriptor');
    buildAPIUrlMock = simple.mock(apiUtils, 'buildAPIUrl');
  });

  describe.only('fetchUnit', () => {
    it('includes correct type', () => {
      fetchUnits();
      expect(getRequestTypeDescriptorMock.lastCall.args[0]).to.equal(
          types.API.UNITS_GET_REQUEST
        );
    });

    it('that has resources as default in query', () => {
      fetchUnits();
      expect(buildAPIUrlMock.lastCall.args[1].unit_has_resource).to.be.true;
    });
  });
});
