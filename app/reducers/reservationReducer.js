import _ from 'lodash';

import ActionTypes from 'constants/ActionTypes';

export function reservationReducer(state, action) {
  switch (action.type) {

  case ActionTypes.CHANGE_RESERVATION_DATE:
    const date = action.payload;
    return state.merge({ date });

  case ActionTypes.TOGGLE_TIME_SLOT:
    const slot = action.payload;
    if (_.includes(state.selected, slot)) {
      return state.merge({ selected: _.without(state.selected, slot) });
    }

    return state.merge({ selected: [...state.selected, slot] });

  default:
    return state;
  }
}
