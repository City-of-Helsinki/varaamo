import { expect } from 'chai';

import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import apiReducer from 'reducers/apiReducer';

describe('Reducer: apiReducer', () => {
  describe('initial state', () => {
    const initialState = apiReducer(undefined, {});

    it('activeRequests should be an empty object', () => {
      expect(initialState.activeRequests).to.deep.equal({});
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
      const action = apiActionCreator({
        apiRequestStart: true,
        type: 'SOME_REQUEST',
      });

      describe('if activeRequests already contains the action', () => {
        it('should increase the count of the action by one', () => {
          const initialState = Immutable({
            activeRequests: { 'SOME_REQUEST': 2 },
          });
          const nextState = apiReducer(initialState, action);
          const expected = Immutable({
            activeRequests: { 'SOME_REQUEST': 3 },
          });

          expect(nextState).to.deep.equal(expected);
        });

        it('should not affect the existing activeRequests', () => {
          const initialState = Immutable({
            activeRequests: { 'SOME_REQUEST': 2, 'OTHER_REQUEST': 1 },
          });
          const nextState = apiReducer(initialState, action);
          const expected = Immutable({
            activeRequests: { 'SOME_REQUEST': 3, 'OTHER_REQUEST': 1 },
          });

          expect(nextState).to.deep.equal(expected);
        });
      });

      describe('if activeRequests does not already contain the action', () => {
        it('should add the action to activeRequests with count 1', () => {
          const initialState = Immutable({
            activeRequests: {},
          });
          const nextState = apiReducer(initialState, action);
          const expected = Immutable({
            activeRequests: { 'SOME_REQUEST': 1 },
          });

          expect(nextState).to.deep.equal(expected);
        });

        it('should not affect the existing activeRequests', () => {
          const initialState = Immutable({
            activeRequests: { 'OTHER_REQUEST': 1 },
          });
          const nextState = apiReducer(initialState, action);
          const expected = Immutable({
            activeRequests: { 'SOME_REQUEST': 1, 'OTHER_REQUEST': 1 },
          });

          expect(nextState).to.deep.equal(expected);
        });
      });
    });

    describe('actions that have meta.API_ACTIONS.apiRequestFinish', () => {
      describe('if activeRequests already contains the action', () => {
        describe('if the action has property "countable"', () => {
          const action = apiActionCreator({
            apiRequestFinish: true,
            countable: true,
            type: 'SOME_REQUEST',
          });

          it('should decrease the count of the action by one', () => {
            const initialState = Immutable({
              activeRequests: { 'SOME_REQUEST': 2 },
            });
            const nextState = apiReducer(initialState, action);
            const expected = Immutable({
              activeRequests: { 'SOME_REQUEST': 1 },
            });

            expect(nextState).to.deep.equal(expected);
          });

          it('should not affect the existing activeRequests', () => {
            const initialState = Immutable({
              activeRequests: { 'SOME_REQUEST': 2, 'OTHER_REQUEST': 1 },
            });
            const nextState = apiReducer(initialState, action);
            const expected = Immutable({
              activeRequests: { 'SOME_REQUEST': 1, 'OTHER_REQUEST': 1 },
            });

            expect(nextState).to.deep.equal(expected);
          });
        });

        describe('if the action does not have property "countable"', () => {
          const action = apiActionCreator({
            apiRequestFinish: true,
            type: 'SOME_REQUEST',
          });

          it('should set the count of the action to 0', () => {
            const initialState = Immutable({
              activeRequests: { 'SOME_REQUEST': 2 },
            });
            const nextState = apiReducer(initialState, action);
            const expected = Immutable({
              activeRequests: { 'SOME_REQUEST': 0 },
            });

            expect(nextState).to.deep.equal(expected);
          });

          it('should not affect the existing activeRequests', () => {
            const initialState = Immutable({
              activeRequests: { 'SOME_REQUEST': 2, 'OTHER_REQUEST': 1 },
            });
            const nextState = apiReducer(initialState, action);
            const expected = Immutable({
              activeRequests: { 'SOME_REQUEST': 0, 'OTHER_REQUEST': 1 },
            });

            expect(nextState).to.deep.equal(expected);
          });
        });
      });

      describe('if activeRequests does not already contain the action', () => {
        const action = apiActionCreator({
          apiRequestFinish: true,
          type: 'SOME_REQUEST',
        });

        it('should add the action to activeRequests with count 0', () => {
          const initialState = Immutable({
            activeRequests: {},
          });
          const nextState = apiReducer(initialState, action);
          const expected = Immutable({
            activeRequests: { 'SOME_REQUEST': 0 },
          });

          expect(nextState).to.deep.equal(expected);
        });

        it('should not affect the existing activeRequests', () => {
          const initialState = Immutable({
            activeRequests: { 'OTHER_REQUEST': 1 },
          });
          const nextState = apiReducer(initialState, action);
          const expected = Immutable({
            activeRequests: { 'SOME_REQUEST': 0, 'OTHER_REQUEST': 1 },
          });

          expect(nextState).to.deep.equal(expected);
        });
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
