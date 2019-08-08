import get from 'lodash/get';

export const getLocalizedFieldValue = (field, locale) => {
  return get(field, locale, null);
};

export const getLocalizedFieldValueWithFallback = (field, locale, fallbackLocales = []) => {
  const localeValue = getLocalizedFieldValue(field, locale);

  if (localeValue) {
    return localeValue;
  }

  let fallbackValue = null;
  fallbackLocales.find((fallbackLocale) => {
    fallbackValue = getLocalizedFieldValue(field, fallbackLocale, null);

    return fallbackValue;
  });


  return fallbackValue;
};
