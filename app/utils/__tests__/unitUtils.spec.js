import { expect } from 'chai';

import {
  getServiceMapUrl,
} from 'utils/unitUtils';

describe('Utils: unitUtils', () => {
  describe('getServiceMapUrl', () => {
    it('returns correct url', () => {
      const unit = { id: 'abc:123' };
      const expected = 'https://palvelukartta.hel.fi/unit/123#!route-details';

      expect(getServiceMapUrl(unit)).to.equal(expected);
    });
  });
});
