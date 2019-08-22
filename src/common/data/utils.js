import get from 'lodash/get';
import values from 'lodash/values';
import pickBy from 'lodash/pickBy';

export const getLocalizedFieldValue = (field, locale, fallback = false) => {
  const localeValue = get(field, locale, null);

  if (localeValue || !fallback) {
    return localeValue;
  }

  return values(field).find(fallbackValue => !!fallbackValue);
};


export const parseData = (data) => {
  return pickBy(data, value => value || value === 0);
};
