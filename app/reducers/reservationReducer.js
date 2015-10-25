import _ from 'lodash';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  date: '',
  selected: [],
});

function reservationReducer(state = initialState, action) {
  switch (action.type) {

  case types.API.RESERVATION_POST_SUCCESS:
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

export default reservationReducer;
