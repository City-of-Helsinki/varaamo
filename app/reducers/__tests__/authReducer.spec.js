import { expect } from 'chai';

import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import authReducer from 'reducers/authReducer';

describe('Reducer: authReducer', () => {
  describe('initial state', () => {
    const initialState = authReducer(undefined, {});

    it('token should be null', () => {
      expect(initialState.token).to.equal(null);
    });

    it('userId should be null', () => {
      expect(initialState.userId).to.equal(null);
    });
  });

  describe('handling actions', () => {
    describe('API.LOGOUT', () => {
      const logout = createAction(types.API.LOGOUT);

      it('should set userId to null', () => {
        const action = logout();
        const initialState = Immutable({ userId: 'u-1' });
        const nextState = authReducer(initialState, action);

        expect(nextState.userId).to.equal(null);
      });

      it('should set token to null', () => {
        const action = logout();
        const initialState = Immutable({ token: 'mock-token' });
        const nextState = authReducer(initialState, action);

        expect(nextState.token).to.equal(null);
      });
    });
  });
});
