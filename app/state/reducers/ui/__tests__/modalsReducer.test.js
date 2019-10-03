import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import types from '../../../../constants/ActionTypes';
import ModalTypes from '../../../../constants/ModalTypes';
import modalsReducer from '../modalsReducer';

describe('state/reducers/ui/modalsReducer', () => {
  describe('initial state', () => {
    const initialState = modalsReducer(undefined, {});

    test('open is an empty array', () => {
      expect(initialState.open).toEqual([]);
    });
  });

  describe('handling actions', () => {
    describe('API.RESERVATION_POST_SUCCESS', () => {
      const reservationPostSuccessAction = createAction(types.API.RESERVATION_POST_SUCCESS);

      test('adds ModalTypes.RESERVATION_SUCCESS to open', () => {
        const initialState = Immutable({ open: [] });
        const action = reservationPostSuccessAction();
        const nextState = modalsReducer(initialState, action);
        const expected = Immutable({ open: [ModalTypes.RESERVATION_SUCCESS] });

        expect(nextState).toEqual(expected);
      });
    });

    describe('UI.CLOSE_MODAL', () => {
      const closeModal = createAction(types.UI.CLOSE_MODAL);

      describe('if modal is open', () => {
        test('removes the given modal from open', () => {
          const initialState = Immutable({ open: ['some-modal'] });
          const action = closeModal('some-modal');
          const nextState = modalsReducer(initialState, action);
          const expected = Immutable({ open: [] });

          expect(nextState).toEqual(expected);
        });

        test('does not affect other modals in open', () => {
          const initialState = Immutable({ open: ['other-modal', 'some-modal'] });
          const action = closeModal('some-modal');
          const nextState = modalsReducer(initialState, action);
          const expected = Immutable({ open: ['other-modal'] });

          expect(nextState).toEqual(expected);
        });
      });

      describe('if modal is not open', () => {
        test('does not change open in any way', () => {
          const action = closeModal('some-modal');
          const initialState = Immutable({ open: ['other-modal'] });
          const nextState = modalsReducer(initialState, action);

          expect(nextState).toEqual(initialState);
        });
      });
    });

    describe('UI.OPEN_MODAL', () => {
      const openModal = createAction(types.UI.OPEN_MODAL);

      describe('if modal is not open', () => {
        test('adds the given modal to open', () => {
          const initialState = Immutable({ open: [] });
          const action = openModal('some-modal');
          const nextState = modalsReducer(initialState, action);
          const expected = Immutable({ open: ['some-modal'] });

          expect(nextState).toEqual(expected);
        });

        test('does not affect other modals in open', () => {
          const initialState = Immutable({ open: ['other-modal'] });
          const action = openModal('some-modal');
          const nextState = modalsReducer(initialState, action);
          const expected = Immutable({ open: ['other-modal', 'some-modal'] });

          expect(nextState).toEqual(expected);
        });
      });

      describe('if modal is already open', () => {
        test('does not change open in any way', () => {
          const action = openModal('some-modal');
          const initialState = Immutable({ open: ['other-modal', 'some-modal'] });
          const nextState = modalsReducer(initialState, action);

          expect(nextState).toEqual(initialState);
        });
      });
    });
  });
});
