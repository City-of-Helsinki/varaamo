import map from 'lodash/map';
import uniq from 'lodash/uniq';
import filter from 'lodash/filter';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  date: undefined,
  filteredResourceTypes: [],
  resourceIds: [],
});

function adminResourcesPageReducer(state = initialState, action) {
  switch (action.type) {
    case types.UI.CHANGE_ADMIN_RESOURCES_PAGE_DATE: {
      return state.merge({ date: action.payload || undefined });
    }

    case types.UI.FILTER_ADMIN_RESOURCE_TYPE: {
      return state.merge({
        filteredResourceTypes: uniq([...state.filteredResourceTypes, action.payload]),
      });
    }

    case types.UI.UNFILTER_ADMIN_RESOURCE_TYPE: {
      return state.merge({ filteredResourceTypes: filter(
          state.filteredResourceTypes,
          resourceType => resourceType !== action.payload
        ) });
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
