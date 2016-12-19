import { expect } from 'chai';

import constants from 'constants/AppConstants';
import { getState } from 'utils/testUtils';
import {
  createTranslatedSelector,
  currentLanguageSelector,
} from './translationSelectors';

describe('state/selectors/dataSelectors', () => {
  describe('currentLanguageSelector', () => {
    it('returns default language if state does not contain locale', () => {
      const state = {};
      expect(currentLanguageSelector(state)).to.equal(constants.DEFAULT_LANGUAGE);
    });

    it('returns locale from state', () => {
      const locale = 'en';
      const state = getState({ intl: { locale } });
      expect(currentLanguageSelector(state)).to.equal(locale);
    });

    it('returns sv if locale is se', () => {
      const locale = 'se';
      const state = getState({ intl: { locale } });
      expect(currentLanguageSelector(state)).to.equal('sv');
    });
  });

  describe('createTranslatedSelector', () => {
    it('supports translating items in an array', () => {
      const items = [
        { id: 1, name: { en: 'Some name' } },
        { id: 2, name: { en: 'Other name' } },
      ];
      const expected = [
        { id: 1, name: 'Some name' },
        { id: 2, name: 'Other name' },
      ];
      const toTranslateSelector = () => items;
      const state = getState({ intl: { locale: 'en' } });
      const selected = createTranslatedSelector(toTranslateSelector)(state);
      expect(selected).to.deep.equal(expected);
    });

    it('supports translating items in an object', () => {
      const items = {
        1: { id: 1, name: { en: 'Some name' } },
        2: { id: 2, name: { en: 'Other name' } },
      };
      const expected = {
        1: { id: 1, name: 'Some name' },
        2: { id: 2, name: 'Other name' },
      };
      const toTranslateSelector = () => items;
      const state = getState({ intl: { locale: 'en' } });
      const selected = createTranslatedSelector(toTranslateSelector)(state);
      expect(selected).to.deep.equal(expected);
    });
  });
});
