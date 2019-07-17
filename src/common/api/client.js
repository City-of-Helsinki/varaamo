import axios from 'axios';
import get from 'lodash/get';

import constants from '../../../app/constants/AppConstants';
import store from '../../store';

let authToken;

store.subscribe(() => {
  const state = store.getState();
  authToken = get(state, 'auth.token');
});

export class ApiClient {
  baseUrl;

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getUrl = (endpoint) => {
    // URLs in Django must have a trailing slash
    const endsWithTrailingSlash = endpoint.substring(endpoint.length - 1) === '/';
    return `${constants.API_URL}/${endpoint}${endsWithTrailingSlash ? '' : '/'}`;
  };

  getHeaders = () => ({
    ...constants.REQUIRED_API_HEADERS,
    ...(authToken
      ? { Authorization: `JWT ${authToken}` }
      : {}),
  });

  request = async ({
    method,
    endpoint,
    data = {},
    headers = {},
  }) => {
    const dataOrParams = ['GET', 'DELETE'].includes(method.toUpperCase()) ? 'params' : 'data';

    return axios
      .request({
        method,
        url: this.getUrl(endpoint),
        headers: {
          ...this.getHeaders(),
          ...headers,
        },
        [dataOrParams]: data,
      })
      .then((response) => {
        return {
          data: get(response, 'data'),
          error: null,
        };
      })
      .catch((error) => {
        return {
          data: null,
          error: get(error, 'response'),
        };
      });
  };

  /**
   * Make a GET request into the API.
   * @param endpoint
   * @param data
   * @param config
   * @returns {Promise}
   */
  get = (endpoint, data = {}, config = {}) => {
    return this.request({
      method: 'GET',
      endpoint,
      data,
      ...config,
    });
  };

  /**
   * Make a POST request into the API.
   * @param endpoint
   * @param data
   * @param config
   * @returns {Promise}
   */
  post = (endpoint, data = {}, config = {}) => {
    return this.request({
      method: 'POST',
      endpoint,
      data,
      ...config,
    });
  };

  /**
   * Make a DELETE request into the API.
   * @param endpoint
   * @param data
   * @param config
   * @returns {Promise}
   */
  delete = (endpoint, data = {}, config = {}) => {
    return this.request({
      method: 'DELETE',
      endpoint,
      data,
      ...config,
    });
  };

  /**
   * Make a PUT request into the API.
   * @param endpoint
   * @param data
   * @param config
   * @returns {Promise}
   */
  put = (endpoint, data = {}, config = {}) => {
    return this.request({
      method: 'PUT',
      endpoint,
      data,
      ...config,
    });
  };

  /**
   * Make a PATCH request into the API.
   * @param endpoint
   * @param data
   * @param config
   * @returns {Promise}
   */
  patch = (endpoint, data = {}, config = {}) => {
    return this.request({
      method: 'PATCH',
      endpoint,
      data,
      ...config,
    });
  };
}

export default new ApiClient(constants.API_URL);
