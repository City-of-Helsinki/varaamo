import isFunction from 'lodash/isFunction';

import * as fixtureUtils from '../utils';

describe('src/common/data/fixtures/utils.js', () => {
  test('getLocalizedFieldSequenceGeneratorFunction', () => {
    const generatorFunction = fixtureUtils
      .getLocalizedFieldSequenceGeneratorFunction('FooBar', ['en', 'fi', 'sv']);

    expect(isFunction(generatorFunction)).toBe(true);
    expect(generatorFunction(1)).toEqual({
      en: 'FooBar (en) - 1',
      fi: 'FooBar (fi) - 1',
      sv: 'FooBar (sv) - 1',
    });
  });
});
