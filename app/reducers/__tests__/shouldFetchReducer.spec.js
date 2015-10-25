import { expect } from 'chai';

import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import shouldFetchReducer from 'reducers/shouldFetchReducer';

describe('Reducer: shouldFetchReducer', () => {
  describe('initial state', () => {
    const initialState = shouldFetchReducer(undefined, {});

    it('purposes should be true', () => {
      expect(initialState.purposes).to.equal(true);
    });

    it('resources should be true', () => {
      expect(initialState.resources).to.equal(true);
    });

    it('searchResults should be true', () => {
      expect(initialState.searchResults).to.equal(true);
    });

    it('units should be true', () => {
      expect(initialState.units).to.equal(true);
    });
  });

  describe('handling actions', () => {
    describe('API.PURPOSES_GET_SUCCESS', () => {
      const fetchPurposesSuccess = createAction(types.API.PURPOSES_GET_SUCCESS);

      it('should set purposes to false', () => {
        const action = fetchPurposesSuccess();
        const initialState = Immutable({ purposes: true });
        const nextState = shouldFetchReducer(initialState, action);

        expect(nextState.purposes).to.equal(false);
      });
    });

    describe('API.RESOURCES_GET_SUCCESS', () => {
      const fetchResourcesSuccess = createAction(types.API.RESOURCES_GET_SUCCESS);

      it('should set resources to false', () => {
        const action = fetchResourcesSuccess();
        const initialState = Immutable({ resources: true });
        const nextState = shouldFetchReducer(initialState, action);

        expect(nextState.resources).to.equal(false);
      });
    });

    describe('API.SEARCH_RESULTS_GET_SUCCESS', () => {
      const fetchResourcesSuccess = createAction(types.API.SEARCH_RESULTS_GET_SUCCESS);

      it('should set searchResults to false', () => {
        const action = fetchResourcesSuccess();
        const initialState = Immutable({ searchResults: true });
        const nextState = shouldFetchReducer(initialState, action);

        expect(nextState.searchResults).to.equal(false);
      });
    });

    describe('API.UNITS_GET_SUCCESS', () => {
      const fetchUnitsSuccess = createAction(types.API.UNITS_GET_SUCCESS);

      it('should set units to false', () => {
        const action = fetchUnitsSuccess();
        const initialState = Immutable({ units: true });
        const nextState = shouldFetchReducer(initialState, action);

        expect(nextState.units).to.equal(false);
      });
    });

    describe('UI.CHANGE_SEARCH_FILTERS', () => {
      const changeSearchFilters = createAction(types.UI.CHANGE_SEARCH_FILTERS);

      it('should set searchResults to true', () => {
        const action = changeSearchFilters('some-filter');
        const initialState = Immutable({ searchResults: false });
        const nextState = shouldFetchReducer(initialState, action);

        expect(nextState.searchResults).to.equal(true);
      });
    });
  });
});
