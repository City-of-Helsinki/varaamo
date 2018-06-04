import { createAction } from 'redux-actions';
import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import constants from 'constants/AppConstants';
import schemas from 'store/middleware/Schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/apiUtils';
import { getFetchParamsFromFilters } from 'utils/searchUtils';

const clearSearchResults = createAction(types.UI.CLEAR_SEARCH_FILTERS);
const toggleMap = createAction(types.UI.TOGGLE_SEARCH_SHOW_MAP);
const searchMapClick = createAction(types.UI.SEARCH_MAP_CLICK);
const selectUnit = createAction(types.UI.SELECT_SEARCH_RESULTS_UNIT);

function getPiwikActionName(searchParams) {
  if (searchParams.search) {
    return searchParams.search;
  } else if (searchParams.purpose) {
    return `category: ${searchParams.purpose}`;
  }

  return '-empty-search-';
}

function searchResources(filters = {}) {
  const params = getFetchParamsFromFilters(filters);
  const fetchParams = Object.assign({}, params, { pageSize: constants.SEARCH_PAGE_SIZE });
  const piwikActionName = getPiwikActionName(fetchParams);

  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(
          types.API.SEARCH_RESULTS_GET_REQUEST,
          {
            meta: {
              track: {
                event: 'trackEvent',
                args: [
                  'Search',
                  'search-get',
                  piwikActionName,
                ],
              },
            },
          }
        ),
        getSuccessTypeDescriptor(
          types.API.SEARCH_RESULTS_GET_SUCCESS,
          { schema: schemas.paginatedResourcesSchema }
        ),
        getErrorTypeDescriptor(types.API.SEARCH_RESULTS_GET_ERROR),
      ],
      endpoint: buildAPIUrl('resource', fetchParams),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}

export {
  clearSearchResults,
  getPiwikActionName,
  searchResources,
  searchMapClick,
  selectUnit,
  toggleMap,
};
