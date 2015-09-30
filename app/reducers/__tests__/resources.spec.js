import { expect } from 'chai';

import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import * as types from 'constants/ActionTypes';
import { resourcesReducer as reducer } from 'reducers/resources';

describe('Reducer: resourcesReducer', () => {
  describe('initial state', () => {
    it('should be an empty object', () => {
      const initialState = reducer(undefined, {});
      expect(initialState).to.deep.equal({});
    });
  });

  describe('handling actions', () => {
    describe('FETCH_RESOURCE_SUCCESS', () => {
      const fetchResourceSuccess = createAction(
        types.FETCH_RESOURCE_SUCCESS,
        (resource) => {
          return {
            entities: {
              resources: {
                [resource.id]: resource,
              },
            },
          };
        }
      );

      it('should index the given resource by id and add it to state', () => {
        const initialState = Immutable({});
        const resource = { id: 'r-1', name: 'some resource' };
        const expectedState = Immutable({ 'r-1': resource });
        const action = fetchResourceSuccess(resource);

        expect(reducer(initialState, action)).to.deep.equal(expectedState);
      });

      it('should not remove other resources from the state', () => {
        const initialState = Immutable({
          'r-1': { id: 'r-1', name: 'some resource' },
          'r-2': { id: 'r-2', name: 'other resource' },
        });
        const resource = { id: 'r-3', name: 'new resource' };
        const expectedState = Immutable({
          'r-1': { id: 'r-1', name: 'some resource' },
          'r-2': { id: 'r-2', name: 'other resource' },
          'r-3': { id: 'r-3', name: 'new resource' },
        });
        const action = fetchResourceSuccess(resource);

        expect(reducer(initialState, action)).to.deep.equal(expectedState);
      });

      it('should overwrite previous resource with the same id', () => {
        const previousResource = {
          id: 'r-1',
          name: 'old name',
        };
        const resource = {
          id: 'r-1',
          name: 'some resource',
        };
        const initialState = Immutable({ 'r-1': previousResource });
        const expectedState = Immutable({ 'r-1': resource });
        const action = fetchResourceSuccess(resource);

        expect(reducer(initialState, action)).to.deep.equal(expectedState);
      });
    });

    describe('FETCH_RESOURCES_SUCCESS', () => {
      const fetchResourcesSuccess = createAction(types.FETCH_RESOURCES_SUCCESS);

      it('should index the given resources by id and add them to state', () => {
        const resources = [
          { id: 'r-1', name: 'some resource' },
          { id: 'r-2', name: 'other resource' },
        ];
        const initialState = Immutable({});
        const expectedState = Immutable({
          'r-1': resources[0],
          'r-2': resources[1],
        });
        const action = fetchResourcesSuccess(resources);

        expect(reducer(initialState, action)).to.deep.equal(expectedState);
      });

      it('should not remove previous resources from the state', () => {
        const resources = [
          { id: 'r-1', name: 'some resource' },
          { id: 'r-2', name: 'other resource' },
        ];
        const previousResource = { id: 'r-3', name: 'previous resource' };
        const initialState = Immutable({
          'r-3': previousResource,
        });
        const expectedState = Immutable({
          'r-1': resources[0],
          'r-2': resources[1],
          'r-3': previousResource,
        });
        const action = fetchResourcesSuccess(resources);

        expect(reducer(initialState, action)).to.deep.equal(expectedState);
      });

      it('should overwrite previous resources with the same id', () => {
        const resources = [
          { id: 'r-1', name: 'some resource' },
          { id: 'r-2', name: 'other resource' },
        ];
        const previousResource = { id: 'r-1', name: 'old name' };
        const initialState = Immutable({
          'r-1': previousResource,
        });
        const expectedState = Immutable({
          'r-1': resources[0],
          'r-2': resources[1],
        });
        const action = fetchResourcesSuccess(resources);

        expect(reducer(initialState, action)).to.deep.equal(expectedState);
      });
    });
  });
});
