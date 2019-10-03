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

  describe('parseData', () => {
    const data = {
      foo: 'Foo Bar',
      bar: '',
      foobar: 0
    };

    test('All empty and 0 value will be trimmed', () => {
      const actual = dataUtils.parseData(data);
      expect(actual).toMatchObject({
        foo: 'Foo Bar'
      });
    });

    test('Wont throw error in case data is empty', () => {
      const actual = dataUtils.parseData({});
      expect(actual).toMatchObject({});
    });
  });
});
