import axios from 'axios';
import get from 'lodash/get';

import constants from '../../../app/constants/AppConstants';
import { getUrl, getHeaders } from './utils';

export class ApiClient {
  baseUrl;

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  request = async ({
    method,
    endpoint,
    data = {},
    headers = {},
  }) => {
    const dataOrParams = ['GET', 'DELETE'].includes(method.toUpperCase()) ? 'params' : 'data';

    return axios
      .request({
        url: getUrl(endpoint),
        headers: {
          ...getHeaders(),
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
