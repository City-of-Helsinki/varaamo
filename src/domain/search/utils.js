import get from 'lodash/get';
import range from 'lodash/range';
import capitalize from 'lodash/capitalize';
import sortBy from 'lodash/sortBy';

import constants from '../../../app/constants/AppConstants';

// TODO: Change to use query-string module.
export const getFiltersFromUrl = (location) => {
  const query = new URLSearchParams(location.search);
  const filters = {};

  query.forEach((value, key) => {
    if (constants.SUPPORTED_SEARCH_FILTERS[key] !== undefined) {
      filters[key] = value;
    }
  });

  return filters;
};

// TODO: Change to use query-string module.
export const getSearchFromFilters = (filters) => {
  const query = new URLSearchParams(filters);
  return query.toString();
};

export const getUnitOptions = (units, locale) => {
  const options = units.map(unit => ({
    value: unit.id,
    label: get(unit, `name[${locale}]`, ''),
  }));

  return sortBy(options, 'label');
};

export const getPurposeOptions = (purposes, locale) => {
  const options = purposes
    .filter(purpose => purpose.parent === null)
    .map(unit => ({
      value: unit.id,
      label: get(unit, `name[${locale}]`, ''),
    }));

  return sortBy(options, 'label');
};

/**
 * Getter for people capacity options.
 * @returns {{label: number, value: number}[]}
 */
export const getPeopleCapacityOptions = () => {
  return [
    ...range(1, 10),
    ...range(10, 35, 5),
    ...range(40, 110, 10),
  ].map(number => ({ label: number, value: number }));
};

/**
 * Getter for municipality options.
 * @returns {{label: string, value: string}[]}
 */
export const getMunicipalityOptions = () => {
  let municipalities = constants.DEFAULT_MUNICIPALITY_OPTIONS;

  if (Array.isArray(SETTINGS.CUSTOM_MUNICIPALITY_OPTIONS)
    && SETTINGS.CUSTOM_MUNICIPALITY_OPTIONS.length) {
    municipalities = SETTINGS.CUSTOM_MUNICIPALITY_OPTIONS;
  }

  return municipalities.map((municipality) => {
    const municipalityStr = typeof municipality === 'string' ? municipality : municipality.toString();

    return {
      value: municipalityStr.toLowerCase(),
      label: capitalize(municipalityStr),
    };
  });
};
