import { expect } from 'chai';

import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
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

    it('pendingReservationsCount should be 0', () => {
      expect(initialState.pendingReservationsCount).to.equal(0);
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
    describe('API.FETCH_PURPOSES_START', () => {
      const fetchPurposesStart = createAction(types.API.FETCH_PURPOSES_START);

      it('should set isFetchingPurposes to true', () => {
        const action = fetchPurposesStart();
        const initialState = Immutable({ isFetchingPurposes: false });
        const nextState = reducer(initialState, action);

        expect(nextState.isFetchingPurposes).to.equal(true);
      });
    });

    describe('API.FETCH_PURPOSES_SUCCESS', () => {
      const fetchPurposesSuccess = createAction(types.API.FETCH_PURPOSES_SUCCESS);

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

    describe('API.FETCH_RESOURCE_START', () => {
      const fetchResourceStart = createAction(types.API.FETCH_RESOURCE_START);

      it('should set isFetchingResource to true', () => {
        const action = fetchResourceStart();
        const initialState = Immutable({ isFetchingResource: false });
        const nextState = reducer(initialState, action);

        expect(nextState.isFetchingResource).to.equal(true);
      });
    });

    describe('API.FETCH_RESOURCE_SUCCESS', () => {
      const fetchResourceSuccess = createAction(types.API.FETCH_RESOURCE_SUCCESS);

      it('should set isFetchingResource to false', () => {
        const action = fetchResourceSuccess();
        const initialState = Immutable({ isFetchingResource: true });
        const nextState = reducer(initialState, action);

        expect(nextState.isFetchingResource).to.equal(false);
      });
    });

    describe('API.FETCH_RESOURCE_ERROR', () => {
      const fetchResourceError = createAction(types.API.FETCH_RESOURCE_ERROR);

      it('should set isFetchingResource to false', () => {
        const action = fetchResourceError();
        const initialState = Immutable({ isFetchingResource: true });
        const nextState = reducer(initialState, action);

        expect(nextState.isFetchingResource).to.equal(false);
      });
    });


    describe('API.FETCH_RESOURCES_START', () => {
      const fetchResourcesStart = createAction(types.API.FETCH_RESOURCES_START);

      it('should set isFetchingSearchResults to true', () => {
        const action = fetchResourcesStart();
        const initialState = Immutable({ isFetchingSearchResults: false });
        const nextState = reducer(initialState, action);

        expect(nextState.isFetchingSearchResults).to.equal(true);
      });
    });

    describe('API.FETCH_RESOURCES_SUCCESS', () => {
      const fetchResourcesSuccess = createAction(types.API.FETCH_RESOURCES_SUCCESS);

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

    describe('API.FETCH_UNITS_SUCCESS', () => {
      const fetchUnitsSuccess = createAction(types.API.FETCH_UNITS_SUCCESS);

      it('should set shouldFetchUnits to false', () => {
        const action = fetchUnitsSuccess();
        const initialState = Immutable({ shouldFetchUnits: true });
        const nextState = reducer(initialState, action);

        expect(nextState.shouldFetchUnits).to.equal(false);
      });
    });

    describe('API.MAKE_RESERVATION_START', () => {
      const makeReservationStart = createAction(types.API.MAKE_RESERVATION_START);

      it('should increment pendingReservationsCount by one', () => {
        const action = makeReservationStart();
        const initialState = Immutable({ pendingReservationsCount: 0 });
        const nextState = reducer(initialState, action);

        expect(nextState.pendingReservationsCount).to.equal(1);
      });
    });

    describe('API.MAKE_RESERVATION_SUCCESS', () => {
      const makeReservationSuccess = createAction(types.API.MAKE_RESERVATION_SUCCESS);

      it('should decrement pendingReservationsCount by one', () => {
        const action = makeReservationSuccess();
        const initialState = Immutable({ pendingReservationsCount: 2 });
        const nextState = reducer(initialState, action);

        expect(nextState.pendingReservationsCount).to.equal(1);
      });
    });

    describe('API.MAKE_RESERVATION_ERROR', () => {
      const makeReservationError = createAction(types.API.MAKE_RESERVATION_ERROR);

      it('should decrement pendingReservationsCount by one', () => {
        const action = makeReservationError();
        const initialState = Immutable({ pendingReservationsCount: 2 });
        const nextState = reducer(initialState, action);

        expect(nextState.pendingReservationsCount).to.equal(1);
      });
    });

    describe('UI.CHANGE_SEARCH_FILTERS', () => {
      const changeSearchFilters = createAction(types.UI.CHANGE_SEARCH_FILTERS);

      it('should set shouldFetchSearchResults to true', () => {
        const action = changeSearchFilters('some-filter');
        const initialState = Immutable({ shouldFetchSearchResults: false });
        const nextState = reducer(initialState, action);

        expect(nextState.shouldFetchSearchResults).to.equal(true);
      });
    });
  });
});
