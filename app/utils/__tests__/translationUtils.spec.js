import { expect } from 'chai';

import { getProperty } from 'utils/translationUtils';

describe('Utils: translationUtils', () => {
  describe('getProperty', () => {
    it('returns an empty string if item is undefined', () => {
      const item = undefined;

      expect(getProperty(item, 'name')).to.equal('');
    });

    it('returns an empty string if item[property] is undefined', () => {
      const item = {};

      expect(getProperty(item, 'name')).to.equal('');
    });

    it('returns an empty string if the property does not have the given language', () => {
      const item = { name: { fi: 'Finnish name' } };

      expect(getProperty(item, 'name', 'en')).to.equal('');
    });

    it('returns translated value with the given language', () => {
      const item = { name: { en: 'Some name' } };

      expect(getProperty(item, 'name', 'en')).to.equal('Some name');
    });

    it('returns translated value with default language', () => {
      const item = {
        name: {
          fi: 'Finnish name',
          en: 'English name',
        },
      };

      expect(getProperty(item, 'name')).to.equal('Finnish name');
    });
  });
});
