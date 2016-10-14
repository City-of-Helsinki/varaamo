import { expect } from 'chai';
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import authReducer from './authReducer';

describe('state/reducers/authReducer', () => {
  describe('initial state', () => {
    const initialState = authReducer(undefined, {});

    it('token is null', () => {
      expect(initialState.token).to.equal(null);
    });

    it('userId is null', () => {
      expect(initialState.userId).to.equal(null);
    });
  });

  describe('handling actions', () => {
    describe('API.RESERVATION_DELETE_ERROR', () => {
      const reservationDeleteError = createAction(types.API.RESERVATION_DELETE_ERROR);

      it('sets state to initialState if error status is 401', () => {
        const action = reservationDeleteError({ status: 401 });
        const initialState = Immutable({ token: 'mock-token', userId: 'u-1' });
        const nextState = authReducer(initialState, action);
        const expectedState = Immutable({
          token: null,
          userId: null,
        });

        expect(nextState).to.deep.equal(expectedState);
      });

      it('does not affect state if error status is not 401', () => {
        const action = reservationDeleteError({ status: 403 });
        const initialState = Immutable({ token: 'mock-token', userId: 'u-1' });
        const nextState = authReducer(initialState, action);
        const expectedState = initialState;

        expect(nextState).to.deep.equal(expectedState);
      });
    });

    describe('API.RESERVATION_POST_ERROR', () => {
      const reservationPostError = createAction(types.API.RESERVATION_POST_ERROR);

      it('sets state to initialState if error status is 401', () => {
        const action = reservationPostError({ status: 401 });
        const initialState = Immutable({ token: 'mock-token', userId: 'u-1' });
        const nextState = authReducer(initialState, action);
        const expectedState = Immutable({
          token: null,
          userId: null,
        });

        expect(nextState).to.deep.equal(expectedState);
      });

      it('does not affect state if error status is not 401', () => {
        const action = reservationPostError({ status: 403 });
        const initialState = Immutable({ token: 'mock-token', userId: 'u-1' });
        const nextState = authReducer(initialState, action);
        const expectedState = initialState;

        expect(nextState).to.deep.equal(expectedState);
      });
    });

    describe('API.RESERVATION_PUT_ERROR', () => {
      const reservationPutError = createAction(types.API.RESERVATION_PUT_ERROR);

      it('sets state to initialState if error status is 401', () => {
        const action = reservationPutError({ status: 401 });
        const initialState = Immutable({ token: 'mock-token', userId: 'u-1' });
        const nextState = authReducer(initialState, action);
        const expectedState = Immutable({
          token: null,
          userId: null,
        });

        expect(nextState).to.deep.equal(expectedState);
      });

      it('does not affect state if error status is not 401', () => {
        const action = reservationPutError({ status: 403 });
        const initialState = Immutable({ token: 'mock-token', userId: 'u-1' });
        const nextState = authReducer(initialState, action);
        const expectedState = initialState;

        expect(nextState).to.deep.equal(expectedState);
      });
    });
  });
});
