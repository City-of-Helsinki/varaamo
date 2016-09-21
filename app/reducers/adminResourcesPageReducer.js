import map from 'lodash/map';
import filter from 'lodash/filter';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  resourceIds: [],
});

function adminResourcesPageReducer(state = initialState, action) {
  switch (action.type) {
    case types.API.RESOURCES_GET_SUCCESS: {
      const meta = action.meta;
      if (meta && meta.source === 'adminResourcesPage') {
        const resources = filter(action.payload.entities.resources, 'public');
        return state.merge({ resourceIds: map(resources, 'id') });
      }
      return state;
    }

    default: {
      return state;
    }
  }
}

export default adminResourcesPageReducer;
