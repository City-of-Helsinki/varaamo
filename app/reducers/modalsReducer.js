import _ from 'lodash';

import types from 'constants/ActionTypes';

export function modalsReducer(state, action) {
  let modal;

  switch (action.type) {

  case types.UI.CLOSE_MODAL:
    modal = action.payload;

    if (_.includes(state.open, modal)) {
      return state.merge({ open: _.without(state.open, modal) });
    }

    return state;

  case types.UI.OPEN_MODAL:
    modal = action.payload;

    if (_.includes(state.open, modal)) {
      return state;
    }

    return state.merge({ open: [...state.open, modal] });

  default:
    return state;
  }
}
