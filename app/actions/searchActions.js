import { createAction } from 'redux-actions';
import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import schemas from 'state/middleware/Schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/apiUtils';
import { getFetchParamsFromFilters } from 'utils/searchUtils';

const clearSearchResults = createAction(types.UI.CLEAR_SEARCH_RESULTS);

function getPiwikActionName(searchParams) {
  if (searchParams.search) {
    return searchParams.search;
  } else if (searchParams.purpose) {
    return `category: ${searchParams.purpose}`;
  }

  return '-empty-search-';
}

function getTypeaheadSuggestions(params = {}) {
  const fetchParams = Object.assign({}, params, { pageSize: 100 });

  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.TYPEAHEAD_SUGGESTIONS_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.TYPEAHEAD_SUGGESTIONS_GET_SUCCESS,
          { schema: schemas.typeaheadSchema }
        ),
        getErrorTypeDescriptor(types.API.TYPEAHEAD_SUGGESTIONS_GET_ERROR),
      ],
      endpoint: buildAPIUrl('search', fetchParams),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}

function searchResources(filters = {}) {
  const params = getFetchParamsFromFilters(filters);
  const fetchParams = Object.assign({}, params, { pageSize: 100 });
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
  getTypeaheadSuggestions,
  searchResources,
};
