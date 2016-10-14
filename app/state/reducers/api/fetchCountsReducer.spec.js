import { expect } from 'chai';
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import fetchCountsReducer from './fetchCountsReducer';

describe('state/reducers/api/fetchCountsReducer', () => {
  describe('initial state', () => {
    const initialState = fetchCountsReducer(undefined, {});

    it('reservations is 0', () => {
      expect(initialState.reservations).to.equal(0);
    });
  });

  describe('handling actions', () => {
    describe('API.RESERVATIONS_GET_SUCCESS', () => {
      const getReservationsSuccess = createAction(types.API.RESERVATIONS_GET_SUCCESS);

      it('increases reservations by 1', () => {
        const action = getReservationsSuccess();
        const initialState = Immutable({
          reservations: 3,
        });
        const nextState = fetchCountsReducer(initialState, action);

        expect(nextState.reservations).to.equal(4);
      });
    });
  });
});
