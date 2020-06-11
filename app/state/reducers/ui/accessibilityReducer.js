import Immutable from 'seamless-immutable';

import types from '../../../constants/ActionTypes';
import FontSizes from '../../../constants/FontSizes';

const initialState = Immutable({
  fontSize: FontSizes.SMALL,
});

function changeFontSize(state, data) {
  return { ...state, fontSize: data };
}

function accessibilityReducer(state = initialState, action) {
  switch (action.type) {
    case types.UI.CHANGE_FONTSIZE: {
      return changeFontSize(state, action.payload);
    }
    default: {
      return state;
    }
  }
}

export default accessibilityReducer;
