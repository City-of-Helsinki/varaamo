import axios from 'axios';

import { ApiClient } from '../client';
import constants from '../../../../app/constants/AppConstants';

jest.mock('axios');
let client;

const mockRequest = () => {
  client.request = jest.fn();
};

const baseUrl = 'http://www.foo.com';
const data = { foo: 'bar' };
const config = { conf1: 'foo', conf2: 'bar' };

describe('domain/common/api/client.js', () => {
  beforeEach(() => {
    client = new ApiClient(baseUrl);
  });

  test('getUrl', () => {
    const url = client.getUrl('endpoint');
    expect(url).toBe(`${baseUrl}/endpoint/`);
  });

  describe('getHeaders', () => {
    test('does have required api headers', () => {
      const headers = client.getHeaders();
      expect(headers).toMatchObject(constants.REQUIRED_API_HEADERS);
    });

    // TODO: Check that headers include auth token when logged in.
  });

  test('request', () => {
    const headers = { testHeader: 'foo' };
    axios.request.mockResolvedValue({ data: [] });

    client.request({
      endpoint: 'endpoint',
      method: 'GET',
      data,
      headers,
    });

    client.request({
      endpoint: 'endpoint',
      method: 'POST',
      data,
      headers,
    });

    expect(axios.request.mock.calls.length).toBe(2);

    expect(axios.request.mock.calls[0][0].method).toBe('GET');
    expect(axios.request.mock.calls[0][0].url).toBe(`${baseUrl}/endpoint/`);
    expect(axios.request.mock.calls[0][0].params).toMatchObject(data);
    expect(axios.request.mock.calls[0][0].headers).toMatchObject(headers);

    expect(axios.request.mock.calls[1][0].method).toBe('POST');
    expect(axios.request.mock.calls[1][0].url).toBe(`${baseUrl}/endpoint/`);
    expect(axios.request.mock.calls[1][0].data).toMatchObject(data);
    expect(axios.request.mock.calls[1][0].headers).toMatchObject(headers);
  });

  test('get', () => {
    mockRequest();
    client.get('endpoint', data, config);

    expect(client.request.mock.calls.length).toBe(1);
    expect(client.request.mock.calls[0][0].method).toBe('GET');
    expect(client.request.mock.calls[0][0].endpoint).toBe('endpoint');
    expect(client.request.mock.calls[0][0].data).toMatchObject(data);
    expect(client.request.mock.calls[0][0]).toMatchObject(config);
  });

  test('post', () => {
    mockRequest();
    client.post('endpoint', data, config);

    expect(client.request.mock.calls.length).toBe(1);
    expect(client.request.mock.calls[0][0].method).toBe('POST');
    expect(client.request.mock.calls[0][0].endpoint).toBe('endpoint');
    expect(client.request.mock.calls[0][0].data).toMatchObject(data);
    expect(client.request.mock.calls[0][0]).toMatchObject(config);
  });

  test('delete', () => {
    mockRequest();
    client.delete('endpoint', data, config);

    expect(client.request.mock.calls.length).toBe(1);
    expect(client.request.mock.calls[0][0].method).toBe('DELETE');
    expect(client.request.mock.calls[0][0].endpoint).toBe('endpoint');
    expect(client.request.mock.calls[0][0].data).toMatchObject(data);
    expect(client.request.mock.calls[0][0]).toMatchObject(config);
  });

  test('put', () => {
    mockRequest();
    client.put('endpoint', data, config);

    expect(client.request.mock.calls.length).toBe(1);
    expect(client.request.mock.calls[0][0].method).toBe('PUT');
    expect(client.request.mock.calls[0][0].endpoint).toBe('endpoint');
    expect(client.request.mock.calls[0][0].data).toMatchObject(data);
    expect(client.request.mock.calls[0][0]).toMatchObject(config);
  });

  test('patch', () => {
    mockRequest();
    client.patch('endpoint', data, config);

    expect(client.request.mock.calls.length).toBe(1);
    expect(client.request.mock.calls[0][0].method).toBe('PATCH');
    expect(client.request.mock.calls[0][0].endpoint).toBe('endpoint');
    expect(client.request.mock.calls[0][0].data).toMatchObject(data);
    expect(client.request.mock.calls[0][0]).toMatchObject(config);
  });
});
