import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import types from '../../../../constants/ActionTypes';
import shouldFetchReducer from '../shouldFetchReducer';

describe('state/reducers/api/shouldFetchReducer', () => {
  describe('initial state', () => {
    const initialState = shouldFetchReducer(undefined, {});

    test('purposes is true', () => {
      expect(initialState.purposes).toBe(true);
    });

    test('resources is true', () => {
      expect(initialState.resources).toBe(true);
    });

    test('units is true', () => {
      expect(initialState.units).toBe(true);
    });
  });

  describe('handling actions', () => {
    describe('API.PURPOSES_GET_SUCCESS', () => {
      const fetchPurposesSuccess = createAction(types.API.PURPOSES_GET_SUCCESS);

      test('sets purposes to false', () => {
        const action = fetchPurposesSuccess();
        const initialState = Immutable({ purposes: true });
        const nextState = shouldFetchReducer(initialState, action);

        expect(nextState.purposes).toBe(false);
      });
    });

    describe('API.RESOURCES_GET_SUCCESS', () => {
      const fetchResourcesSuccess = createAction(types.API.RESOURCES_GET_SUCCESS);

      test('sets resources to false', () => {
        const action = fetchResourcesSuccess();
        const initialState = Immutable({ resources: true });
        const nextState = shouldFetchReducer(initialState, action);

        expect(nextState.resources).toBe(false);
      });
    });

    describe('API.UNITS_GET_SUCCESS', () => {
      const fetchUnitsSuccess = createAction(types.API.UNITS_GET_SUCCESS);

      test('sets units to false', () => {
        const action = fetchUnitsSuccess();
        const initialState = Immutable({ units: true });
        const nextState = shouldFetchReducer(initialState, action);

        expect(nextState.units).toBe(false);
      });
    });
  });
});
