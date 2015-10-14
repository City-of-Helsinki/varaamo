import { expect } from 'chai';

import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import * as types from 'constants/ActionTypes';
import { apiReducer as reducer } from 'reducers/apiReducer';

describe('Reducer: apiReducer', () => {
  describe('initial state', () => {
    const initialState = reducer(undefined, {});

    it('isFetchingPurposes should be false', () => {
      expect(initialState.isFetchingPurposes).to.equal(false);
    });

    it('isFetchingResource should be false', () => {
      expect(initialState.isFetchingResource).to.equal(false);
    });

    it('isFetchingSearchResults should be false', () => {
      expect(initialState.isFetchingSearchResults).to.equal(false);
    });

    it('isMakingReservation should be false', () => {
      expect(initialState.isMakingReservation).to.equal(false);
    });

    it('shouldFetchPurposes should be true', () => {
      expect(initialState.shouldFetchPurposes).to.equal(true);
    });

    it('shouldFetchSearchResults should be true', () => {
      expect(initialState.shouldFetchSearchResults).to.equal(true);
    });

    it('shouldFetchUnits should be true', () => {
      expect(initialState.shouldFetchUnits).to.equal(true);
    });
  });

  describe('handling actions', () => {
    describe('CHANGE_SEARCH_FILTERS', () => {
      const changeSearchFilters = createAction(types.CHANGE_SEARCH_FILTERS);

      it('should set shouldFetchSearchResults to true', () => {
        const action = changeSearchFilters('some-filter');
        const initialState = Immutable({ shouldFetchSearchResults: false });
        const nextState = reducer(initialState, action);

        expect(nextState.shouldFetchSearchResults).to.equal(true);
      });
    });

    describe('FETCH_PURPOSES_START', () => {
      const fetchPurposesStart = createAction(types.FETCH_PURPOSES_START);

      it('should set isFetchingPurposes to true', () => {
        const action = fetchPurposesStart();
        const initialState = Immutable({ isFetchingPurposes: false });
        const nextState = reducer(initialState, action);

        expect(nextState.isFetchingPurposes).to.equal(true);
      });
    });

    describe('FETCH_PURPOSES_SUCCESS', () => {
      const fetchPurposesSuccess = createAction(types.FETCH_PURPOSES_SUCCESS);

      it('should set isFetchingPurposes to false', () => {
        const action = fetchPurposesSuccess();
        const initialState = Immutable({ isFetchingPurposes: true });
        const nextState = reducer(initialState, action);

        expect(nextState.isFetchingPurposes).to.equal(false);
      });

      it('should set shouldFetchPurposes to false', () => {
        const action = fetchPurposesSuccess();
        const initialState = Immutable({ shouldFetchPurposes: true });
        const nextState = reducer(initialState, action);

        expect(nextState.shouldFetchPurposes).to.equal(false);
      });
    });

    describe('FETCH_RESOURCE_START', () => {
      const fetchResourceStart = createAction(types.FETCH_RESOURCE_START);

      it('should set isFetchingResource to true', () => {
        const action = fetchResourceStart();
        const initialState = Immutable({ isFetchingResource: false });
        const nextState = reducer(initialState, action);

        expect(nextState.isFetchingResource).to.equal(true);
      });
    });

    describe('FETCH_RESOURCE_SUCCESS', () => {
      const fetchResourceSuccess = createAction(types.FETCH_RESOURCE_SUCCESS);

      it('should set isFetchingResource to false', () => {
        const action = fetchResourceSuccess();
        const initialState = Immutable({ isFetchingResource: true });
        const nextState = reducer(initialState, action);

        expect(nextState.isFetchingResource).to.equal(false);
      });
    });

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

    describe('MAKE_RESERVATION_START', () => {
      const makeReservationStart = createAction(types.MAKE_RESERVATION_START);

      it('should set isMakingReservation to true', () => {
        const action = makeReservationStart();
        const initialState = Immutable({ isMakingReservation: false });
        const nextState = reducer(initialState, action);

        expect(nextState.isMakingReservation).to.equal(true);
      });
    });

    describe('MAKE_RESERVATION_SUCCESS', () => {
      const makeReservationSuccess = createAction(types.MAKE_RESERVATION_SUCCESS);

      it('should set isMakingReservation to false', () => {
        const action = makeReservationSuccess();
        const initialState = Immutable({ isMakingReservation: true });
        const nextState = reducer(initialState, action);

        expect(nextState.isMakingReservation).to.equal(false);
      });
    });
  });
});
