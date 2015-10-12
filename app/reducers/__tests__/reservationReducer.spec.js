import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import { reservationReducer as reducer } from 'reducers/reservationReducer';
import { changeReservationDate } from 'actions/uiActions';

describe('Reducer: reservationReducer', () => {
  describe('handling actions', () => {
    describe('CHANGE_RESERVATION_DATE', () => {
      it('should set the given date to date', () => {
        const date = '2015-10-11';
        const action = changeReservationDate(date);
        const initialState = Immutable({
          date: '2015-11-11',
        });
        const nextState = reducer(initialState, action);

        expect(nextState.date).to.equal(date);
      });
    });
  });
});
