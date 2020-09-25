import { createAction } from 'redux-actions';

import accessibilityReducer from '../accessibilityReducer';
import types from '../../../../constants/ActionTypes';

describe('state/reducers/accessibilityReducer', () => {
  describe('handling actions', () => {
    describe('UI.SET_ACCESSIBILITY_PREFERENCES', () => {
      it('sets array payload as new accessibility preference', () => {
        const newPreferences = [1, 2, 3];
        const nextState = accessibilityReducer(
          {},
          createAction(types.UI.SET_ACCESSIBILITY_PREFERENCES)(newPreferences),
        );
        expect(nextState.accessibilityPreferences).toEqual(newPreferences);
      });

      it('sets empty array as accessibility preference if payload is not an array', () => {
        const toTest = [null, undefined, 'a', 0, false];
        toTest.forEach((value) => {
          const nextState = accessibilityReducer(
            {},
            createAction(types.UI.SET_ACCESSIBILITY_PREFERENCES)(value),
          );
          expect(nextState.accessibilityPreferences).toEqual([]);
        });
      });
    });
  });
});
