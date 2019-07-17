import get from 'lodash/get';

import constants from '../../../app/constants/AppConstants';
import store from '../../store';

let authToken;

store.subscribe(() => {
  const state = store.getState();
  authToken = get(state, 'auth.token');
});

function getAuthorizationHeader() {
  return authToken
    ? { Authorization: `JWT ${authToken}` }
    : {};
}

/**
 * Getter for API url.
 * @param endpoint
 * @param params
 * @param trailingSlash This is because Django adds trailing slash into every endpoint.
 * @returns {string}
 */
export const getUrl = (endpoint, params = {}, trailingSlash = true) => {
  const query = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
  return `${constants.API_URL}/${endpoint}${trailingSlash ? '/' : ''}${query ? `?${query}` : ''}`;
};

/**
 * Getter for default headers.
 * @returns {object}
 */
export const getHeaders = () => ({
  ...constants.REQUIRED_API_HEADERS,
  ...getAuthorizationHeader(),
});
