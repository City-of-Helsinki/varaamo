import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import activeRequestsReducer from './activeRequestsReducer';

describe('state/reducers/api/activeRequestsReducer', () => {
  describe('initial state', () => {
    const initialState = activeRequestsReducer(undefined, {});

    test('is an empty object', () => {
      expect(initialState).toEqual({});
    });
  });

  describe('handling actions', () => {
    const apiActionCreator = createAction(
      'REQUEST',
      () => ({}),
      metaData => ({ API_ACTION: metaData })
    );

    describe('actions that have meta.API_ACTIONS.apiRequestStart', () => {
      const action = apiActionCreator({
        apiRequestStart: true,
        type: 'SOME_REQUEST',
      });

      describe('if activeRequests already contains the action', () => {
        test('increases the count of the action by one', () => {
          const initialState = Immutable(
            { SOME_REQUEST: 2 }
          );
          const nextState = activeRequestsReducer(initialState, action);
          const expected = Immutable(
            { SOME_REQUEST: 3 }
          );

          expect(nextState).toEqual(expected);
        });

        test('does not affect the existing activeRequests', () => {
          const initialState = Immutable(
            { SOME_REQUEST: 2, OTHER_REQUEST: 1 }
          );
          const nextState = activeRequestsReducer(initialState, action);
          const expected = Immutable(
            { SOME_REQUEST: 3, OTHER_REQUEST: 1 }
          );

          expect(nextState).toEqual(expected);
        });
      });

      describe('if activeRequests does not already contain the action', () => {
        test('adds the action to activeRequests with count 1', () => {
          const initialState = Immutable({});
          const nextState = activeRequestsReducer(initialState, action);
          const expected = Immutable(
            { SOME_REQUEST: 1 }
          );

          expect(nextState).toEqual(expected);
        });

        test('does not affect the existing activeRequests', () => {
          const initialState = Immutable(
            { OTHER_REQUEST: 1 }
          );
          const nextState = activeRequestsReducer(initialState, action);
          const expected = Immutable(
            { SOME_REQUEST: 1, OTHER_REQUEST: 1 }
          );

          expect(nextState).toEqual(expected);
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

          test('decreases the count of the action by one', () => {
            const initialState = Immutable(
              { SOME_REQUEST: 2 }
            );
            const nextState = activeRequestsReducer(initialState, action);
            const expected = Immutable(
              { SOME_REQUEST: 1 }
            );

            expect(nextState).toEqual(expected);
          });

          test('does not affect the existing activeRequests', () => {
            const initialState = Immutable(
              { SOME_REQUEST: 2, OTHER_REQUEST: 1 }
            );
            const nextState = activeRequestsReducer(initialState, action);
            const expected = Immutable(
              { SOME_REQUEST: 1, OTHER_REQUEST: 1 }
            );

            expect(nextState).toEqual(expected);
          });
        });

        describe('if the action does not have property "countable"', () => {
          const action = apiActionCreator({
            apiRequestFinish: true,
            type: 'SOME_REQUEST',
          });

          test('sets the count of the action to 0', () => {
            const initialState = Immutable(
              { SOME_REQUEST: 2 }
            );
            const nextState = activeRequestsReducer(initialState, action);
            const expected = Immutable(
              { SOME_REQUEST: 0 }
            );

            expect(nextState).toEqual(expected);
          });

          test('does not affect the existing activeRequests', () => {
            const initialState = Immutable(
              { SOME_REQUEST: 2, OTHER_REQUEST: 1 }
            );
            const nextState = activeRequestsReducer(initialState, action);
            const expected = Immutable(
              { SOME_REQUEST: 0, OTHER_REQUEST: 1 }
            );

            expect(nextState).toEqual(expected);
          });
        });
      });

      describe('if activeRequests does not already contain the action', () => {
        const action = apiActionCreator({
          apiRequestFinish: true,
          type: 'SOME_REQUEST',
        });

        test('adds the action to activeRequests with count 0', () => {
          const initialState = Immutable({});
          const nextState = activeRequestsReducer(initialState, action);
          const expected = Immutable(
            { SOME_REQUEST: 0 }
          );

          expect(nextState).toEqual(expected);
        });

        test('does not affect the existing activeRequests', () => {
          const initialState = Immutable(
            { OTHER_REQUEST: 1 }
          );
          const nextState = activeRequestsReducer(initialState, action);
          const expected = Immutable(
            { SOME_REQUEST: 0, OTHER_REQUEST: 1 }
          );

          expect(nextState).toEqual(expected);
        });
      });
    });
  });
});
