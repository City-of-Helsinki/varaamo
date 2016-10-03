import { expect } from 'chai';
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import {
  cancelReservationEdit,
  changeAdminReservationsFilters,
  clearReservations,
  closeReservationCancelModal,
  closeReservationInfoModal,
  closeReservationSuccessModal,
  selectReservationToCancel,
  selectReservationToEdit,
  selectReservationToShow,
  toggleTimeSlot,
} from 'actions/uiActions';
import types from 'constants/ActionTypes';
import Reservation from 'fixtures/Reservation';
import reservationsReducer from 'reducers/reservationsReducer';
import { getTimeSlots } from 'utils/timeUtils';

describe('Reducer: reservationsReducer', () => {
  describe('initial state', () => {
    const initialState = reservationsReducer(undefined, {});

    describe('adminReservationsFilters', () => {
      it('should be an object', () => {
        expect(typeof initialState.adminReservationsFilters).to.equal('object');
      });

      it('state should be "all"', () => {
        expect(initialState.adminReservationsFilters.state).to.equal('all');
      });
    });

    it('selected should be an empty array', () => {
      expect(initialState.selected).to.deep.equal([]);
    });

    it('toCancel should be an empty array', () => {
      expect(initialState.toCancel).to.deep.equal([]);
    });

    it('toEdit should be an empty array', () => {
      expect(initialState.toEdit).to.deep.equal([]);
    });

    it('toShow should be an empty array', () => {
      expect(initialState.toShow).to.deep.equal([]);
    });
  });

  describe('handling actions', () => {
    describe('API.RESERVATION_POST_SUCCESS', () => {
      const postReservationSuccess = createAction(types.API.RESERVATION_POST_SUCCESS);

      it('should clear selected', () => {
        const action = postReservationSuccess();
        const initialState = Immutable({
          selected: ['some-selected'],
          toShow: [],
        });
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.selected).to.deep.equal([]);
      });

      it('should clear the toEdit', () => {
        const action = postReservationSuccess();
        const initialState = Immutable({
          toEdit: ['something-to-edit'],
          toShow: [],
        });
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.toEdit).to.deep.equal([]);
      });

      it('should add the given reservation to toShow', () => {
        const initialState = Immutable({
          toShow: [],
        });
        const reservation = Reservation.build();
        const action = postReservationSuccess(reservation);
        const nextState = reservationsReducer(initialState, action);
        const expected = Immutable([reservation]);

        expect(nextState.toShow).to.deep.equal(expected);
      });

      it('should not affect other reservations in toShow', () => {
        const reservations = [
          Reservation.build(),
          Reservation.build(),
        ];
        const initialState = Immutable({
          toShow: [reservations[0]],
        });
        const action = postReservationSuccess(reservations[1]);
        const nextState = reservationsReducer(initialState, action);
        const expected = Immutable([reservations[0], reservations[1]]);

        expect(nextState.toShow).to.deep.equal(expected);
      });
    });

    describe('API.RESERVATION_PUT_SUCCESS', () => {
      const putReservationSuccess = createAction(types.API.RESERVATION_PUT_SUCCESS);

      it('should clear selected', () => {
        const action = putReservationSuccess();
        const initialState = Immutable({
          selected: ['some-selected'],
        });
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.selected).to.deep.equal([]);
      });

      it('should clear the toEdit', () => {
        const action = putReservationSuccess();
        const initialState = Immutable({
          toEdit: ['something-to-edit'],
        });
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.toEdit).to.deep.equal([]);
      });

      it('should clear the toShow', () => {
        const action = putReservationSuccess();
        const initialState = Immutable({
          toShow: ['something-to-show'],
        });
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.toShow).to.deep.equal([]);
      });
    });

    describe('UI.CANCEL_RESERVATION_EDIT', () => {
      it('should clear toEdit array', () => {
        const initialState = Immutable({
          toEdit: [Reservation.build()],
        });
        const action = cancelReservationEdit();
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.toEdit).to.deep.equal([]);
      });
    });

    describe('UI.CHANGE_ADMIN_RESERVATIONS_FILTERS', () => {
      it('should set the given filters to adminReservationsFilters', () => {
        const adminReservationsFilters = { state: 'some-state' };
        const action = changeAdminReservationsFilters(adminReservationsFilters);
        const initialState = Immutable({
          adminReservationsFilters: {},
        });
        const expected = Immutable(adminReservationsFilters);
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.adminReservationsFilters).to.deep.equal(expected);
      });

      it('should override previous values of same adminReservationsFilters', () => {
        const adminReservationsFilters = { state: 'some-state' };
        const action = changeAdminReservationsFilters(adminReservationsFilters);
        const initialState = Immutable({
          adminReservationsFilters: { state: 'old-value' },
        });
        const expected = Immutable(adminReservationsFilters);
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.adminReservationsFilters).to.deep.equal(expected);
      });

      it('should not override unspecified adminReservationsFilters', () => {
        const adminReservationsFilters = { state: 'some-state' };
        const action = changeAdminReservationsFilters(adminReservationsFilters);
        const initialState = Immutable({
          adminReservationsFilters: { otherFilter: 'other-value' },
        });
        const expected = Immutable({
          otherFilter: 'other-value',
          state: 'some-state',
        });
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.adminReservationsFilters).to.deep.equal(expected);
      });
    });

    describe('UI.CLEAR_RESERVATIONS', () => {
      it('should set the given date to date', () => {
        const resetedState = reservationsReducer(undefined, {});
        const action = clearReservations();
        const initialState = Immutable({
          date: '2015-11-11',
          selected: ['something'],
          toCancel: ['something'],
          toEdit: ['something'],
          toShow: ['something'],
        });
        const nextState = reservationsReducer(initialState, action);

        expect(nextState).to.deep.equal(resetedState);
      });
    });

    describe('UI.CLOSE_MODAL', () => {
      describe('if closed modal is RESERVATION_CANCEL modal', () => {
        it('should clear toCancel array', () => {
          const initialState = Immutable({
            toCancel: [Reservation.build()],
          });
          const action = closeReservationCancelModal();
          const nextState = reservationsReducer(initialState, action);

          expect(nextState.toCancel).to.deep.equal([]);
        });
      });

      describe('if closed modal is RESERVATION_INFO modal', () => {
        it('should clear toShow array', () => {
          const initialState = Immutable({
            toShow: [Reservation.build()],
          });
          const action = closeReservationInfoModal();
          const nextState = reservationsReducer(initialState, action);

          expect(nextState.toShow).to.deep.equal([]);
        });
      });

      describe('if closed modal is RESERVATION_SUCCESS modal', () => {
        it('should clear toShow array', () => {
          const initialState = Immutable({
            toShow: [Reservation.build()],
          });
          const action = closeReservationSuccessModal();
          const nextState = reservationsReducer(initialState, action);

          expect(nextState.toShow).to.deep.equal([]);
        });
      });
    });

    describe('UI.SELECT_RESERVATION_TO_CANCEL', () => {
      it('should add the given reservation to toCancel', () => {
        const initialState = Immutable({
          toCancel: [],
        });
        const reservation = Reservation.build();
        const action = selectReservationToCancel(reservation);
        const nextState = reservationsReducer(initialState, action);
        const expected = Immutable([reservation]);

        expect(nextState.toCancel).to.deep.equal(expected);
      });

      it('should not affect other reservations in toCancel', () => {
        const reservations = [
          Reservation.build(),
          Reservation.build(),
        ];
        const initialState = Immutable({
          toCancel: [reservations[0]],
        });
        const action = selectReservationToCancel(reservations[1]);
        const nextState = reservationsReducer(initialState, action);
        const expected = Immutable([reservations[0], reservations[1]]);

        expect(nextState.toCancel).to.deep.equal(expected);
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
        const nextState = reservationsReducer(initialState, action);
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
        const nextState = reservationsReducer(initialState, action);
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
        const nextState = reservationsReducer(initialState, action);
        const slots = getTimeSlots(reservation.begin, reservation.end, minPeriod);
        const expected = slots.map((slot) => slot.asISOString);

        expect(nextState.selected).to.deep.equal(expected);
      });
    });

    describe('UI.SELECT_RESERVATION_TO_SHOW', () => {
      it('should add the given reservation to toShow', () => {
        const initialState = Immutable({
          toShow: [],
        });
        const reservation = Reservation.build();
        const action = selectReservationToShow(reservation);
        const nextState = reservationsReducer(initialState, action);
        const expected = Immutable([reservation]);

        expect(nextState.toShow).to.deep.equal(expected);
      });

      it('should not affect other reservations in toShow', () => {
        const reservations = [
          Reservation.build(),
          Reservation.build(),
        ];
        const initialState = Immutable({
          toShow: [reservations[0]],
        });
        const action = selectReservationToShow(reservations[1]);
        const nextState = reservationsReducer(initialState, action);
        const expected = Immutable([reservations[0], reservations[1]]);

        expect(nextState.toShow).to.deep.equal(expected);
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
          const nextState = reservationsReducer(initialState, action);
          const expected = Immutable([slot]);

          expect(nextState.selected).to.deep.equal(expected);
        });

        it('should not affect other selected slots ', () => {
          const initialState = Immutable({
            selected: ['2015-12-12T10:00:00Z/2015-12-12T11:00:00Z'],
          });
          const slot = '2015-10-11T10:00:00Z/2015-10-11T11:00:00Z';
          const action = toggleTimeSlot(slot);
          const nextState = reservationsReducer(initialState, action);
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
          const nextState = reservationsReducer(initialState, action);
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
          const nextState = reservationsReducer(initialState, action);
          const expected = Immutable([initialState.selected[0]]);

          expect(nextState.selected).to.deep.equal(expected);
        });
      });
    });
  });
});
