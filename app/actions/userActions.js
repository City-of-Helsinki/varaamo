import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/APIUtils';

export default {
  fetchUser,
};

function fetchUser(id, params = {}) {
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(
          types.API.USER_GET_REQUEST,
          {
            meta: {
              track: {
                event: 'trackEvent',
                args: ['User', 'get', id],
              },
            },
          }
        ),
        getSuccessTypeDescriptor(types.API.USER_GET_SUCCESS),
        getErrorTypeDescriptor(types.API.USER_GET_ERROR),
      ],
      endpoint: buildAPIUrl(`user/${id}`, params),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}
