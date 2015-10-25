function activeRequestsReducer(state, action) {
  if (action.meta && action.meta.API_ACTION) {
    const { apiRequestStart, apiRequestFinish, countable, type } = action.meta.API_ACTION;
    let nextState;

    if (apiRequestStart) {
      if (state[type]) {
        nextState = Object.assign({}, state, { [type]: state[type] + 1 });
      } else {
        nextState = Object.assign({}, state, { [type]: 1 });
      }
    }

    if (apiRequestFinish) {
      if (state[type]) {
        if (countable) {
          nextState = Object.assign({}, state, { [type]: state[type] - 1 });
        } else {
          nextState = Object.assign({}, state, { [type]: 0 });
        }
      } else {
        nextState = Object.assign({}, state, { [type]: 0 });
      }
    }

    return state.merge(nextState || state);
  }

  return state;
}

export default activeRequestsReducer;
