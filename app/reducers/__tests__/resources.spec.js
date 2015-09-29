import chai, {expect} from 'chai';
import chaiImmutable from 'chai-immutable';

import {fromJS, Map} from 'immutable';
import {createAction} from 'redux-actions';

import * as types from 'constants/ActionTypes';
import {resourcesReducer as reducer} from 'reducers/resources';

chai.use(chaiImmutable);

describe('Reducer: resourcesReducer', () => {
  describe('initial state', () => {
    it('should be an empty Map', () => {
      const expected = Map();
      expect(reducer(undefined, {})).to.equal(expected);
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
        const initialState = Map();
        const resource = {id: 'r-1', name: 'some resource'};
        const expectedState = fromJS({
          'r-1': {id: 'r-1', name: 'some resource'},
        });
        const action = fetchResourceSuccess(resource);

        expect(reducer(initialState, action)).to.equal(expectedState);
      });

      it('should not remove other resources from the state', () => {
        const initialState = fromJS({
          'r-1': {id: 'r-1', name: 'some resource'},
          'r-2': {id: 'r-2', name: 'other resource'},
        });
        const resource = {id: 'r-3', name: 'new resource'};
        const expectedState = fromJS({
          'r-1': {id: 'r-1', name: 'some resource'},
          'r-2': {id: 'r-2', name: 'other resource'},
          'r-3': {id: 'r-3', name: 'new resource'},
        });
        const action = fetchResourceSuccess(resource);

        expect(reducer(initialState, action)).to.equal(expectedState);
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
        const initialState = fromJS({'r-1': previousResource});
        const expectedState = fromJS({'r-1': resource});
        const action = fetchResourceSuccess(resource);

        expect(reducer(initialState, action)).to.equal(expectedState);
      });
    });

    describe('FETCH_RESOURCES_SUCCESS', () => {
      const fetchResourcesSuccess = createAction(types.FETCH_RESOURCES_SUCCESS);

      it('should return the state as Map', () => {
        const resources = [
          {id: 'r-1', name: 'some resource'},
        ];
        const initialState = Map();
        const action = fetchResourcesSuccess(resources);
        const state = reducer(initialState, action);

        expect(Map.isMap(state)).to.be.true;
      });

      it('should save resources as Maps', () => {
        const resources = [
          {id: 'r-1', name: 'some resource'},
        ];
        const initialState = Map();
        const action = fetchResourcesSuccess(resources);
        const state = reducer(initialState, action);

        expect(Map.isMap(state.get('r-1'))).to.be.true;
      });

      it('should index the given resources by id and add them to state', () => {
        const resources = [
          {id: 'r-1', name: 'some resource'},
          {id: 'r-2', name: 'other resource'},
        ];
        const initialState = Map();
        const expectedState = Map({
          'r-1': Map(resources[0]),
          'r-2': Map(resources[1]),
        });
        const action = fetchResourcesSuccess(resources);

        expect(reducer(initialState, action)).to.equal(expectedState);
      });

      it('should not remove previous resources from the state', () => {
        const resources = [
          {id: 'r-1', name: 'some resource'},
          {id: 'r-2', name: 'other resource'},
        ];
        const previousResource = {id: 'r-3', name: 'previous resource'};
        const initialState = Map({
          'r-3': Map({previousResource}),
        });
        const expectedState = Map({
          'r-1': Map(resources[0]),
          'r-2': Map(resources[1]),
          'r-3': Map({previousResource}),
        });
        const action = fetchResourcesSuccess(resources);

        expect(reducer(initialState, action)).to.equal(expectedState);
      });

      it('should overwrite previous resources with the same id', () => {
        const resources = [
          {id: 'r-1', name: 'some resource'},
          {id: 'r-2', name: 'other resource'},
        ];
        const previousResource = {id: 'r-1', name: 'old name'};
        const initialState = Map({
          'r-1': Map({previousResource}),
        });
        const expectedState = Map({
          'r-1': Map(resources[0]),
          'r-2': Map(resources[1]),
        });
        const action = fetchResourcesSuccess(resources);

        expect(reducer(initialState, action)).to.equal(expectedState);
      });
    });
  });
});
