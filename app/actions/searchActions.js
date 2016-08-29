import { createAction } from 'redux-actions';
import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import { paginatedResourcesSchema, typeaheadSchema } from 'middleware/Schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/APIUtils';

const clearSearchResults = createAction(types.UI.CLEAR_SEARCH_RESULTS);

function getTypeaheadSuggestions(params = {}) {
  const fetchParams = Object.assign({}, params, { pageSize: 100 });

  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.TYPEAHEAD_SUGGESTIONS_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.TYPEAHEAD_SUGGESTIONS_GET_SUCCESS,
          { schema: typeaheadSchema }
        ),
        getErrorTypeDescriptor(types.API.TYPEAHEAD_SUGGESTIONS_GET_ERROR),
      ],
      endpoint: buildAPIUrl('search', fetchParams),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}

function searchResources(params = {}) {
  const fetchParams = Object.assign({}, params, { pageSize: 100 });

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
                  fetchParams.search,
                ],
              },
            },
          }
        ),
        getSuccessTypeDescriptor(
          types.API.SEARCH_RESULTS_GET_SUCCESS,
          { schema: paginatedResourcesSchema }
        ),
        getErrorTypeDescriptor(types.API.SEARCH_RESULTS_GET_ERROR),
      ],
      endpoint: buildAPIUrl('resource', fetchParams),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}

export default {
  clearSearchResults,
  getTypeaheadSuggestions,
  searchResources,
};
