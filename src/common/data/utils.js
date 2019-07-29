import get from 'lodash/get';

export const getLocalizedFieldValue = (field, locale) => {
  return get(field, locale, null);
};
