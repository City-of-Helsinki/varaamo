import { expect } from 'chai';

import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import { authReducer as reducer } from 'reducers/authReducer';

describe('Reducer: authReducer', () => {
  describe('initial state', () => {
    const initialState = reducer(undefined, {});

    it('userId should be null', () => {
      expect(initialState.userId).to.equal(null);
    });
  });

  describe('handling actions', () => {
    describe('API.LOGIN', () => {
      const login = createAction(types.API.LOGIN);

      it('should set userId to given id', () => {
        const payload = { userId: 'u-1' };
        const action = login(payload);
        const initialState = Immutable({ userId: null });
        const nextState = reducer(initialState, action);

        expect(nextState.userId).to.equal(payload.userId);
      });
    });

    describe('API.LOGOUT', () => {
      const logout = createAction(types.API.LOGOUT);

      it('should set userId to null', () => {
        const action = logout();
        const initialState = Immutable({ userId: 'u-1' });
        const nextState = reducer(initialState, action);

        expect(nextState.userId).to.equal(null);
      });
    });
  });
});
