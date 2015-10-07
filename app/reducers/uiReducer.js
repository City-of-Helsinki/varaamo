import Immutable from 'seamless-immutable';

import ActionTypes from 'constants/ActionTypes';
import { searchReducer } from 'reducers/searchReducer';

const initialState = Immutable({
  search: {
    results: [],
  },
});

export function uiReducer(state = initialState, action) {
  switch (action.type) {

  case ActionTypes.FETCH_RESOURCES_SUCCESS:
    const search = searchReducer(state.search, action);
    return state.merge({ search });

  default:
    return state;
  }
}
