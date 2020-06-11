import { RSAA } from 'redux-api-middleware';

import constants from '../../constants/AppConstants';
import {
  buildAPIUrl,
  createTransformFunction,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSearchParamsString,
  getSuccessTypeDescriptor,
} from '../apiUtils';
import schemas from '../../store/middleware/Schemas';

describe('Utils: apiUtils', () => {
  describe('buildAPIUrl', () => {
    const endpoint = 'some/endpoint';

    test('returns API_URL + given endpoint if params is empty', () => {
      const expected = `${constants.API_URL}/${endpoint}/`;

      expect(buildAPIUrl(endpoint)).toBe(expected);
    });

    test('rejects params with empty values', () => {
      const params = { empty: '' };
      const expected = `${constants.API_URL}/${endpoint}/`;

      expect(buildAPIUrl(endpoint, params)).toBe(expected);
    });

    test('appends search params at the end if params is not empty', () => {
      const params = { param: 'hello_world' };
      const expected = `${constants.API_URL}/${endpoint}/?param=hello_world`;

      expect(buildAPIUrl(endpoint, params)).toBe(expected);
    });
  });

  describe('createTransformFunction', () => {
    test('returns a function', () => {
      expect(typeof createTransformFunction()).toBe('function');
    });

    describe('the returned function', () => {
      test('camelizes object keys', () => {
        const transformFunction = createTransformFunction();
        const initial = {
          some_key: {
            nested_key: 'value',
          },
        };
        const expected = {
          someKey: {
            nestedKey: 'value',
          },
        };

        expect(transformFunction(initial)).toEqual(expected);
      });

      describe('if normalizr Schema is provided', () => {
        test('uses the Schema to normalize data', () => {
          const transformFunction = createTransformFunction(
            schemas.resourceSchema
          );
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

          expect(transformFunction(initialResourceData)).toEqual(
            expectedResourceData
          );
        });
      });
    });
  });

  describe('getErrorTypeDescriptor', () => {
    const actionType = 'SOME_GET_ERROR';

    test('returns an object', () => {
      expect(typeof getErrorTypeDescriptor(actionType)).toBe('object');
    });

    test('contains the given action type', () => {
      const actual = getErrorTypeDescriptor(actionType).type;

      expect(actual).toBe(actionType);
    });

    test('contains a meta function', () => {
      expect(typeof getErrorTypeDescriptor(actionType).meta).toBe('function');
    });

    describe('the meta function', () => {
      const mockAction = {
        [RSAA]: {
          types: [{ type: 'SOME_GET_REQUEST' }],
        },
      };

      test('returns an object with correct properties', () => {
        const typeDescriptor = getErrorTypeDescriptor(actionType);
        const actual = typeDescriptor.meta(mockAction);
        const expected = {
          API_ACTION: {
            apiRequestFinish: true,
            countable: undefined,
            type: 'SOME_GET_REQUEST',
          },
        };

        expect(actual).toEqual(expected);
      });

      test('supports adding a countable property', () => {
        const typeDescriptor = getErrorTypeDescriptor(actionType, {
          countable: true,
        });
        const actual = typeDescriptor.meta(mockAction);
        const expected = {
          API_ACTION: {
            apiRequestFinish: true,
            countable: true,
            type: 'SOME_GET_REQUEST',
          },
        };

        expect(actual).toEqual(expected);
      });

      test('supports adding extra meta properties', () => {
        const typeDescriptor = getErrorTypeDescriptor(actionType, {
          meta: { test: 'test' },
        });
        const actual = typeDescriptor.meta(mockAction);
        const expected = {
          API_ACTION: {
            apiRequestFinish: true,
            countable: undefined,
            type: 'SOME_GET_REQUEST',
          },
          test: 'test',
        };

        expect(actual).toEqual(expected);
      });
    });
  });

  describe('getHeadersCreator', () => {
    test('returns a function', () => {
      expect(typeof getHeadersCreator()).toBe('function');
    });

    describe('the returned function', () => {
      describe('when user is logged in', () => {
        const state = {
          auth: {
            token: 'mock-token',
          },
        };
        const authorizationHeader = { Authorization: 'JWT mock-token' };

        describe('if no additional headers are specified', () => {
          test('returns the required headers and Authorization header', () => {
            const creator = getHeadersCreator();
            const expected = {
              ...constants.REQUIRED_API_HEADERS,
              ...authorizationHeader,
            };

            expect(creator(state)).toEqual(expected);
          });
        });

        describe('if additional headers are specified', () => {
          test('returns the required, the additional and Authorization headers', () => {
            const additionalHeaders = {
              header: 'value',
            };
            const creator = getHeadersCreator(additionalHeaders);
            const expected = {
              ...constants.REQUIRED_API_HEADERS,
              ...additionalHeaders,
              ...authorizationHeader,
            };

            expect(creator(state)).toEqual(expected);
          });
        });
      });

      describe('when user is logged out', () => {
        const state = {
          auth: {},
        };

        describe('if no additional headers are specified', () => {
          test('returns the just the required headers', () => {
            const creator = getHeadersCreator();

            expect(creator(state)).toEqual(constants.REQUIRED_API_HEADERS);
          });
        });

        describe('if additional headers are specified', () => {
          test('returns the required headers and the additional headers', () => {
            const additionalHeaders = {
              header: 'value',
            };
            const creator = getHeadersCreator(additionalHeaders);
            const expected = {
              ...constants.REQUIRED_API_HEADERS,
              ...additionalHeaders,
            };

            expect(creator(state)).toEqual(expected);
          });
        });
      });
    });
  });

  describe('getRequestTypeDescriptor', () => {
    const actionType = 'SOME_GET_REQUEST';

    test('returns an object', () => {
      expect(typeof getRequestTypeDescriptor(actionType)).toBe('object');
    });

    test('contains the given action type', () => {
      const actual = getRequestTypeDescriptor(actionType).type;

      expect(actual).toBe(actionType);
    });

    test('contains a meta object with correct properties', () => {
      const actual = getRequestTypeDescriptor(actionType).meta;
      const expected = {
        API_ACTION: {
          apiRequestStart: true,
          countable: undefined,
          type: 'SOME_GET_REQUEST',
        },
      };

      expect(actual).toEqual(expected);
    });

    test('supports adding coutable property to meta object', () => {
      const actual = getRequestTypeDescriptor(actionType, { countable: true })
        .meta;
      const expected = {
        API_ACTION: {
          apiRequestStart: true,
          countable: true,
          type: 'SOME_GET_REQUEST',
        },
      };

      expect(actual).toEqual(expected);
    });

    test('supports adding extra meta properties', () => {
      const actual = getRequestTypeDescriptor(actionType, {
        meta: { test: 'test' },
      }).meta;
      const expected = {
        API_ACTION: {
          apiRequestStart: true,
          countable: undefined,
          type: 'SOME_GET_REQUEST',
        },
        test: 'test',
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('getSearchParamsString', () => {
    test('returns key and value of the param with "=" in between', () => {
      const params = { param: 'hello' };
      const expected = 'param=hello';

      expect(getSearchParamsString(params)).toBe(expected);
    });

    test('returns multiple params separated with "&"', () => {
      const params = { param: 'hello', other: 'world' };
      const expected = 'param=hello&other=world';

      expect(getSearchParamsString(params)).toBe(expected);
    });

    test('uses encodeURIComponent to both keys and values', () => {
      const params = { päräm: 'hellö' };
      const expected = `${encodeURIComponent('päräm')}=${encodeURIComponent(
        'hellö'
      )}`;

      expect(getSearchParamsString(params)).toBe(expected);
    });

    test('decamelizes keys of the given params', () => {
      const params = { camelizedParam: 'hello' };
      const expected = 'camelized_param=hello';

      expect(getSearchParamsString(params)).toBe(expected);
    });
  });

  describe('getSuccessTypeDescriptor', () => {
    const actionType = 'SOME_GET_SUCCESS';

    test('returns an object', () => {
      expect(typeof getSuccessTypeDescriptor(actionType)).toBe('object');
    });

    test('contains the given action type', () => {
      const actual = getSuccessTypeDescriptor(actionType).type;

      expect(actual).toBe(actionType);
    });

    test('contains a payload function', () => {
      expect(typeof getSuccessTypeDescriptor(actionType).payload).toBe(
        'function'
      );
    });

    test('contains a meta function', () => {
      expect(typeof getSuccessTypeDescriptor(actionType).meta).toBe('function');
    });

    describe('the meta function', () => {
      const mockAction = {
        [RSAA]: {
          types: [{ type: 'SOME_GET_REQUEST' }],
        },
      };

      test('returns an object with correct properties', () => {
        const typeDescriptor = getSuccessTypeDescriptor(actionType);
        const actual = typeDescriptor.meta(mockAction);
        const expected = {
          API_ACTION: {
            apiRequestFinish: true,
            countable: undefined,
            type: 'SOME_GET_REQUEST',
          },
        };

        expect(actual).toEqual(expected);
      });

      test('supports adding a countable property', () => {
        const typeDescriptor = getSuccessTypeDescriptor(actionType, {
          countable: true,
        });
        const actual = typeDescriptor.meta(mockAction);
        const expected = {
          API_ACTION: {
            apiRequestFinish: true,
            countable: true,
            type: 'SOME_GET_REQUEST',
          },
        };

        expect(actual).toEqual(expected);
      });

      test('supports adding payload property', () => {
        const typeDescriptor = getSuccessTypeDescriptor(actionType, {
          payload: 'mock-payload',
        });

        expect(typeDescriptor.payload).toBe('mock-payload');
      });

      test('supports adding extra meta properties', () => {
        const typeDescriptor = getSuccessTypeDescriptor(actionType, {
          meta: { test: 'test' },
        });
        const actual = typeDescriptor.meta(mockAction);
        const expected = {
          API_ACTION: {
            apiRequestFinish: true,
            countable: undefined,
            type: 'SOME_GET_REQUEST',
          },
          test: 'test',
        };

        expect(actual).toEqual(expected);
      });
    });
  });
});
