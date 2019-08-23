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

/**
 * Trim empty values from data object
 *
 * @param {Object} data
 * @returns {Object} Trimmed empty values object
 */

export const parseData = (data) => {
  return pickBy(data, value => value || value === 0);
};
