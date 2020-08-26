import axios from 'axios';

import { AccessibilityApiClient } from '../accessibilityClient';
import {
  mockSentencesResponseData,
  mockShortcomingsResponseData,
  mockViewpointsResponseData,
} from '../__fixtures__/accessibilityClientFixtures';

jest.mock('axios');

const apiUrl = 'https://test.test';
const systemId = '1234';
const resourceId = 1234;
const client = new AccessibilityApiClient(apiUrl, systemId);

describe('domain/common/api/accessibilityClient.js', () => {
  describe('getSentences', () => {
    beforeEach(() => {
      axios.request.mockResolvedValueOnce({
        data: mockSentencesResponseData,
      });
    });

    it('returns results in correct format', () => {
      expect(client.getSentences(resourceId)).resolves.toMatchSnapshot();
    });

    it('makes request to correct endpoint', () => {
      client.getSentences(resourceId);
      expect(axios.request.mock.calls[0][0].method).toBe('GET');
      expect(axios.request.mock.calls[0][0].url).toBe(
        `${apiUrl}/targets/${systemId}/${resourceId}/sentences/`,
      );
    });
  });

  describe('getShortcomings', () => {
    beforeEach(() => {
      axios.request
        .mockResolvedValueOnce({
          data: mockShortcomingsResponseData,
        })
        .mockResolvedValueOnce({ data: mockViewpointsResponseData });
    });

    it('returns results in correct format', () => {
      expect(client.getShortcomings(resourceId)).resolves.toMatchSnapshot();
    });

    it('makes requests to correct endpoints', () => {
      client.getShortcomings(resourceId);
      expect(axios.request.mock.calls[0][0].method).toBe('GET');
      expect(axios.request.mock.calls[0][0].url).toBe(
        `${apiUrl}/targets/${systemId}/${resourceId}/shortages/`,
      );
      expect(axios.request.mock.calls[1][0].method).toBe('GET');
      expect(axios.request.mock.calls[1][0].url).toBe(`${apiUrl}/viewpoints/`);
    });
  });
});
