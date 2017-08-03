import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  resourceId: null,
  showMap: false,
  unitId: null,
});

function resourceMapReducer(state = initialState, action) {
  switch (action.type) {

    case types.API.RESOURCE_GET_SUCCESS: {
      const resource = action.payload.entities.resources[state.resourceId];
      if (resource) {
        return state.merge({ unitId: resource.unit });
      }
      return state;
    }

    case types.UI.TOGGLE_RESOURCE_SHOW_MAP: {
      return state.merge({ showMap: !state.showMap });
    }

    case 'ENTER_OR_CHANGE_RESOURCE_PAGE': {
      return initialState.merge({
        resourceId: action.payload.pathname.slice(-12),
      });
    }

    default: {
      return state;
    }
  }
}

export default resourceMapReducer;
