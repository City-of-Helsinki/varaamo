import Immutable from 'seamless-immutable';

import ActionTypes from 'constants/ActionTypes';
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
      purpose: '',
      search: '',
    },
    results: [],
  },
});

export function uiReducer(state = initialState, action) {
  switch (action.type) {

  case ActionTypes.CHANGE_RESERVATION_DATE:
  case ActionTypes.MAKE_RESERVATION_SUCCESS:
  case ActionTypes.TOGGLE_TIME_SLOT:
    const reservation = reservationReducer(state.reservation, action);
    return state.merge({ reservation });

  case ActionTypes.CHANGE_SEARCH_FILTERS:
  case ActionTypes.FETCH_RESOURCES_SUCCESS:
    const search = searchReducer(state.search, action);
    return state.merge({ search });

  case ActionTypes.CLOSE_MODAL:
  case ActionTypes.OPEN_MODAL:
    const modals = modalsReducer(state.modals, action);
    return state.merge({ modals });

  default:
    return state;
  }
}
