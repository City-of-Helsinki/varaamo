
import types from 'constants/ActionTypes';

import { CALL_API } from 'redux-api-middleware';

import schemas from 'store/middleware/Schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/apiUtils';

function sortResources(orderBy) {
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.SORT_RESULTS_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.SORT_RESULTS_GET_SUCCESS,
          { schema: schemas.paginatedResourcesSchema }
        ),
        getErrorTypeDescriptor(types.API.SORT_RESULTS_GET_ERROR),
      ],
      endpoint: buildAPIUrl(`resource/?order_by=${orderBy}`),
      method: 'GET',
      headers: getHeadersCreator(),
      bailout: state => !state.api.shouldFetch.resources,
    },
  };
}

export {
  sortResources,
};
