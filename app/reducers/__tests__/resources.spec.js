import { expect } from 'chai';

import _ from 'lodash';
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import * as types from 'constants/ActionTypes';
import Resource from 'fixtures/Resource';
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
        const resource = Resource.build();

        const initialState = Immutable({});
        const expectedState = Immutable({ [resource.id]: resource });

        const action = fetchResourceSuccess(resource);
        const nextState = reducer(initialState, action);

        expect(nextState).to.deep.equal(expectedState);
      });

      it('should not remove other resources from the state', () => {
        const resources = [
          Resource.build(),
          Resource.build(),
        ];

        const initialState = Immutable({
          [resources[0].id]: resources[0],
        });
        const expectedState = Immutable({
          [resources[0].id]: resources[0],
          [resources[1].id]: resources[1],
        });

        const action = fetchResourceSuccess(resources[1]);
        const nextState = reducer(initialState, action);

        expect(nextState).to.deep.equal(expectedState);
      });

      it('should overwrite previous resource with the same id', () => {
        const resources = [
          Resource.build({ id: 'r-1' }),
          Resource.build({ id: 'r-1' }),
        ];

        const initialState = Immutable({
          [resources[0].id]: resources[0],
        });
        const expectedState = Immutable({
          [resources[1].id]: resources[1],
        });

        const action = fetchResourceSuccess(resources[1]);
        const nextState = reducer(initialState, action);

        expect(nextState).to.deep.equal(expectedState);
      });
    });

    describe('FETCH_RESOURCES_SUCCESS', () => {
      const fetchResourcesSuccess = createAction(
        types.FETCH_RESOURCES_SUCCESS,
        (resources) => {
          return {
            entities: { resources },
            result: _.pluck(resources, 'id'),
          };
        }
      );

      it('should index the given resources by id and add them to state', () => {
        const resources = [
          Resource.build(),
          Resource.build(),
        ];

        const initialState = Immutable({});
        const expectedState = Immutable({
          [resources[0].id]: resources[0],
          [resources[1].id]: resources[1],
        });

        const action = fetchResourcesSuccess(resources);
        const nextState = reducer(initialState, action);

        expect(nextState).to.deep.equal(expectedState);
      });

      it('should not remove previous resources from the state', () => {
        const resources = [
          Resource.build(),
          Resource.build(),
        ];

        const initialState = Immutable({
          [resources[0].id]: resources[0],
        });
        const expectedState = Immutable({
          [resources[0].id]: resources[0],
          [resources[1].id]: resources[1],
        });

        const action = fetchResourcesSuccess([resources[1]]);
        const nextState = reducer(initialState, action);

        expect(nextState).to.deep.equal(expectedState);
      });

      it('should overwrite previous resources with the same id', () => {
        const resources = [
          Resource.build({ id: 'r-1' }),
          Resource.build({ id: 'r-1' }),
        ];

        const initialState = Immutable({
          [resources[0].id]: resources[0],
        });
        const expectedState = Immutable({
          [resources[1].id]: resources[1],
        });

        const action = fetchResourcesSuccess([resources[1]]);
        const nextState = reducer(initialState, action);

        expect(nextState).to.deep.equal(expectedState);
      });
    });
  });
});
