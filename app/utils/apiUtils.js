import { camelizeKeys, decamelizeKeys } from 'humps';
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';
import { normalize } from 'normalizr';
import { RSAA, getJSON } from 'redux-api-middleware';

import constants from '../constants/AppConstants';

function buildAPIUrl(endpoint, params) {
  let url = `${constants.API_URL}/${endpoint}/`;

  const nonEmptyParams = pickBy(params, (value) => value !== '');

  if (!isEmpty(nonEmptyParams)) {
    url = `${url}?${getSearchParamsString(nonEmptyParams)}`;
  }

  return url;
}

function createTransformFunction(schema) {
  return (json) => {
    const camelizedJson = camelizeKeys(json);
    if (schema) {
      return normalize(camelizedJson, schema);
    }
    return camelizedJson;
  };
}

function getErrorTypeDescriptor(type, options = {}) {
  return {
    type,
    meta: (action) => ({
      API_ACTION: {
        apiRequestFinish: true,
        countable: options.countable,
        type: action[RSAA].types[0].type,
      },
      ...options.meta,
    }),
  };
}

function getHeadersCreator(headers) {
  return (state) => {
    const authorizationHeaders = {};
    if (state.auth.token) {
      authorizationHeaders.Authorization = `JWT ${state.auth.token}`;
    }
    return {
      ...constants.REQUIRED_API_HEADERS,
      ...headers,
      ...authorizationHeaders,
    };
  };
}

function getRequestTypeDescriptor(type, options = {}) {
  return {
    type,
    meta: {
      API_ACTION: {
        apiRequestStart: true,
        countable: options.countable,
        type,
      },
      ...options.meta,
    },
  };
}

function getSearchParamsString(params) {
  const decamelized = decamelizeKeys(params);
  const parts = [];

  Object.keys(decamelized).forEach((key) => {
    parts.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(decamelized[key])}`
    );
  });

  return parts.join('&');
}

function getSuccessPayload(options) {
  return (action, state, response) =>
    getJSON(response).then(createTransformFunction(options.schema));
}

function getSuccessTypeDescriptor(type, options = {}) {
  return {
    type,
    payload: options.payload || getSuccessPayload(options),

    meta: (action) => ({
      API_ACTION: {
        apiRequestFinish: true,
        countable: options.countable,
        type: action[RSAA].types[0].type,
      },
      ...options.meta,
    }),
  };
}

export {
  buildAPIUrl,
  createTransformFunction,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSearchParamsString,
  getSuccessTypeDescriptor,
};
