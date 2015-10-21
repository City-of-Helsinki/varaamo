import { expect } from 'chai';

import { API_URL, REQUIRED_API_HEADERS } from 'constants/AppConstants';
import { resourceSchema } from 'middleware/Schemas';
import {
  buildAPIUrl,
  createTransformFunction,
  getHeaders,
  getSearchParamsString,
  getSuccessTypeDescriptor,
} from 'utils/APIUtils';

describe('Utils: APIUtils', () => {
  describe('buildAPIUrl', () => {
    const endpoint = 'some/endpoint';

    it('should return API_URL + given endpoint if params is empty', () => {
      const expected = `${API_URL}/${endpoint}/`;

      expect(buildAPIUrl(endpoint)).to.equal(expected);
    });

    it('should reject params with empty values', () => {
      const params = { empty: '' };
      const expected = `${API_URL}/${endpoint}/`;

      expect(buildAPIUrl(endpoint, params)).to.equal(expected);
    });

    it('should append search params at the end if params is not empty', () => {
      const params = { param: 'hello_world' };
      const expected = `${API_URL}/${endpoint}/?param=hello_world`;

      expect(buildAPIUrl(endpoint, params)).to.equal(expected);
    });
  });

  describe('createTransformFunction', () => {
    it('should return a function', () => {
      expect(typeof createTransformFunction()).to.equal('function');
    });

    describe('the returned function', () => {
      it('should camelize object keys', () => {
        const transformFunction = createTransformFunction();
        const initial = {
          'some_key': {
            'nested_key': 'value',
          },
        };
        const expected = {
          someKey: {
            nestedKey: 'value',
          },
        };

        expect(transformFunction(initial)).to.deep.equal(expected);
      });

      describe('if normalizr Schema is provided', () => {
        it('should use the Schema to normalize data', () => {
          const transformFunction = createTransformFunction(resourceSchema);
          const initialResourceData = {
            id: 'r-1',
            unit: {
              id: 'u-1',
            },
          };
          const expectedResourceData = {
            entities: {
              resources: {
                'r-1': { id: 'r-1', unit: 'u-1' },
              },
              units: {
                'u-1': { id: 'u-1' },
              },
            },
            result: 'r-1',
          };

          expect(transformFunction(initialResourceData)).to.deep.equal(expectedResourceData);
        });
      });
    });
  });

  describe('getHeaders', () => {
    describe('if no additional headers are specified', () => {
      it('should return just the required headers', () => {
        expect(getHeaders()).to.deep.equal(REQUIRED_API_HEADERS);
      });
    });

    describe('if additional headers are specified', () => {
      it('should return the required headers and the additional headers', () => {
        const additionalHeaders = {
          header: 'value',
        };
        const expected = Object.assign({}, REQUIRED_API_HEADERS, additionalHeaders);

        expect(getHeaders(additionalHeaders)).to.deep.equal(expected);
      });
    });
  });

  describe('getSearchParamsString', () => {
    it('should return key and value of the param with "=" in between', () => {
      const params = { param: 'hello' };
      const expected = 'param=hello';

      expect(getSearchParamsString(params)).to.equal(expected);
    });

    it('should return multiple params separated with "&"', () => {
      const params = { param: 'hello', other: 'world' };
      const expected = 'param=hello&other=world';

      expect(getSearchParamsString(params)).to.equal(expected);
    });

    it('should use encodeURIComponent to both keys and values', () => {
      const params = { päräm: 'hellö' };
      const expected = `${encodeURIComponent('päräm')}=${encodeURIComponent('hellö')}`;

      expect(getSearchParamsString(params)).to.equal(expected);
    });

    it('should decamelize keys of the given params', () => {
      const params = { camelizedParam: 'hello' };
      const expected = 'camelized_param=hello';

      expect(getSearchParamsString(params)).to.equal(expected);
    });
  });

  describe('getSuccessTypeDescriptor', () => {
    const actionType = 'SUCCESS';

    it('should return an object', () => {
      expect(typeof getSuccessTypeDescriptor(actionType)).to.equal('object');
    });

    it('should contain the given action type', () => {
      const actual = getSuccessTypeDescriptor(actionType).type;

      expect(actual).to.equal(actionType);
    });

    it('should contain a payload function', () => {
      expect(typeof getSuccessTypeDescriptor(actionType).payload).to.equal('function');
    });
  });
});
