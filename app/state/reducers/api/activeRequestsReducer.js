import Immutable from 'seamless-immutable';

const initialState = Immutable({});

function activeRequestsReducer(state = initialState, action) {
  if (action.meta && action.meta.API_ACTION) {
    const {
      apiRequestStart,
      apiRequestFinish,
      countable,
      type,
    } = action.meta.API_ACTION;
    let nextState;

    if (apiRequestStart) {
      if (state[type]) {
        nextState = { ...state, [type]: state[type] + 1 };
      } else {
        nextState = { ...state, [type]: 1 };
      }
    }

    if (apiRequestFinish) {
      if (state[type]) {
        if (countable) {
          nextState = { ...state, [type]: state[type] - 1 };
        } else {
          nextState = { ...state, [type]: 0 };
        }
      } else {
        nextState = { ...state, [type]: 0 };
      }
    }

    return state.merge(nextState || state);
  }

  return state;
}

export default activeRequestsReducer;
