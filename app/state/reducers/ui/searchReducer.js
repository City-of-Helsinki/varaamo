import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import { pickSupportedFilters } from 'utils/searchUtils';
import { getDuration, getEndTimeString, getStartTimeString } from 'utils/timeUtils';

const initialState = Immutable({
  filters: {
    date: '',
    people: '',
    purpose: '',
    search: '',
    distance: '',
    duration: 0,
    start: '',
    end: '',
  },
  page: 1,
  position: null,
  resultCount: 0,
  results: [],
  searchDone: false,
  showMap: false,
  unitId: null,
});

function searchReducer(state = initialState, action) {
  switch (action.type) {

    case types.API.SEARCH_RESULTS_GET_SUCCESS: {
      const results = Object.keys(action.payload.entities.resources || {});
      const paginatedResources = Object.values(action.payload.entities.paginatedResources || {});
      const resultCount = paginatedResources.length ? paginatedResources[0].count : 0;
      return state.merge({
        resultCount,
        results,
        searchDone: true,
      });
    }

    case types.UI.CHANGE_SEARCH_FILTERS: {
      const filters = pickSupportedFilters(action.payload);
      return state.merge({ filters }, { deep: true });
    }

    case types.UI.CLEAR_SEARCH_FILTERS: {
      const { results, searchDone } = state;
      return initialState.merge({ results, searchDone });
    }

    case types.UI.ENABLE_GEOPOSITION_SUCCESS: {
      const position = {
        lat: action.payload.coords.latitude,
        lon: action.payload.coords.longitude,
      };
      return state.merge({ position });
    }

    case types.UI.ENABLE_GEOPOSITION_ERROR:
    case types.UI.DISABLE_GEOPOSITION: {
      const position = null;
      return state.merge({ position });
    }

    case types.UI.DISABLE_TIME_RANGE: {
      const duration = 0;
      const end = '';
      const start = '';
      const filters = pickSupportedFilters({ duration, end, start });
      return state.merge({ filters }, { deep: true });
    }

    case types.UI.ENABLE_TIME_RANGE: {
      const duration = getDuration();
      const end = getEndTimeString();
      const start = getStartTimeString();
      const filters = pickSupportedFilters({ duration, end, start });
      return state.merge({ filters }, { deep: true });
    }

    case types.UI.TOGGLE_SEARCH_SHOW_MAP: {
      return state.merge({ showMap: !state.showMap });
    }

    case types.UI.SELECT_SEARCH_RESULTS_UNIT: {
      return state.merge({ unitId: action.payload });
    }

    case types.UI.SEARCH_MAP_CLICK: {
      return state.merge({ unitId: null });
    }

    default: {
      return state;
    }
  }
}

export default searchReducer;
