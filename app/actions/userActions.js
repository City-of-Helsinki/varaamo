import types from 'constants/ActionTypes';

import { CALL_API } from 'redux-api-middleware';

import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/apiUtils';

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
                args: ['User', 'user-get', id],
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

export {
  fetchUser,
};
