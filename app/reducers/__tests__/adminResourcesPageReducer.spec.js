import { expect } from 'chai';

import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import adminResourcesPageReducer from 'reducers/adminResourcesPageReducer';

describe('Reducer: adminResourcesPageReducer', () => {
  describe('initial state', () => {
    const initialState = adminResourcesPageReducer(undefined, {});

    it('resourceIds should be an empty array', () => {
      expect(initialState.resourceIds).to.deep.equal([]);
    });
  });

  describe('handling actions', () => {
    describe('API.RESOURCES_GET_SUCCESS', () => {
      const getResourceSuccess = createAction(
        types.API.RESOURCES_GET_SUCCESS,
        payload => payload,
        (payload, meta) => meta
      );

      describe('with correct meta source', () => {
        let action;

        before(() => {
          action = getResourceSuccess(
            {
              entities: {
                resources: {
                  resourceId1: { id: 'resourceId1' },
                  resourceId2: { id: 'resourceId2' },
                  resourceId3: { id: 'resourceId3' },
                },
              },
            },
            { source: 'adminResourcesPage' }
          );
        });

        it('adds resources ids from action', () => {
          const initialState = Immutable({
            resourceIds: [],
          });
          const nextState = adminResourcesPageReducer(initialState, action);
          expect(nextState.resourceIds).to.deep.equal([
            'resourceId1',
            'resourceId2',
            'resourceId3',
          ]);
        });

        it('overrides resources ids from action', () => {
          const initialState = Immutable({
            resourceIds: ['1', '2', '3'],
          });
          const nextState = adminResourcesPageReducer(initialState, action);
          expect(nextState.resourceIds).to.deep.equal([
            'resourceId1',
            'resourceId2',
            'resourceId3',
          ]);
        });
      });
      describe('with incorrect meta source', () => {
        let action;

        before(() => {
          action = getResourceSuccess({
            entities: {
              resources: {
                resourceId1: { id: 'resourceId1' },
                resourceId2: { id: 'resourceId2' },
                resourceId3: { id: 'resourceId3' },
              },
            },
          });
        });

        it('does not add resources ids to state if meta source is not adminResourcesPage', () => {
          const initialState = Immutable({
            resourceIds: [],
          });
          const nextState = adminResourcesPageReducer(initialState, action);

          expect(nextState.resourceIds).to.deep.equal([]);
        });
      });
    });
  });
});
