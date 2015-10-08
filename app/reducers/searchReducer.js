import ActionTypes from 'constants/ActionTypes';

export function searchReducer(state, action) {
  switch (action.type) {

  case ActionTypes.CHANGE_PURPOSE_FILTER:
    const value = action.payload;
    return state.merge({ purposeFilter: value });

  case ActionTypes.FETCH_RESOURCES_SUCCESS:
    const results = action.payload.result;
    return state.merge({ results });

  default:
    return state;
  }
}
