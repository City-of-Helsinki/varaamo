import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import mapValues from 'lodash/mapValues';
import some from 'lodash/some';
import { createSelector } from 'reselect';

import constants from 'constants/AppConstants';

function currentLanguageSelector(state) {
  const locale = state.intl ? state.intl.locale : constants.DEFAULT_LOCALE;
  return locale === 'se' ? 'sv' : locale;
}

function isTranslatable(prop) {
  if (!isObject(prop)) {
    return false;
  }
  return some(constants.SUPPORTED_LANGUAGES, language => prop[language]);
}

function translateValue(prop, language) {
  if (prop[language]) {
    return prop[language];
  } else if (prop[constants.DEFAULT_LOCALE]) {
    return prop[constants.DEFAULT_LOCALE];
  }
  return '';
}

// Replaces item properties containing multiple languages with values in the current language.
// For example if the current language is 'fi':
// { name: { en: 'Name', fi: 'Nimi' } } -> { name: 'Nimi' }
function translateItem(item, language) {
  if (isTranslatable(item)) {
    return translateValue(item, language);
  } else if (isArray(item)) {
    return item.map(value => translateItem(value, language));
  } else if (isObject(item)) {
    return mapValues(item, value => translateItem(value, language));
  }
  return item;
}

// Translates items returned by the toTranslateSelector given as an argument.
// Supports translating single items, items in an array or items indexed to an object.
function createTranslatedSelector(toTranslateSelector) {
  return createSelector(
    toTranslateSelector,
    currentLanguageSelector,
    (toTranslate, language) => {
      if (isArray(toTranslate)) {
        return toTranslate.map(item => translateItem(item, language));
      }
      return mapValues(toTranslate, item => translateItem(item, language));
    }
  );
}

export {
  createTranslatedSelector,
  currentLanguageSelector,
};
