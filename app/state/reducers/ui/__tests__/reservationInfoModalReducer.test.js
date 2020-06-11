import Immutable from 'seamless-immutable';

import reducer from '../reservationInfoModalReducer';

describe('state/reducers/ui/reservationInfoModalReducer', () => {
  const initialState = Immutable({
    isEditing: false,
    reservation: null,
    show: false,
  });

  test('returns correct initial state', () => {
    const actual = reducer(undefined, { type: 'NOOP' });
    expect(actual).toEqual(initialState);
  });

  describe('RESERVATION_DELETE_SUCCESS', () => {
    test('resets state', () => {
      const actual = reducer(
        { show: true, reservation: {} },
        {
          type: 'RESERVATION_DELETE_SUCCESS',
        }
      );
      expect(actual).toEqual(initialState);
    });
  });

  describe('RESERVATION_PUT_SUCCESS', () => {
    const reservation = { id: 'r-1', foo: 'bar' };
    const action = {
      type: 'RESERVATION_PUT_SUCCESS',
      payload: reservation,
    };

    test('sets payload as reservation', () => {
      const actual = reducer(
        Immutable({ reservation: { id: 'r-1', foo: 'old value' } }),
        action
      );
      expect(actual.reservation).toEqual(reservation);
    });

    test('sets isEditing to false', () => {
      const actual = reducer(Immutable({ isEditing: true }), action);
      expect(actual.isEditing).toBe(false);
    });
  });

  describe('SHOW_RESERVATION_INFO_MODAL', () => {
    const reservation = { id: 'r-1', foo: 'bar' };
    const action = {
      type: 'SHOW_RESERVATION_INFO_MODAL',
      payload: reservation,
    };

    test('sets show to true', () => {
      const actual = reducer(Immutable({ show: false }), action);
      expect(actual.show).toBe(true);
    });

    test('sets payload as reservation', () => {
      const actual = reducer(Immutable({ reservation: null }), action);
      expect(actual.reservation).toEqual(reservation);
    });
  });

  describe('HIDE_RESERVATION_INFO_MODAL', () => {
    test('sets show to false', () => {
      const actual = reducer(Immutable({ show: true }), {
        type: 'HIDE_RESERVATION_INFO_MODAL',
      });
      expect(actual.show).toBe(false);
    });

    test('sets isEditing to false', () => {
      const actual = reducer(Immutable({ isEditing: true }), {
        type: 'HIDE_RESERVATION_INFO_MODAL',
      });
      expect(actual.isEditing).toBe(false);
    });
  });

  describe('START_RESERVATION_EDIT_IN_INFO_MODAL', () => {
    test('sets isEditing to true', () => {
      const actual = reducer(Immutable({ isEditing: false }), {
        type: 'START_RESERVATION_EDIT_IN_INFO_MODAL',
      });
      expect(actual.isEditing).toBe(true);
    });
  });

  describe('CANCEL_RESERVATION_EDIT_IN_INFO_MODAL', () => {
    test('sets isEditing to false', () => {
      const actual = reducer(Immutable({ isEditing: true }), {
        type: 'CANCEL_RESERVATION_EDIT_IN_INFO_MODAL',
      });
      expect(actual.isEditing).toBe(false);
    });
  });
});
