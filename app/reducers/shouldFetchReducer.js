import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  purposes: true,
  resources: true,
  units: true,
});

function shouldFetchReducer(state = initialState, action) {
  switch (action.type) {

    case types.API.PURPOSES_GET_SUCCESS: {
      return state.merge({
        purposes: false,
      });
    }

    case types.API.RESOURCES_GET_SUCCESS: {
      return state.merge({
        resources: false,
      });
    }

    case types.API.UNITS_GET_SUCCESS: {
      return state.merge({
        units: false,
      });
    }

    default: {
      return state;
    }
  }
}

export default shouldFetchReducer;
