import Immutable from 'seamless-immutable';

import types from '../../../constants/ActionTypes';

const initialState = Immutable({
  resources: true,
  units: true,
});

function shouldFetchReducer(state = initialState, action) {
  switch (action.type) {
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
