import {
  getServiceMapUrl,
} from '../unitUtils';

describe('Utils: unitUtils', () => {
  describe('getServiceMapUrl', () => {
    test('returns correct url', () => {
      const unit = { id: 'abc:123' };
      const expected = 'https://palvelukartta.hel.fi/unit/123';

      expect(getServiceMapUrl(unit)).toBe(expected);
    });
  });
});
