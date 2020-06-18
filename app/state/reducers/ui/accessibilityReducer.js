import Immutable from 'seamless-immutable';

import types from '../../../constants/ActionTypes';
import FontSizes from '../../../constants/FontSizes';


const initialState = Immutable({
  fontSize: FontSizes.SMALL,
  isHighContrast: false,
});

function changeFontSize(state, data) {
  return { ...state, fontSize: data };
}

function toggleContrast(state) {
  return { ...state, isHighContrast: !state.isHighContrast };
}

function accessibilityReducer(state = initialState, action) {
  switch (action.type) {
    case types.UI.CHANGE_FONTSIZE: {
      return changeFontSize(state, action.payload);
    }
    case types.UI.TOGGLE_HIGH_CONTRAST: {
      return toggleContrast(state);
    }
    default: {
      return state;
    }
  }
}

export default accessibilityReducer;
