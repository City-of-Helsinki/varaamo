import { RSAA } from 'redux-api-middleware';

import types from '../constants/ActionTypes';
import schemas from '../store/middleware/Schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from '../utils/apiUtils';

function fetchPurposes() {
  return {
    [RSAA]: {
      types: [
        getRequestTypeDescriptor(types.API.PURPOSES_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.PURPOSES_GET_SUCCESS,
          { schema: schemas.paginatedPurposesSchema }
        ),
        getErrorTypeDescriptor(types.API.PURPOSES_GET_ERROR),
      ],
      endpoint: buildAPIUrl('purpose'),
      method: 'GET',
      headers: getHeadersCreator(),
      bailout: state => !state.api.shouldFetch.purposes,
    },
  };
}

export {
  fetchPurposes,
};
