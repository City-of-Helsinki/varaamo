import { setSelA11yPref } from '../../utils/accessibilityUtils';
import types from '../../constants/ActionTypes';

const accessibility = () => next => (action) => {
  if (
    action
    && action.type
    && action.type === types.UI.SET_ACCESSIBILITY_PREFERENCES
  ) {
    setSelA11yPref(action.payload);
  }

  return next(action);
};

export default accessibility;
