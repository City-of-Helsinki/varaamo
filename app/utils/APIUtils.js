import { camelizeKeys, decamelizeKeys } from 'humps';
import _ from 'lodash';
import { normalize } from 'normalizr';
import { CALL_API, getJSON } from 'redux-api-middleware';

import { API_URL, REQUIRED_API_HEADERS } from 'constants/AppConstants';

export default {
  buildAPIUrl,
  createTransformFunction,
  getErrorTypeDescriptor,
  getHeaders,
  getRequestTypeDescriptor,
  getSearchParamsString,
  getSuccessTypeDescriptor,
};

function buildAPIUrl(endpoint, params) {
  let url = `${API_URL}/${endpoint}/`;

  const nonEmptyParams = _.pick(params, (value) => value !== '');

  if (!_.isEmpty(nonEmptyParams)) {
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
    meta: (action) => {
      return {
        API_ACTION: {
          apiRequestFinish: true,
          countable: options.countable,
          type: action[CALL_API].types[0].type,
        },
      };
    },
  };
}

function getHeaders(headers) {
  return Object.assign({}, REQUIRED_API_HEADERS, headers);
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
    },
  };
}

function getSearchParamsString(params) {
  const decamelized = decamelizeKeys(params);
  const parts = [];

  Object.keys(decamelized).forEach(key => {
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(decamelized[key])}`);
  });

  return parts.join('&');
}

function getSuccessTypeDescriptor(type, options = {}) {
  return {
    type,
    payload: (action, state, response) => {
      return getJSON(response).then(createTransformFunction(options.schema));
    },
    meta: (action) => {
      return {
        API_ACTION: {
          apiRequestFinish: true,
          countable: options.countable,
          type: action[CALL_API].types[0].type,
        },
      };
    },
  };
}
