import get from 'lodash/get';
import values from 'lodash/values';

export const getLocalizedFieldValue = (field, locale) => {
  return get(field, locale, null);
};

export const getLocalizedFieldValueWithFallback = (field, locale) => {
  const localeValue = getLocalizedFieldValue(field, locale);

  if (localeValue) {
    return localeValue;
  }

  return values(field).find(fallback => !!fallback);
};
