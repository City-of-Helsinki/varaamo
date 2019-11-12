import axios from 'axios';
import get from 'lodash/get';

import constants from '../../../app/constants/AppConstants';
import store from '../../store';
import { parseData } from '../data/utils';

let authToken;

// Response interceptor to be able to handle errors.
axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code that falls out of the range of 2xx.
    // TODO: Find all the forms Respa may send us errors in.
    // TODO: Create a way to translate these messages.
    const nonFieldError = get(error, 'response.data.non_field_errors', '');
    const permissionError = get(error, 'data.detail', '');
    const state = get(error, 'response.data.state', '')[0];
    if (nonFieldError && permissionError) {
      throw new Error(`${nonFieldError} ${permissionError}`);
    } else if (state) {
      throw new Error(`${state}`);
    } else {
      // eslint-disable-next-line no-console
      console.error(error.response);
    }
  } else if (error.request) {
    // The request was made but no response was received.
    // `error.request` is an instance of XMLHttpRequest in the browser.
    // eslint-disable-next-line no-console
    console.error(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error.
    // eslint-disable-next-line no-console
    console.error(error.message);
  }
  return Promise.reject(error);
});

const getToken = () => {
  const state = store.getState();
  return get(state, 'auth.token');
};

store.subscribe(() => {
  authToken = getToken();
});

export class ApiClient {
  baseUrl;

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    authToken = getToken();
  }

  getUrl = (endpoint) => {
    // URLs in Django must have a trailing slash
    const endsWithTrailingSlash = endpoint.substring(endpoint.length - 1) === '/';
    return `${this.baseUrl}/${endpoint}${endsWithTrailingSlash ? '' : '/'}`;
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
      .then(response => ({
        data: get(response, 'data'),
        error: null,
      }));
  };

  /**
   * Make a GET request into the API.
   * @param endpoint
   * @param data
   * @param config
   * @returns {Promise}
   */
  get = (endpoint, data = {}, config = {}) => this.request({
    method: 'GET',
    endpoint,
    data: parseData(data),
    ...config,
  });

  /**
   * Make a POST request into the API.
   * @param endpoint
   * @param data
   * @param config
   * @returns {Promise}
   */
  post = (endpoint, data = {}, config = {}) => this.request({
    method: 'POST',
    endpoint,
    data: parseData(data),
    ...config,
  });

  /**
   * Make a DELETE request into the API.
   * @param endpoint
   * @param data
   * @param config
   * @returns {Promise}
   */
  delete = (endpoint, data = {}, config = {}) => this.request({
    method: 'DELETE',
    endpoint,
    data: parseData(data),
    ...config,
  });

  /**
   * Make a PUT request into the API.
   * @param endpoint
   * @param data
   * @param config
   * @returns {Promise}
   */
  put = (endpoint, data = {}, config = {}) => this.request({
    method: 'PUT',
    endpoint,
    data: parseData(data),
    ...config,
  });

  /**
   * Make a PATCH request into the API.
   * @param endpoint
   * @param data
   * @param config
   * @returns {Promise}
   */
  patch = (endpoint, data = {}, config = {}) => this.request({
    method: 'PATCH',
    endpoint,
    data: parseData(data),
    ...config,
  });
}

export default new ApiClient(constants.API_URL);
