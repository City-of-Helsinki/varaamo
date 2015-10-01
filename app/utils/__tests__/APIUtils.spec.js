import { expect } from 'chai';

import { resourceSchema } from 'middleware/Schemas';
import { createTransformFunction } from 'utils/APIUtils';

describe('Utils: APIUtils', () => {
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
});
