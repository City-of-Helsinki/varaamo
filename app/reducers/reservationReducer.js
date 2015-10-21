import _ from 'lodash';

import types from 'constants/ActionTypes';

export function reservationReducer(state, action) {
  switch (action.type) {

  case types.API.MAKE_RESERVATION_SUCCESS:
    return state.merge({ selected: [] });

  case types.UI.CHANGE_RESERVATION_DATE:
    const date = action.payload;
    return state.merge({ date });

  case types.UI.TOGGLE_TIME_SLOT:
    const slot = action.payload;
    if (_.includes(state.selected, slot)) {
      return state.merge({ selected: _.without(state.selected, slot) });
    }
    return state.merge({ selected: [...state.selected, slot] });

  default:
    return state;
  }
}
