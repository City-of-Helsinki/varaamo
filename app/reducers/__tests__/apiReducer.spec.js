import { expect } from 'chai';

import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import * as types from 'constants/ActionTypes';
import { apiReducer as reducer } from 'reducers/apiReducer';

describe('Reducer: apiReducer', () => {
  describe('initial state', () => {
    const initialState = reducer(undefined, {});

    it('isFetchingSearchResults should be false', () => {
      expect(initialState.isFetchingSearchResults).to.equal(false);
    });

    it('shouldFetchSearchResults should be true', () => {
      expect(initialState.shouldFetchSearchResults).to.equal(true);
    });

    it('shouldFetchUnits should be true', () => {
      expect(initialState.shouldFetchUnits).to.equal(true);
    });
  });

  describe('handling actions', () => {
    describe('FETCH_RESOURCES_START', () => {
      const fetchResourcesStart = createAction(types.FETCH_RESOURCES_START);

      it('should set isFetchingSearchResults to true', () => {
        const action = fetchResourcesStart();
        const initialState = Immutable({ isFetchingSearchResults: false });
        const nextState = reducer(initialState, action);

        expect(nextState.isFetchingSearchResults).to.equal(true);
      });
    });

    describe('FETCH_RESOURCES_SUCCESS', () => {
      const fetchResourcesSuccess = createAction(types.FETCH_RESOURCES_SUCCESS);

      it('should set isFetchingSearchResults to false', () => {
        const action = fetchResourcesSuccess();
        const initialState = Immutable({ isFetchingSearchResults: true });
        const nextState = reducer(initialState, action);

        expect(nextState.isFetchingSearchResults).to.equal(false);
      });

      it('should set shouldFetchSearchResults to false', () => {
        const action = fetchResourcesSuccess();
        const initialState = Immutable({ shouldFetchSearchResults: true });
        const nextState = reducer(initialState, action);

        expect(nextState.shouldFetchSearchResults).to.equal(false);
      });
    });

    describe('FETCH_UNITS_SUCCESS', () => {
      const fetchUnitsSuccess = createAction(types.FETCH_UNITS_SUCCESS);

      it('should set shouldFetchUnits to false', () => {
        const action = fetchUnitsSuccess();
        const initialState = Immutable({ shouldFetchUnits: true });
        const nextState = reducer(initialState, action);

        expect(nextState.shouldFetchUnits).to.equal(false);
      });
    });
  });
});
