import { expect } from 'chai';

import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import modalsReducer from 'reducers/modalsReducer';

describe('Reducer: modalsReducer', () => {
  describe('initial state', () => {
    const initialState = modalsReducer(undefined, {});

    it('open is an empty array', () => {
      expect(initialState.open).to.deep.equal([]);
    });
  });

  describe('handling actions', () => {
    describe('UI.CLOSE_MODAL', () => {
      const closeModal = createAction(types.UI.CLOSE_MODAL);

      describe('if modal is open', () => {
        it('removes the given modal from open', () => {
          const initialState = Immutable({ open: ['some-modal'] });
          const action = closeModal('some-modal');
          const nextState = modalsReducer(initialState, action);
          const expected = Immutable({ open: [] });

          expect(nextState).to.deep.equal(expected);
        });

        it('does not affect other modals in open', () => {
          const initialState = Immutable({ open: ['other-modal', 'some-modal'] });
          const action = closeModal('some-modal');
          const nextState = modalsReducer(initialState, action);
          const expected = Immutable({ open: ['other-modal'] });

          expect(nextState).to.deep.equal(expected);
        });
      });

      describe('if modal is not open', () => {
        it('does not change open in any way', () => {
          const action = closeModal('some-modal');
          const initialState = Immutable({ open: ['other-modal'] });
          const nextState = modalsReducer(initialState, action);

          expect(nextState).to.deep.equal(initialState);
        });
      });
    });

    describe('UI.OPEN_MODAL', () => {
      const openModal = createAction(types.UI.OPEN_MODAL);

      describe('if modal is not open', () => {
        it('adds the given modal to open', () => {
          const initialState = Immutable({ open: [] });
          const action = openModal('some-modal');
          const nextState = modalsReducer(initialState, action);
          const expected = Immutable({ open: ['some-modal'] });

          expect(nextState).to.deep.equal(expected);
        });

        it('does not affect other modals in open', () => {
          const initialState = Immutable({ open: ['other-modal'] });
          const action = openModal('some-modal');
          const nextState = modalsReducer(initialState, action);
          const expected = Immutable({ open: ['other-modal', 'some-modal'] });

          expect(nextState).to.deep.equal(expected);
        });
      });

      describe('if modal is already open', () => {
        it('does not change open in any way', () => {
          const action = openModal('some-modal');
          const initialState = Immutable({ open: ['other-modal', 'some-modal'] });
          const nextState = modalsReducer(initialState, action);

          expect(nextState).to.deep.equal(initialState);
        });
      });
    });
  });
});
