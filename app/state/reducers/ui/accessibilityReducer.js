import Immutable from 'seamless-immutable';

import types from '../../../constants/ActionTypes';
import FontSizes from '../../../constants/FontSizes';
import { getSelA11yPref } from '../../../utils/accessibilityUtils';

const initialState = Immutable({
  fontSize: FontSizes.SMALL,
  isHighContrast: false,
  accessibilityPreferences: getSelA11yPref(),
});

function changeFontSize(state, data) {
  return { ...state, fontSize: data };
}

function toggleContrast(state) {
  return { ...state, isHighContrast: !state.isHighContrast };
}

function setAccessibilityPreferences(state, preferences) {
  const newPreferences = Array.isArray(preferences) ? preferences : [];
  return { ...state, accessibilityPreferences: newPreferences };
}

function accessibilityReducer(state = initialState, action) {
  switch (action.type) {
    case types.UI.CHANGE_FONTSIZE: {
      return changeFontSize(state, action.payload);
    }
    case types.UI.TOGGLE_HIGH_CONTRAST: {
      return toggleContrast(state);
    }
    case types.UI.SET_ACCESSIBILITY_PREFERENCES: {
      return setAccessibilityPreferences(state, action.payload);
    }
    default: {
      return state;
    }
  }
}

export default accessibilityReducer;
