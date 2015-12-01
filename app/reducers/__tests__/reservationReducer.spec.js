import { expect } from 'chai';

import _ from 'lodash';
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import {
  cancelReservationEdit,
  clearReservations,
  closeDeleteReservationModal,
  closeConfirmReservationModal,
  selectReservationToDelete,
  selectReservationToEdit,
  toggleTimeSlot,
} from 'actions/uiActions';
import types from 'constants/ActionTypes';
import Reservation from 'fixtures/Reservation';
import reservationReducer from 'reducers/reservationReducer';
import { getTimeSlots } from 'utils/TimeUtils';

describe('Reducer: reservationReducer', () => {
  describe('initial state', () => {
    const initialState = reservationReducer(undefined, {});

    it('selected should be an empty array', () => {
      expect(initialState.selected).to.deep.equal([]);
    });

    it('toDelete should be an empty array', () => {
      expect(initialState.toDelete).to.deep.equal([]);
    });

    it('toEdit should be an empty array', () => {
      expect(initialState.toEdit).to.deep.equal([]);
    });
  });

  describe('handling actions', () => {
    describe('API.RESERVATION_POST_SUCCESS', () => {
      const postReservationSuccess = createAction(types.API.RESERVATION_POST_SUCCESS);

      it('should clear selected', () => {
        const action = postReservationSuccess();
        const initialState = Immutable({
          selected: ['some-selected'],
        });
        const nextState = reservationReducer(initialState, action);

        expect(nextState.selected).to.deep.equal([]);
      });

      it('should clear the toEdit', () => {
        const action = postReservationSuccess();
        const initialState = Immutable({
          toEdit: ['something-to-edit'],
        });
        const nextState = reservationReducer(initialState, action);

        expect(nextState.toEdit).to.deep.equal([]);
      });
    });

    describe('API.RESERVATION_PUT_SUCCESS', () => {
      const putReservationSuccess = createAction(types.API.RESERVATION_PUT_SUCCESS);

      it('should clear selected', () => {
        const action = putReservationSuccess();
        const initialState = Immutable({
          selected: ['some-selected'],
        });
        const nextState = reservationReducer(initialState, action);

        expect(nextState.selected).to.deep.equal([]);
      });

      it('should clear the toEdit', () => {
        const action = putReservationSuccess();
        const initialState = Immutable({
          toEdit: ['something-to-edit'],
        });
        const nextState = reservationReducer(initialState, action);

        expect(nextState.toEdit).to.deep.equal([]);
      });
    });

    describe('UI.CANCEL_RESERVATION_EDIT', () => {
      it('should clear toEdit array', () => {
        const initialState = Immutable({
          toEdit: [Reservation.build()],
        });
        const action = cancelReservationEdit();
        const nextState = reservationReducer(initialState, action);

        expect(nextState.toEdit).to.deep.equal([]);
      });
    });

    describe('UI.CLEAR_RESERVATIONS', () => {
      it('should set the given date to date', () => {
        const resetedState = reservationReducer(undefined, {});
        const action = clearReservations();
        const initialState = Immutable({
          date: '2015-11-11',
          selected: ['something'],
          toDelete: ['something'],
          toEdit: ['something'],
        });
        const nextState = reservationReducer(initialState, action);

        expect(nextState).to.deep.equal(resetedState);
      });
    });

    describe('UI.CLOSE_MODAL', () => {
      describe('if closed modal is DELETE_RESERVATION modal', () => {
        it('should clear toDelete array', () => {
          const initialState = Immutable({
            toDelete: [Reservation.build()],
          });
          const action = closeDeleteReservationModal();
          const nextState = reservationReducer(initialState, action);

          expect(nextState.toDelete).to.deep.equal([]);
        });
      });

      describe('if closed modal is not DELETE_RESERVATION modal', () => {
        it('should return the state unchanged', () => {
          const initialState = Immutable({
            toDelete: [Reservation.build()],
          });
          const action = closeConfirmReservationModal();
          const nextState = reservationReducer(initialState, action);

          expect(nextState).to.equal(initialState);
        });
      });
    });

    describe('UI.SELECT_RESERVATION_TO_DELETE', () => {
      it('should add the given reservation to toDelete', () => {
        const initialState = Immutable({
          toDelete: [],
        });
        const reservation = Reservation.build();
        const action = selectReservationToDelete(reservation);
        const nextState = reservationReducer(initialState, action);
        const expected = Immutable([reservation]);

        expect(nextState.toDelete).to.deep.equal(expected);
      });

      it('should not affect other reservations in toDelete', () => {
        const reservations = [
          Reservation.build(),
          Reservation.build(),
        ];
        const initialState = Immutable({
          toDelete: [reservations[0]],
        });
        const action = selectReservationToDelete(reservations[1]);
        const nextState = reservationReducer(initialState, action);
        const expected = Immutable([reservations[0], reservations[1]]);

        expect(nextState.toDelete).to.deep.equal(expected);
      });
    });

    describe('UI.SELECT_RESERVATION_TO_EDIT', () => {
      it('should set the given reservation to toEdit', () => {
        const initialState = Immutable({
          selected: [],
          toEdit: [],
        });
        const reservation = Reservation.build();
        const action = selectReservationToEdit({ reservation });
        const nextState = reservationReducer(initialState, action);
        const expected = Immutable([reservation]);

        expect(nextState.toEdit).to.deep.equal(expected);
      });

      it('should remove other reservations in toEdit', () => {
        const reservations = [
          Reservation.build(),
          Reservation.build(),
        ];
        const initialState = Immutable({
          selected: [],
          toEdit: [reservations[0]],
        });
        const action = selectReservationToEdit({ reservation: reservations[1] });
        const nextState = reservationReducer(initialState, action);
        const expected = Immutable([reservations[1]]);

        expect(nextState.toEdit).to.deep.equal(expected);
      });

      it('should split the given reservation to slots and add to selected', () => {
        const begin = '2015-10-09T08:00:00+03:00';
        const end = '2015-10-09T10:00:00+03:00';
        const minPeriod = '00:30:00';
        const reservation = Reservation.build({ begin, end });
        const initialState = Immutable({
          selected: [],
          toEdit: [],
        });
        const action = selectReservationToEdit({ reservation, minPeriod });
        const nextState = reservationReducer(initialState, action);
        const slots = getTimeSlots(reservation.begin, reservation.end, minPeriod);
        const expected = _.map(slots, (slot) => slot.asISOString);

        expect(nextState.selected).to.deep.equal(expected);
      });
    });

    describe('UI.TOGGLE_TIME_SLOT', () => {
      describe('if slot is not already selected', () => {
        it('should add the given slot to selected', () => {
          const initialState = Immutable({
            selected: [],
          });
          const slot = '2015-10-11T10:00:00Z/2015-10-11T11:00:00Z';
          const action = toggleTimeSlot(slot);
          const nextState = reservationReducer(initialState, action);
          const expected = Immutable([slot]);

          expect(nextState.selected).to.deep.equal(expected);
        });

        it('should not affect other selected slots ', () => {
          const initialState = Immutable({
            selected: ['2015-12-12T10:00:00Z/2015-12-12T11:00:00Z'],
          });
          const slot = '2015-10-11T10:00:00Z/2015-10-11T11:00:00Z';
          const action = toggleTimeSlot(slot);
          const nextState = reservationReducer(initialState, action);
          const expected = Immutable([...initialState.selected, slot]);

          expect(nextState.selected).to.deep.equal(expected);
        });
      });

      describe('if slot is already selected', () => {
        it('should remove the given slot from selected', () => {
          const slot = '2015-10-11T10:00:00Z/2015-10-11T11:00:00Z';
          const action = toggleTimeSlot(slot);
          const initialState = Immutable({
            selected: ['2015-10-11T10:00:00Z/2015-10-11T11:00:00Z'],
          });
          const nextState = reservationReducer(initialState, action);
          const expected = Immutable([]);

          expect(nextState.selected).to.deep.equal(expected);
        });

        it('should not affect other selected slots ', () => {
          const slot = '2015-10-11T10:00:00Z/2015-10-11T11:00:00Z';
          const action = toggleTimeSlot(slot);
          const initialState = Immutable({
            selected: [
              '2015-12-12T10:00:00Z/2015-12-12T11:00:00Z',
              '2015-10-11T10:00:00Z/2015-10-11T11:00:00Z',
            ],
          });
          const nextState = reservationReducer(initialState, action);
          const expected = Immutable([initialState.selected[0]]);

          expect(nextState.selected).to.deep.equal(expected);
        });
      });
    });
  });
});
