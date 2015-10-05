import { expect } from 'chai';

import _ from 'lodash';
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import * as types from 'constants/ActionTypes';
import Resource from 'fixtures/Resource';
import { searchReducer as reducer } from 'reducers/search';

describe('Reducer: searchReducer', () => {
  describe('initial state', () => {
    let initialState;

    before(() => {
      initialState = reducer(undefined, {});
    });

    it('category should be "all"', () => {
      expect(initialState.category).to.equal('all');
    });

    describe('searchResults', () => {
      let searchResults;

      before(() => {
        searchResults = initialState.searchResults;
      });

      it('should be an object', () => {
        expect(typeof searchResults).to.equal('object');
      });

      it('searchResults.ids should be an empty array', () => {
        expect(searchResults.ids).to.deep.equal([]);
      });

      it('searchResults.isFetching should be false', () => {
        expect(searchResults.isFetching).to.be.false;
      });

      it('searchResults.shouldFetch should be true', () => {
        expect(searchResults.shouldFetch).to.be.true;
      });
    });
  });

  describe('handling actions', () => {
    describe('FETCH_RESOURCES_START', () => {
      const fetchResourcesStart = createAction(types.FETCH_RESOURCES_START);

      it('should set searchResults.isFetching to true', () => {
        const action = fetchResourcesStart();
        const initialState = Immutable({
          searchResults: {
            isFetching: false,
            ids: [],
          },
        });
        const nextState = reducer(initialState, action);

        expect(nextState.searchResults.isFetching).to.be.true;
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

      it('should set searchResults.isFetching to false', () => {
        const action = fetchResourcesSuccess(resources);
        const initialState = Immutable({
          searchResults: {
            isFetching: true,
            ids: [],
          },
        });
        const nextState = reducer(initialState, action);

        expect(nextState.searchResults.isFetching).to.be.false;
      });

      it('should set searchResults.shouldFetch to false', () => {
        const action = fetchResourcesSuccess(resources);
        const initialState = Immutable({
          searchResults: {
            ids: [],
            isFetching: true,
            shouldFetch: true,
          },
        });
        const nextState = reducer(initialState, action);

        expect(nextState.searchResults.shouldFetch).to.be.false;
      });

      it('should set the given resource ids to searchResults.ids', () => {
        const action = fetchResourcesSuccess(resources);
        const initialState = Immutable({
          searchResults: {
            isFetching: true,
            ids: [],
          },
        });
        const expectedIds = [resources[0].id, resources[1].id];
        const nextState = reducer(initialState, action);

        expect(nextState.searchResults.ids).to.deep.equal(expectedIds);
      });

      it('should replace the old ids in searchResults.ids', () => {
        const action = fetchResourcesSuccess(resources);
        const initialState = Immutable({
          searchResults: {
            isFetching: true,
            ids: ['replace-this'],
          },
        });
        const expectedIds = [resources[0].id, resources[1].id];
        const nextState = reducer(initialState, action);

        expect(nextState.searchResults.ids).to.deep.equal(expectedIds);
      });
    });
  });
});
