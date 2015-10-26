import _ from 'lodash';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';

const initialState = Immutable({
  date: '',
  selected: [],
  toDelete: [],
});

function reservationReducer(state = initialState, action) {
  switch (action.type) {

  case types.API.RESERVATION_POST_SUCCESS:
    return state.merge({ selected: [] });

  case types.UI.CHANGE_RESERVATION_DATE:
    const date = action.payload;
    return state.merge({ date });

  case types.UI.CLOSE_MODAL:
    const modal = action.payload;
    if (modal === ModalTypes.DELETE_RESERVATION) {
      return state.merge({ toDelete: [] });
    }
    return state;

  case types.UI.SELECT_RESERVATION_TO_DELETE:
    const reservation = action.payload;
    return state.merge({ toDelete: [...state.toDelete, reservation] });

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
