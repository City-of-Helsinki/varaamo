import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import reducer from './reservationInfoModalReducer';

describe('state/reducers/ui/reservationInfoModalReducer', () => {
  const initialState = Immutable({
    reservation: null,
    show: false,
  });

  it('returns correct initial state', () => {
    const actual = reducer(undefined, { type: 'NOOP' });
    expect(actual).to.deep.equal(initialState);
  });

  describe('RESERVATION_DELETE_SUCCESS', () => {
    it('resets state', () => {
      const actual = reducer({ show: true, reservation: {} }, {
        type: 'RESERVATION_DELETE_SUCCESS',
      });
      expect(actual).to.deep.equal(initialState);
    });
  });

  describe('RESERVATION_PUT_SUCCESS', () => {
    const reservation = { id: 'r-1', foo: 'bar' };
    const action = {
      type: 'RESERVATION_PUT_SUCCESS',
      payload: reservation,
    };

    it('sets payload as reservation', () => {
      const actual = reducer(Immutable({ reservation: { id: 'r-1', foo: 'old value' } }), action);
      expect(actual.reservation).to.deep.equal(reservation);
    });
  });

  describe('SHOW_RESERVATION_INFO_MODAL', () => {
    const reservation = { id: 'r-1', foo: 'bar' };
    const action = {
      type: 'SHOW_RESERVATION_INFO_MODAL',
      payload: reservation,
    };

    it('sets show to true', () => {
      const actual = reducer(Immutable({ show: false }), action);
      expect(actual.show).to.be.true;
    });

    it('sets payload as reservation', () => {
      const actual = reducer(Immutable({ reservation: null }), action);
      expect(actual.reservation).to.deep.equal(reservation);
    });
  });

  describe('HIDE_RESERVATION_INFO_MODAL', () => {
    it('sets show to false', () => {
      const actual = reducer(Immutable({ show: true }), {
        type: 'HIDE_RESERVATION_INFO_MODAL',
      });
      expect(actual.show).to.be.false;
    });
  });
});
