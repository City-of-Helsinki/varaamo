import * as dataUtils from '../utils';

describe('common/data/utils.js', () => {
  describe('getLocalizedFieldValue', () => {
    const field = {
      en: 'Foo Bar',
    };

    test('Get defined locale', () => {
      const actual = dataUtils.getLocalizedFieldValue(field, 'en');
      expect(actual).toBe(field.en);
    });

    test('Get undefined locale', () => {
      const actual = dataUtils.getLocalizedFieldValue(field, 'fi');
      expect(actual).toBeNull();
    });
  });
});
