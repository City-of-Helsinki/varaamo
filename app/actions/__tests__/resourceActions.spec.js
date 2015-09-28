import {expect} from 'chai';

import * as actions from 'actions/resourceActions';
import * as types from 'constants/ActionTypes';

describe('ActionCreators: resourceActions', () => {
  describe('fetchResourceStart', () => {
    let action;

    beforeEach(() => {
      action = actions.fetchResourceStart();
    });

    it('should create an action with type FETCH_RESOURCE_START', () => {
      expect(action.type).to.equal(types.FETCH_RESOURCE_START);
    });

    it('should create an action without payload', () => {
      expect(action.payload).to.be.undefined;
    });
  });

  describe('fetchResourceSuccess', () => {
    let action;
    const resource = {id: 'r-1', name: 'Some resource'};

    beforeEach(() => {
      action = actions.fetchResourceSuccess(resource);
    });

    it('should create an action with type FETCH_RESOURCE_SUCCESS', () => {
      expect(action.type).to.equal(types.FETCH_RESOURCE_SUCCESS);
    });

    it('should create an action with given resource in the payload', () => {
      expect(action.payload.resource).to.deep.equal(resource);
    });
  });

  describe('fetchResourcesStart', () => {
    let action;

    beforeEach(() => {
      action = actions.fetchResourcesStart();
    });

    it('should create an action with type FETCH_RESOURCES_START', () => {
      expect(action.type).to.equal(types.FETCH_RESOURCES_START);
    });

    it('should create an action without payload', () => {
      expect(action.payload).to.be.undefined;
    });
  });

  describe('fetchResourcesSuccess', () => {
    let action;
    const resources = [1, 2, 3];

    beforeEach(() => {
      action = actions.fetchResourcesSuccess(resources);
    });

    it('should create an action with type FETCH_RESOURCES_SUCCESS', () => {
      expect(action.type).to.equal(types.FETCH_RESOURCES_SUCCESS);
    });

    it('should create an action with given resources in the payload', () => {
      expect(action.payload.resources).to.deep.equal(resources);
    });
  });
});
