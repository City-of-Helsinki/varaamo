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

function fetchFavoritedResources(timeAsMoment, source) {
  // FIXME: We need to pass large time ranges here to get reservation information of resources.
  // This is in case we need to display multiday reservations far in the past/future.
  // This might cause slower queries to the backend: need to investigate.
  const params = {
    end: timeAsMoment.clone().add(100, 'years').toISOString(),
    is_favorite: true,
    start: timeAsMoment.clone().add(-100, 'years').toISOString(),
  };
  return fetchResources(params, source);
}

function fetchResource(id, params = {}) {
  return {
    [RSAA]: {
      types: [
        getRequestTypeDescriptor(types.API.RESOURCE_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.RESOURCE_GET_SUCCESS,
          { schema: schemas.resourceSchema },
        ),
        getErrorTypeDescriptor(types.API.RESOURCE_GET_ERROR),
      ],
      endpoint: buildAPIUrl(`resource/${id}`, params),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}

function fetchResources(params = {}, source) {
  const fetchParams = Object.assign({}, params, { pageSize: 500 });
  return {
    [RSAA]: {
      types: [
        getRequestTypeDescriptor(types.API.RESOURCES_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.RESOURCES_GET_SUCCESS,
          {
            meta: { source },
            schema: schemas.paginatedResourcesSchema,
          },
        ),
        getErrorTypeDescriptor(types.API.RESOURCES_GET_ERROR),
      ],
      endpoint: buildAPIUrl('resource', fetchParams),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}

function favoriteResource(id) {
  return {
    [RSAA]: {
      types: [
        getRequestTypeDescriptor(types.API.RESOURCE_FAVORITE_POST_REQUEST),
        getSuccessTypeDescriptor(
          types.API.RESOURCE_FAVORITE_POST_SUCCESS,
          { meta: { id } },
        ),
        getErrorTypeDescriptor(types.API.RESOURCE_FAVORITE_POST_ERROR),
      ],
      endpoint: buildAPIUrl(`resource/${id}/favorite`),
      method: 'POST',
      headers: getHeadersCreator(),
    },
  };
}

function unfavoriteResource(id) {
  return {
    [RSAA]: {
      types: [
        getRequestTypeDescriptor(types.API.RESOURCE_UNFAVORITE_POST_REQUEST),
        getSuccessTypeDescriptor(
          types.API.RESOURCE_UNFAVORITE_POST_SUCCESS,
          { meta: { id } },
        ),
        getErrorTypeDescriptor(types.API.RESOURCE_UNFAVORITE_POST_ERROR),
      ],
      endpoint: buildAPIUrl(`resource/${id}/unfavorite`),
      method: 'POST',
      headers: getHeadersCreator(),
    },
  };
}


export {
  fetchFavoritedResources,
  fetchResource,
  fetchResources,
  favoriteResource,
  unfavoriteResource,
};
