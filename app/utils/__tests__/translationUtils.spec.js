import { expect } from 'chai';

import { getName, getProperty } from 'utils/translationUtils';

describe('Utils: translationUtils', () => {
  describe('getName', () => {
    it('returns an empty string if item is undefined', () => {
      const item = undefined;

      expect(getName(item)).to.equal('');
    });

    it('returns an empty string if item.name is undefined', () => {
      const item = {};

      expect(getName(item)).to.equal('');
    });

    it('returns an empty string if item.name.fi is undefined', () => {
      const item = { name: {} };

      expect(getName(item)).to.equal('');
    });

    it('returns item.name.fi', () => {
      const item = { name: { fi: 'Some name' } };

      expect(getName(item)).to.equal('Some name');
    });
  });

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
