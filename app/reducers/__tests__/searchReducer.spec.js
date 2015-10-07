import { expect } from 'chai';

import _ from 'lodash';
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import * as types from 'constants/ActionTypes';
import Resource from 'fixtures/Resource';
import { searchReducer as reducer } from 'reducers/searchReducer';

describe('Reducer: searchReducer', () => {
  describe('handling actions', () => {
    describe('CHANGE_PURPOSE_FILTER', () => {
      const changePurposeFilter = createAction(types.CHANGE_PURPOSE_FILTER);

      it('should set the given value to purposeFilter', () => {
        const value = 'some-purpose';
        const action = changePurposeFilter(value);
        const initialState = Immutable({
          purposeFilter: '',
        });
        const nextState = reducer(initialState, action);

        expect(nextState.purposeFilter).to.equal(value);
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
      const resources = [
        Resource.build(),
        Resource.build(),
      ];

      it('should set the given resource ids to results', () => {
        const action = fetchResourcesSuccess(resources);
        const initialState = Immutable({
          results: [],
        });
        const expected = [resources[0].id, resources[1].id];
        const nextState = reducer(initialState, action);

        expect(nextState.results).to.deep.equal(expected);
      });

      it('should replace the old ids in searchResults.ids', () => {
        const action = fetchResourcesSuccess(resources);
        const initialState = Immutable({
          results: ['replace-this'],
        });
        const expected = [resources[0].id, resources[1].id];
        const nextState = reducer(initialState, action);

        expect(nextState.results).to.deep.equal(expected);
      });
    });
  });
});
