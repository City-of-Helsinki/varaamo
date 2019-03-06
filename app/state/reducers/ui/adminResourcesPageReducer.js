import types from 'constants/ActionTypes';

import map from 'lodash/map';
import uniq from 'lodash/uniq';
import filter from 'lodash/filter';
import Immutable from 'seamless-immutable';


const initialState = Immutable({
  date: undefined,
  selectedResourceTypes: [],
  resourceIds: [],
});

function adminResourcesPageReducer(state = initialState, action) {
  switch (action.type) {
    case types.UI.CHANGE_ADMIN_RESOURCES_PAGE_DATE: {
      return state.merge({ date: action.payload || undefined });
    }

    case types.UI.SELECT_ADMIN_RESOURCE_TYPE: {
      return state.merge({
        selectedResourceTypes: uniq([...state.selectedResourceTypes, action.payload]),
      });
    }

    case types.UI.UNSELECT_ADMIN_RESOURCE_TYPE: {
      return state.merge({
        selectedResourceTypes: filter(
          state.selectedResourceTypes,
          resourceType => resourceType !== action.payload
        )
      });
    }

    case types.API.RESOURCES_GET_SUCCESS: {
      const meta = action.meta;
      if (meta && meta.source === 'adminResourcesPage') {
        return state.merge({ resourceIds: map(action.payload.entities.resources, 'id') });
      }
      return state;
    }

    default: {
      return state;
    }
  }
}

export default adminResourcesPageReducer;
