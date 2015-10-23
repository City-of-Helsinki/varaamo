import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import { reservationReducer } from 'reducers/reservationReducer';
import { searchReducer } from 'reducers/searchReducer';
import { modalsReducer } from 'reducers/modalsReducer';

const initialState = Immutable({
  modals: {
    open: [],
  },
  reservation: {
    date: '',
    selected: [],
  },
  search: {
    filters: {
      date: '',
      purpose: '',
      search: '',
    },
    results: [],
  },
});

export function uiReducer(state = initialState, action) {
  switch (action.type) {

  case types.API.RESERVATION_POST_SUCCESS:
  case types.UI.CHANGE_RESERVATION_DATE:
  case types.UI.TOGGLE_TIME_SLOT:
    const reservation = reservationReducer(state.reservation, action);
    return state.merge({ reservation });

  case types.API.RESOURCES_GET_SUCCESS:
  case types.UI.CHANGE_SEARCH_FILTERS:
    const search = searchReducer(state.search, action);
    return state.merge({ search });

  case types.UI.CLOSE_MODAL:
  case types.UI.OPEN_MODAL:
    const modals = modalsReducer(state.modals, action);
    return state.merge({ modals });

  default:
    return state;
  }
}
