import { expect } from 'chai';

import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import apiReducer from 'reducers/apiReducer';

describe('Reducer: apiReducer', () => {
  describe('initial state', () => {
    const initialState = apiReducer(undefined, {});

    it('activeRequests should be an empty array', () => {
      expect(initialState.activeRequests).to.deep.equal([]);
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

  describe('handling API_ACTIONS', () => {
    const apiActionCreator = createAction(
      'REQUEST',
      () => {
        return {};
      },
      (metaData) => {
        return { API_ACTION: metaData };
      }
    );

    describe('actions that have meta.API_ACTIONS.apiRequestStart', () => {
      const action = apiActionCreator(
        { apiRequestStart: true, type: 'SOME_REQUEST' }
      );

      it('should add the meta.API_ACTIONS.type to activeRequests', () => {
        const initialState = Immutable({ activeRequests: [] });
        const nextState = apiReducer(initialState, action);
        const expected = Immutable({ activeRequests: ['SOME_REQUEST'] });

        expect(nextState).to.deep.equal(expected);
      });

      it('should not affect the existing activeRequests', () => {
        const initialState = Immutable({ activeRequests: ['OTHER_REQUEST'] });
        const nextState = apiReducer(initialState, action);
        const expected = Immutable({ activeRequests: ['OTHER_REQUEST', 'SOME_REQUEST'] });

        expect(nextState).to.deep.equal(expected);
      });
    });

    describe('actions that have meta.API_ACTIONS.apiRequestFinish', () => {
      const action = apiActionCreator(
        { apiRequestFinish: true, type: 'SOME_REQUEST' }
      );

      it('should remove the meta.API_ACTIONS.type from activeRequests', () => {
        const initialState = Immutable({ activeRequests: ['SOME_REQUEST'] });
        const nextState = apiReducer(initialState, action);
        const expected = Immutable({ activeRequests: [] });

        expect(nextState).to.deep.equal(expected);
      });

      it('should remove all instances of the meta.API_ACTIONS.type', () => {
        const initialState = Immutable({
          activeRequests: ['SOME_REQUEST', 'OTHER_REQUEST', 'SOME_REQUEST'],
        });
        const nextState = apiReducer(initialState, action);
        const expected = Immutable({ activeRequests: ['OTHER_REQUEST'] });

        expect(nextState).to.deep.equal(expected);
      });

      it('should not affect the existing activeRequests', () => {
        const initialState = Immutable({ activeRequests: ['OTHER_REQUEST', 'SOME_REQUEST'] });
        const nextState = apiReducer(initialState, action);
        const expected = Immutable({ activeRequests: ['OTHER_REQUEST'] });

        expect(nextState).to.deep.equal(expected);
      });
    });
  });

  describe('handling actions', () => {
    describe('API.PURPOSES_GET_SUCCESS', () => {
      const fetchPurposesSuccess = createAction(types.API.PURPOSES_GET_SUCCESS);

      it('should set shouldFetchPurposes to false', () => {
        const action = fetchPurposesSuccess();
        const initialState = Immutable({ shouldFetchPurposes: true });
        const nextState = apiReducer(initialState, action);

        expect(nextState.shouldFetchPurposes).to.equal(false);
      });
    });

    describe('API.RESOURCES_GET_SUCCESS', () => {
      const fetchResourcesSuccess = createAction(types.API.RESOURCES_GET_SUCCESS);

      it('should set shouldFetchSearchResults to false', () => {
        const action = fetchResourcesSuccess();
        const initialState = Immutable({ shouldFetchSearchResults: true });
        const nextState = apiReducer(initialState, action);

        expect(nextState.shouldFetchSearchResults).to.equal(false);
      });
    });

    describe('API.UNITS_GET_SUCCESS', () => {
      const fetchUnitsSuccess = createAction(types.API.UNITS_GET_SUCCESS);

      it('should set shouldFetchUnits to false', () => {
        const action = fetchUnitsSuccess();
        const initialState = Immutable({ shouldFetchUnits: true });
        const nextState = apiReducer(initialState, action);

        expect(nextState.shouldFetchUnits).to.equal(false);
      });
    });

    describe('API.RESERVATION_POST_REQUEST', () => {
      const postReservationStart = createAction(types.API.RESERVATION_POST_REQUEST);

      it('should increment pendingReservationsCount by one', () => {
        const action = postReservationStart();
        const initialState = Immutable({ pendingReservationsCount: 0 });
        const nextState = apiReducer(initialState, action);

        expect(nextState.pendingReservationsCount).to.equal(1);
      });
    });

    describe('API.RESERVATION_POST_SUCCESS', () => {
      const postReservationSuccess = createAction(types.API.RESERVATION_POST_SUCCESS);

      it('should decrement pendingReservationsCount by one', () => {
        const action = postReservationSuccess();
        const initialState = Immutable({ pendingReservationsCount: 2 });
        const nextState = apiReducer(initialState, action);

        expect(nextState.pendingReservationsCount).to.equal(1);
      });
    });

    describe('API.RESERVATION_POST_ERROR', () => {
      const postReservationError = createAction(types.API.RESERVATION_POST_ERROR);

      it('should decrement pendingReservationsCount by one', () => {
        const action = postReservationError();
        const initialState = Immutable({ pendingReservationsCount: 2 });
        const nextState = apiReducer(initialState, action);

        expect(nextState.pendingReservationsCount).to.equal(1);
      });
    });

    describe('UI.CHANGE_SEARCH_FILTERS', () => {
      const changeSearchFilters = createAction(types.UI.CHANGE_SEARCH_FILTERS);

      it('should set shouldFetchSearchResults to true', () => {
        const action = changeSearchFilters('some-filter');
        const initialState = Immutable({ shouldFetchSearchResults: false });
        const nextState = apiReducer(initialState, action);

        expect(nextState.shouldFetchSearchResults).to.equal(true);
      });
    });
  });
});
