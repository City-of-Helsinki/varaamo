import { expect } from 'chai';

import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import * as types from 'constants/ActionTypes';
import { modalsReducer as reducer } from 'reducers/modalsReducer';

describe('Reducer: modalsReducer', () => {
  describe('handling actions', () => {
    describe('CLOSE_MODAL', () => {
      const closeModal = createAction(types.CLOSE_MODAL);

      describe('if modal is open', () => {
        it('should remove the given modal from open', () => {
          const initialState = Immutable({ open: ['some-modal'] });
          const action = closeModal('some-modal');
          const nextState = reducer(initialState, action);
          const expected = Immutable({ open: [] });

          expect(nextState).to.deep.equal(expected);
        });

        it('should not affect other modals in open', () => {
          const initialState = Immutable({ open: ['other-modal', 'some-modal'] });
          const action = closeModal('some-modal');
          const nextState = reducer(initialState, action);
          const expected = Immutable({ open: ['other-modal'] });

          expect(nextState).to.deep.equal(expected);
        });
      });

      describe('if modal is not open', () => {
        it('should not change open in any way', () => {
          const action = closeModal('some-modal');
          const initialState = Immutable({ open: ['other-modal'] });
          const nextState = reducer(initialState, action);

          expect(nextState).to.deep.equal(initialState);
        });
      });
    });

    describe('OPEN_MODAL', () => {
      const openModal = createAction(types.OPEN_MODAL);

      describe('if modal is not open', () => {
        it('should add the given modal to open', () => {
          const initialState = Immutable({ open: [] });
          const action = openModal('some-modal');
          const nextState = reducer(initialState, action);
          const expected = Immutable({ open: ['some-modal'] });

          expect(nextState).to.deep.equal(expected);
        });

        it('should not affect other modals in open', () => {
          const initialState = Immutable({ open: ['other-modal'] });
          const action = openModal('some-modal');
          const nextState = reducer(initialState, action);
          const expected = Immutable({ open: ['other-modal', 'some-modal'] });

          expect(nextState).to.deep.equal(expected);
        });
      });

      describe('if modal is already open', () => {
        it('should not change open in any way', () => {
          const action = openModal('some-modal');
          const initialState = Immutable({ open: ['other-modal', 'some-modal'] });
          const nextState = reducer(initialState, action);

          expect(nextState).to.deep.equal(initialState);
        });
      });
    });
  });
});
