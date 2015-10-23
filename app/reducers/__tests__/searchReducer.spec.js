import { expect } from 'chai';

import _ from 'lodash';
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import Resource from 'fixtures/Resource';
import { searchReducer as reducer } from 'reducers/searchReducer';

describe('Reducer: searchReducer', () => {
  describe('handling actions', () => {
    describe('API.RESOURCES_GET_SUCCESS', () => {
      const fetchResourcesSuccess = createAction(
        types.API.RESOURCES_GET_SUCCESS,
        (resources) => {
          return {
            entities: {
              resources: _.indexBy(resources, 'id'),
            },
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

    describe('UI.CHANGE_SEARCH_FILTERS', () => {
      const changeSearchFilters = createAction(types.UI.CHANGE_SEARCH_FILTERS);

      it('should set the given filters to filters', () => {
        const filters = { purpose: 'some-purpose' };
        const action = changeSearchFilters(filters);
        const initialState = Immutable({
          filters: {},
        });
        const expected = Immutable(filters);
        const nextState = reducer(initialState, action);

        expect(nextState.filters).to.deep.equal(expected);
      });

      it('should override previous values of same filters', () => {
        const filters = { purpose: 'some-purpose' };
        const action = changeSearchFilters(filters);
        const initialState = Immutable({
          filters: { purpose: 'old-value' },
        });
        const expected = Immutable(filters);
        const nextState = reducer(initialState, action);

        expect(nextState.filters).to.deep.equal(expected);
      });

      it('should not override unspecified filters', () => {
        const filters = { purpose: 'some-purpose' };
        const action = changeSearchFilters(filters);
        const initialState = Immutable({
          filters: { search: 'search-query' },
        });
        const expected = Immutable({
          purpose: 'some-purpose',
          search: 'search-query',
        });
        const nextState = reducer(initialState, action);

        expect(nextState.filters).to.deep.equal(expected);
      });

      it('should only save supported filters', () => {
        const filters = {
          purpose: 'some-purpose',
          search: 'search-query',
          unsupported: 'invalid',
        };
        const action = changeSearchFilters(filters);
        const initialState = Immutable({ filters: {} });
        const expected = Immutable({
          purpose: 'some-purpose',
          search: 'search-query',
        });
        const nextState = reducer(initialState, action);

        expect(nextState.filters).to.deep.equal(expected);
      });
    });
  });
});
